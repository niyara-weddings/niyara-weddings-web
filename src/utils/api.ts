import { ApiResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let _logoutCallback: (() => void) | null = null;
let isRefreshing = false;
let refreshSubscribers: ((access_token: string) => void)[] = [];

export function setLogoutCallback(callback: () => void) {
  _logoutCallback = callback;
}

const subscribeTokenRefresh = (cb: (access_token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (access_token: string) => {
  refreshSubscribers.map((cb) => cb(access_token));
  refreshSubscribers = [];
};

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    return {
      success: false,
      data: null as any,
      message: data.message || 'An error occurred',
      errors: data.errors || [],
      status: data.status || 'error',
      code: response.status
    };
  }

  return {
    success: true,
    data: data.data || data,
    message: data.message || 'Success',
    status: data.status || 'success',
    code: response.status
  };
}

async function fetchWithInterceptor(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('access_token');
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401 && token) {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.data?.tokens?.access || refreshData.access;
            if (newAccessToken) {
              localStorage.setItem('access_token', newAccessToken);
              onRefreshed(newAccessToken);
              // Retry original request
              headers.set('Authorization', `Bearer ${newAccessToken}`);
              response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
            } else {
              throw new Error("Invalid token refresh response");
            }
          } else {
            throw new Error("Token refresh rejected");
          }
        } catch {
          if (_logoutCallback) _logoutCallback();
        } finally {
          isRefreshing = false;
        }
      } else {
        // Wait for the token to be refreshed
        return new Promise<Response>((resolve) => {
          subscribeTokenRefresh((newAccessToken) => {
            headers.set('Authorization', `Bearer ${newAccessToken}`);
            fetch(`${BASE_URL}${endpoint}`, { ...options, headers }).then(resolve);
          });
        });
      }
    } else if (_logoutCallback) {
      _logoutCallback();
    }
  }

  return response;
}

export const apiGet = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  if (!BASE_URL) return { success: false, message: "API URL missing", data: null as any, status: 'error', code: 500 };
  try {
    const response = await fetchWithInterceptor(endpoint, { method: 'GET' });
    return await handleResponse<T>(response);
  } catch (error: any) {
    return { success: false, message: error.message, data: null as any, errors: [error.message], status: 'error', code: 500 };
  }
};

export const apiPost = async <T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  if (!BASE_URL) return { success: false, message: "API URL missing", data: null as any, status: 'error', code: 500 };
  try {
    const response = await fetchWithInterceptor(endpoint, { method: 'POST', body: JSON.stringify(body) });
    return await handleResponse<T>(response);
  } catch (error: any) {
    return { success: false, message: error.message, data: null as any, errors: [error.message], status: 'error', code: 500 };
  }
};

export const apiPut = async <T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  if (!BASE_URL) return { success: false, message: "API URL missing", data: null as any, status: 'error', code: 500 };
  try {
    const response = await fetchWithInterceptor(endpoint, { method: 'PUT', body: JSON.stringify(body) });
    return await handleResponse<T>(response);
  } catch (error: any) {
    return { success: false, message: error.message, data: null as any, errors: [error.message], status: 'error', code: 500 };
  }
};

export const apiPatch = async <T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  if (!BASE_URL) return { success: false, message: "API URL missing", data: null as any, status: 'error', code: 500 };
  try {
    const response = await fetchWithInterceptor(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
    return await handleResponse<T>(response);
  } catch (error: any) {
    return { success: false, message: error.message, data: null as any, errors: [error.message], status: 'error', code: 500 };
  }
};

export const apiDelete = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  if (!BASE_URL) return { success: false, message: "API URL missing", data: null as any, status: 'error', code: 500 };
  try {
    const response = await fetchWithInterceptor(endpoint, { method: 'DELETE' });
    return await handleResponse<T>(response);
  } catch (error: any) {
    return { success: false, message: error.message, data: null as any, errors: [error.message], status: 'error', code: 500 };
  }
};

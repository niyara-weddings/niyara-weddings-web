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

/**
 * Build the request URL. In the browser, use relative URLs so requests
 * flow through Next.js rewrites (no CORS). On the server or for non-API
 * paths, fall back to the full BASE_URL.
 */
function buildUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const isClient = typeof window !== 'undefined';

  if (isClient && cleanEndpoint.startsWith('/api/')) {
    // Relative URL → Next.js rewrites proxy to backend → zero CORS issues
    return cleanEndpoint;
  }

  const baseUrl = BASE_URL?.replace(/\/$/, '') || '';
  let url = `${baseUrl}${cleanEndpoint}`;
  if (baseUrl.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    url = `${baseUrl}${cleanEndpoint.substring(4)}`;
  }
  return url;
}

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
      message: data.message || `Request failed (${response.status})`,
      errors: data.errors || [],
      status: data.status || 'error',
      code: response.status,
      meta: null,
    };
  }

  return {
    success: true,
    data: data.data ?? data,
    message: data.message || 'Success',
    status: data.status || 'success',
    code: response.status,
    meta: data.meta || null,
  };
}

async function fetchWithInterceptor(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  options.credentials = 'include';

  // Only set Content-Type for requests that have a body
  if (options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const url = buildUrl(endpoint);

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshUrl = buildUrl('/api/v1/auth/token/refresh/');

        const refreshRes = await fetch(refreshUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (refreshRes.ok) {
          onRefreshed("token_refreshed");
          response = await fetch(url, { ...options, headers });
        } else {
          throw new Error("Token refresh rejected");
        }
      } catch {
        if (_logoutCallback) _logoutCallback();
      } finally {
        isRefreshing = false;
      }
    } else {
      return new Promise<Response>((resolve) => {
        subscribeTokenRefresh(() => {
          fetch(url, { ...options, headers }).then(resolve);
        });
      });
    }
  }

  return response;
}

export const apiGet = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetchWithInterceptor(endpoint, { method: 'GET' });
    return await handleResponse<T>(response);
  } catch (error: any) {
    return { success: false, message: error.message || 'Network error', data: null as any, errors: [error.message], status: 'error', code: 0 };
  }
};

export const apiPost = async <T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  try {
    const isFormData = body instanceof FormData;
    const response = await fetchWithInterceptor(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
    return await handleResponse<T>(response);
  } catch (error: any) {
    return { success: false, message: error.message || 'Network error', data: null as any, errors: [error.message], status: 'error', code: 0 };
  }
};

export const apiPut = async <T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  try {
    const isFormData = body instanceof FormData;
    const response = await fetchWithInterceptor(endpoint, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body)
    });
    return await handleResponse<T>(response);
  } catch (error: any) {
    return { success: false, message: error.message || 'Network error', data: null as any, errors: [error.message], status: 'error', code: 0 };
  }
};

export const apiPatch = async <T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  try {
    const isFormData = body instanceof FormData;
    const response = await fetchWithInterceptor(endpoint, {
      method: 'PATCH',
      body: isFormData ? body : JSON.stringify(body)
    });
    return await handleResponse<T>(response);
  } catch (error: any) {
    return { success: false, message: error.message || 'Network error', data: null as any, errors: [error.message], status: 'error', code: 0 };
  }
};

export const apiDelete = async <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetchWithInterceptor(endpoint, { method: 'DELETE' });
    return await handleResponse<T>(response);
  } catch (error: any) {
    return { success: false, message: error.message || 'Network error', data: null as any, errors: [error.message], status: 'error', code: 0 };
  }
};

export const getMediaUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = BASE_URL?.replace(/\/$/, '') || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (baseUrl.endsWith('/api') && cleanPath.startsWith('/api/')) {
    return `${baseUrl}${cleanPath.substring(4)}`;
  }
  return `${baseUrl}${cleanPath}`;
};

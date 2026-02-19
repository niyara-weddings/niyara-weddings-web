/**
 * API Utility functions for standardizing requests to the backend.
 * Handles JWT authentication and standardized error formatting.
 */

// Strictly use environment variable for API URL to avoid hardcoding.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let _logoutCallback = null;

export function setLogoutCallback(callback) {
  _logoutCallback = callback;
}

/**
 * Standardizes the response from the API.
 * @param {Response} response - The fetch response object.
 * @returns {Promise<Object>} The standardized response data.
 */
async function handleResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401 && _logoutCallback) {
      _logoutCallback(); // Trigger logout on 401
    }
    return {
      success: false,
      data: null,
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

/**
 * Performs a GET request.
 * @param {string} endpoint - The API endpoint to call.
 * @returns {Promise<Object>} The standardized response.
 */
export const apiGet = async (endpoint) => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined in environment variables.");
    return { success: false, message: "Configuration error: API URL missing." };
  }
  
  try {
    const token = localStorage.getItem('access_token');
    console.log('API Call (GET):', endpoint, 'Token:', token ? 'Present' : 'Missing'); // DEBUG LOG
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
      errors: [error.message],
      status: 'error',
      code: 500
    };
  }
};

/**
 * Performs a POST request.
 * @param {string} endpoint - The API endpoint to call.
 * @param {Object} body - The request body.
 * @returns {Promise<Object>} The standardized response.
 */
export const apiPost = async (endpoint, body) => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined in environment variables.");
    return { success: false, message: "Configuration error: API URL missing." };
  }

  try {
    const token = localStorage.getItem('access_token');
    console.log('API Call (POST):', endpoint, 'Token:', token ? 'Present' : 'Missing'); // DEBUG LOG
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
      errors: [error.message],
      status: 'error',
      code: 500
    };
  }
};

/**
 * Performs a PUT request.
 * @param {string} endpoint - The API endpoint to call.
 * @param {Object} body - The request body.
 * @returns {Promise<Object>} The standardized response.
 */
export const apiPut = async (endpoint, body) => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined in environment variables.");
    return { success: false, message: "Configuration error: API URL missing." };
  }

  try {
    const token = localStorage.getItem('access_token');
    console.log('API Call (PUT):', endpoint, 'Token:', token ? 'Present' : 'Missing'); // DEBUG LOG
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
      errors: [error.message],
      status: 'error',
      code: 500
    };
  }
};

/**
 * Performs a PATCH request.
 * @param {string} endpoint - The API endpoint to call.
 * @param {Object} body - The request body.
 * @returns {Promise<Object>} The standardized response.
 */
export const apiPatch = async (endpoint, body) => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined in environment variables.");
    return { success: false, message: "Configuration error: API URL missing." };
  }

  try {
    const token = localStorage.getItem('access_token');
    console.log('API Call (PATCH):', endpoint, 'Token:', token ? 'Present' : 'Missing'); // DEBUG LOG
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
      errors: [error.message],
      status: 'error',
      code: 500
    };
  }
};

/**
 * Performs a DELETE request.
 * @param {string} endpoint - The API endpoint to call.
 * @returns {Promise<Object>} The standardized response.
 */
export const apiDelete = async (endpoint) => {
  if (!BASE_URL) {
    console.error("NEXT_PUBLIC_API_URL is not defined in environment variables.");
    return { success: false, message: "Configuration error: API URL missing." };
  }

  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null,
      errors: [error.message],
      status: 'error',
      code: 500
    };
  }
};

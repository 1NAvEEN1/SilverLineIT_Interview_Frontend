import store from './store';

// Helper function to get auth token from Redux store
const getAuthToken = () => {
  const state = store.getState();
  const token = state.user.accessToken;
  return token || null;
};

// Helper function to get headers with authentication
const getAuthHeaders = (additionalHeaders = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'An error occurred'
    }));
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Clear Redux state and redirect to login
      const { clearAuth } = await import('../reducers/userSlice');
      store.dispatch(clearAuth());
      window.location.href = '/';
    }
    
    throw {
      status: response.status,
      message: errorData.message || 'An error occurred',
      errors: errorData.errors || null,
    };
  }
};

export const post = async ({ path, requestBody, header = {}, requiresAuth = true }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  console.log(baseUrl);

  const headers = requiresAuth ? getAuthHeaders(header) : { "Content-Type": "application/json", ...header };

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });
  
  await handleApiError(response);
  const body = await response.json();
  return body;
};

export const get = async ({ path, header = {}, requiresAuth = true }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const headers = requiresAuth ? getAuthHeaders(header) : { "Content-Type": "application/json", ...header };

  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers,
  });

  await handleApiError(response);
  const body = await response.json();
  return body;
};

export const put = async ({ path, requestBody, header = {}, requiresAuth = true }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const headers = requiresAuth ? getAuthHeaders(header) : { "Content-Type": "application/json", ...header };

  const response = await fetch(`${baseUrl}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(requestBody),
  });
  
  await handleApiError(response);
  const body = await response.json();
  return body;
};

export const del = async ({ path, header = {}, requiresAuth = true }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const headers = requiresAuth ? getAuthHeaders(header) : { "Content-Type": "application/json", ...header };

  const response = await fetch(`${baseUrl}${path}`, {
    method: "DELETE",
    headers,
  });
  
  await handleApiError(response);
  
  // Handle 204 No Content
  if (response.status === 204) {
    return { success: true };
  }
  
  const body = await response.json();
  return body;
};

// Multipart form data upload
export const postFormData = async ({ path, formData, header = {}, requiresAuth = true, onUploadProgress }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = getAuthToken();
  
  const headers = { ...header };
  if (requiresAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });
  
  await handleApiError(response);
  const body = await response.json();
  return body;
};

export const putFormData = async ({ path, formData, header = {}, requiresAuth = true }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = getAuthToken();
  
  const headers = { ...header };
  if (requiresAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: "PUT",
    headers,
    body: formData,
  });
  
  await handleApiError(response);
  const body = await response.json();
  return body;
};

const TENANT_API = 'https://cairnsgames.co.za/php/tenant';
const AUTH_API = 'https://cairnsgames.co.za/php/auth';
const APP_ID = 'e671937d-54c9-11f0-9ec0-1a220d8ac2c9';

const createHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'app_id': APP_ID,
  };

  if (includeAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  
  // Check if the response contains errors
  if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    throw new Error(data.errors[0].message || 'An error occurred');
  }
  
  // Check if the response is not ok and doesn't have a token (for auth endpoints)
  if (!response.ok && !data.token) {
    throw new Error(data.message || `Request failed: ${response.statusText}`);
  }
  
  return data;
};

export const api = {
  // Tenant API
  async getTenant() {
    const response = await fetch(`${TENANT_API}/api.php/tenant`, {
      method: 'GET',
      headers: createHeaders(),
    });

    const data = await handleApiResponse(response);
    return Array.isArray(data) ? data[0] : data;
  },

  // Auth API
  async login(credentials: { email: string; password: string; deviceid?: string }) {
    const response = await fetch(`${AUTH_API}/login.php`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await handleApiResponse(response);
    
    // Ensure we have a token for successful login
    if (!data.token) {
      throw new Error('Login failed: No authentication token received');
    }
    
    return data;
  },

  async register(credentials: { email: string; password: string; confirm: string; deviceid?: string }) {
    const response = await fetch(`${AUTH_API}/registration.php`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await handleApiResponse(response);
    
    // Ensure we have a token for successful registration
    if (!data.token) {
      throw new Error('Registration failed: No authentication token received');
    }
    
    return data;
  },

  async validateToken(token: string) {
    const response = await fetch(`${AUTH_API}/validateToken.php`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ token }),
    });

    const data = await handleApiResponse(response);
    return data;
  },

  async updateUser(userId: number, data: { username?: string; firstname?: string; lastname?: string; avatar?: string }) {
    const response = await fetch(`${AUTH_API}/api.php/user/${userId}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });

    const responseData = await handleApiResponse(response);
    return responseData;
  },
};

// Export utilities for other API modules
export { createHeaders, handleApiResponse, APP_ID };
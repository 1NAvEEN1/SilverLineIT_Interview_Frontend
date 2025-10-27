import { post, get, put } from "../app/apiManager";

class UserService {
  // Register a new instructor
  static async register(firstName, lastName, email, password) {
    try {
      const response = await post({
        path: "/auth/register",
        requestBody: {
          firstName,
          lastName,
          email,
          password,
        },
        requiresAuth: false,
      });

      // Store tokens and user data
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Login
  static async login(email, password) {
    try {
      const response = await post({
        path: "/auth/login",
        requestBody: {
          email,
          password,
        },
        requiresAuth: false,
      });

      // Store tokens and user data
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Refresh access token
  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await post({
        path: "/auth/refresh",
        requestBody: {
          refreshToken,
        },
        requiresAuth: false,
      });

      // Update tokens
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  static async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await post({
          path: "/auth/logout",
          requestBody: {
            refreshToken,
          },
          requiresAuth: false,
        });
      }

      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      return { success: true };
    } catch (error) {
      // Even if the API call fails, clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  }

  // Get current user profile
  static async getCurrentUser() {
    try {
      const response = await get({
        path: "/users/me",
        requiresAuth: true,
      });

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response));

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update current user profile
  static async updateProfile(firstName, lastName, email) {
    try {
      const response = await put({
        path: "/users/me",
        requestBody: {
          firstName,
          lastName,
          email,
        },
        requiresAuth: true,
      });

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response));

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get stored user from localStorage
  static getStoredUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }
}

export default UserService;



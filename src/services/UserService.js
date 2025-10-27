import { post, get, put } from "../app/apiManager";
import store from "../app/store";
import { setAuthData, clearAuth, setUser } from "../reducers/userSlice";

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

      // Store tokens and user data in Redux
      if (response.accessToken) {
        store.dispatch(setAuthData({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }));
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

      // Store tokens and user data in Redux
      if (response.accessToken) {
        store.dispatch(setAuthData({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Refresh access token
  static async refreshToken() {
    try {
      const state = store.getState();
      const refreshToken = state.user.refreshToken;
      
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

      // Update tokens in Redux
      if (response.accessToken) {
        store.dispatch(setAuthData({
          user: state.user.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  static async logout() {
    try {
      const state = store.getState();
      const refreshToken = state.user.refreshToken;
      
      if (refreshToken) {
        await post({
          path: "/auth/logout",
          requestBody: {
            refreshToken,
          },
          requiresAuth: false,
        });
      }

      // Clear Redux state
      store.dispatch(clearAuth());

      return { success: true };
    } catch (error) {
      // Even if the API call fails, clear Redux state
      store.dispatch(clearAuth());
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

      // Update stored user data in Redux
      store.dispatch(setUser(response));

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

      // Update stored user data in Redux
      store.dispatch(setUser(response));

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get stored user from Redux store
  static getStoredUser() {
    const state = store.getState();
    return state.user.user;
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const state = store.getState();
    return state.user.isAuthenticated && !!state.user.accessToken;
  }
}

export default UserService;



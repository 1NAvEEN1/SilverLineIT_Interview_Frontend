import UserService from './UserService';
import store from '../app/store';

class AuthService {
  // Initialize auth state from Redux store (already handled by redux-persist)
  static initAuth() {
    const state = store.getState();
    return {
      user: state.user.user,
      accessToken: state.user.accessToken,
      refreshToken: state.user.refreshToken,
      isAuthenticated: state.user.isAuthenticated,
    };
  }

  // Check if token is expired (basic check)
  static isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      return true;
    }
  }

  // Auto refresh token if expired
  static async ensureValidToken() {
    const state = store.getState();
    const accessToken = state.user.accessToken;
    
    if (!accessToken || this.isTokenExpired(accessToken)) {
      try {
        await UserService.refreshToken();
        return true;
      } catch (error) {
        // Refresh failed, clear auth and redirect to login
        const { clearAuth } = await import('../reducers/userSlice');
        store.dispatch(clearAuth());
        window.location.href = '/';
        return false;
      }
    }
    
    return true;
  }

  // Setup token refresh timer (refresh 5 minutes before expiry)
  static setupTokenRefresh() {
    const state = store.getState();
    const accessToken = state.user.accessToken;
    
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const expiry = payload.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = expiry - now;
        const refreshTime = timeUntilExpiry - (5 * 60 * 1000); // 5 minutes before expiry
        
        if (refreshTime > 0) {
          setTimeout(async () => {
            try {
              await UserService.refreshToken();
              // Setup next refresh
              this.setupTokenRefresh();
            } catch (error) {
              console.error('Token refresh failed:', error);
            }
          }, refreshTime);
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }
}

export default AuthService;

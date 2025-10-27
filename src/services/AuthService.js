import UserService from './UserService';

class AuthService {
  // Initialize auth state from localStorage
  static initAuth() {
    const user = UserService.getStoredUser();
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (user && accessToken && refreshToken) {
      return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      };
    }
    
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
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
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken || this.isTokenExpired(accessToken)) {
      try {
        await UserService.refreshToken();
        return true;
      } catch (error) {
        // Refresh failed, clear auth and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return false;
      }
    }
    
    return true;
  }

  // Setup token refresh timer (refresh 5 minutes before expiry)
  static setupTokenRefresh() {
    const accessToken = localStorage.getItem('accessToken');
    
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

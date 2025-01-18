// services/authService.js
import api from './Api';

class AuthService {
  static async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      this.setTokens(response.data.token, response.data.refreshToken);
      this.setUser(response.data.user);
    }
    return response.data;
  }

  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await api.post('/auth/refresh-token', { refreshToken });
      if (response.data.success) {
        this.setTokens(response.data.token, response.data.refreshToken);
      }
      return response.data.token;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  static setTokens(token, refreshToken) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default AuthService;
import api from './api';

const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    
    const { token, user } = response.data.data || response.data;
    
    if (token) {
      localStorage.setItem('escambo_token', token);
    }
    if (user) {
      localStorage.setItem('escambo_user', JSON.stringify(user));
    }
    
    return { token, user };
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    
    const { token, user } = response.data.data || response.data;
    
    if (token) {
      localStorage.setItem('escambo_token', token);
    }
    if (user) {
      localStorage.setItem('escambo_user', JSON.stringify(user));
    }
    
    return { token, user };
  },

  async logout() {
    localStorage.removeItem('escambo_token');
    localStorage.removeItem('escambo_user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('escambo_user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('escambo_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService;


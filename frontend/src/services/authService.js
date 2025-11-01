import api from '../config/api';

export const authService = {
  login: async (username, password) => {
    console.log('🔵 authService.login called with:', { username });
    try {
      const response = await api.post('/auth/login', { username, password });
      console.log('🔵 authService.login - Response received:', response);
      console.log('🔵 authService.login - Response data:', response.data);
      
      // Verify response structure
      if (!response.data) {
        console.error('❌ authService.login - No data in response');
        throw new Error('Invalid response from server');
      }
      
      if (!response.data.token) {
        console.error('❌ authService.login - No token in response');
        throw new Error('No token received from server');
      }
      
      console.log('✅ authService.login - Response valid, returning data');
      return response.data;
    } catch (error) {
      console.error('❌ authService.login - Error:', error);
      console.error('❌ authService.login - Error response:', error.response);
      if (error.response) {
        console.error('❌ Error data:', error.response.data);
        console.error('❌ Error status:', error.response.status);
      }
      throw error;
    }
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  setAuthData: (authResponse) => {
    console.log('🔵 authService.setAuthData called with:', authResponse);
    
    try {
      if (!authResponse) {
        console.error('❌ authService.setAuthData - No authResponse provided');
        return;
      }
      
      // Set token
      if (authResponse.token) {
        localStorage.setItem('token', authResponse.token);
        console.log('✅ Token saved to localStorage');
      } else {
        console.warn('⚠️ No token in authResponse');
      }
      
      // Set refresh token
      if (authResponse.refreshToken) {
        localStorage.setItem('refreshToken', authResponse.refreshToken);
        console.log('✅ RefreshToken saved to localStorage');
      }
      
      // Set user data
      const userData = {
        id: authResponse.id,
        username: authResponse.username,
        email: authResponse.email,
        role: authResponse.role,
        fullName: authResponse.fullName,
      };
      
      // Verify required fields
      if (!userData.id || !userData.role) {
        console.error('❌ Missing required user data:', userData);
        throw new Error('Incomplete user data in response');
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ User data saved to localStorage:', userData);
      
      // Verify it was saved
      const savedUser = JSON.parse(localStorage.getItem('user'));
      console.log('✅ Verification - Saved user:', savedUser);
      
    } catch (error) {
      console.error('❌ authService.setAuthData - Error:', error);
      throw error;
    }
  },
};


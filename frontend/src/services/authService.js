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

  logout: (role = null) => {
    if (role) {
      // Only remove token for specific role
      localStorage.removeItem(`token_${role}`);
      localStorage.removeItem(`refreshToken_${role}`);
      localStorage.removeItem(`user_${role}`);
    } else {
      // Remove all tokens (for backward compatibility)
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Also remove role-specific tokens
      ['ADMIN', 'DOCTOR', 'PATIENT'].forEach(r => {
        localStorage.removeItem(`token_${r}`);
        localStorage.removeItem(`refreshToken_${r}`);
        localStorage.removeItem(`user_${r}`);
      });
    }
  },

  getCurrentUser: (role = null) => {
    if (role) {
      const userStr = localStorage.getItem(`user_${role}`);
      return userStr ? JSON.parse(userStr) : null;
    }
    // Backward compatibility: try role-specific first, then fallback to old key
    const roles = ['ADMIN', 'DOCTOR', 'PATIENT'];
    for (const r of roles) {
      const userStr = localStorage.getItem(`user_${r}`);
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: (role = null) => {
    if (role) {
      return localStorage.getItem(`token_${role}`);
    }
    // Backward compatibility: try role-specific first, then fallback to old key
    const roles = ['ADMIN', 'DOCTOR', 'PATIENT'];
    for (const r of roles) {
      const token = localStorage.getItem(`token_${r}`);
      if (token) {
        return token;
      }
    }
    return localStorage.getItem('token');
  },

  setAuthData: (authResponse) => {
    console.log('🔵 authService.setAuthData called with:', authResponse);
    
    try {
      if (!authResponse) {
        console.error('❌ authService.setAuthData - No authResponse provided');
        return;
      }
      
      // Normalize role to uppercase to ensure consistency
      const role = authResponse.role ? authResponse.role.toUpperCase() : null;
      if (!role) {
        console.error('❌ authService.setAuthData - No role in authResponse');
        throw new Error('Role is required in auth response');
      }
      
      console.log(`🔵 authService.setAuthData - Normalized role: ${role} (from: ${authResponse.role})`);
      
      // Set token with role-specific key
      if (authResponse.token) {
        localStorage.setItem(`token_${role}`, authResponse.token);
        // Also set to 'token' for backward compatibility
        localStorage.setItem('token', authResponse.token);
        console.log(`✅ Token saved to localStorage as token_${role}`);
        
        // Verify it was saved correctly
        const savedToken = localStorage.getItem(`token_${role}`);
        if (savedToken === authResponse.token) {
          console.log(`✅ Verification - Token saved correctly to token_${role}`);
        } else {
          console.error(`❌ Verification FAILED - Token not saved correctly to token_${role}`);
        }
      } else {
        console.warn('⚠️ No token in authResponse');
      }
      
      // Set refresh token with role-specific key
      if (authResponse.refreshToken) {
        localStorage.setItem(`refreshToken_${role}`, authResponse.refreshToken);
        // Also set to 'refreshToken' for backward compatibility
        localStorage.setItem('refreshToken', authResponse.refreshToken);
        console.log(`✅ RefreshToken saved to localStorage as refreshToken_${role}`);
      }
      
      // Set user data with role-specific key (use normalized role)
      const userData = {
        id: authResponse.id,
        username: authResponse.username,
        email: authResponse.email,
        role: role, // Use normalized uppercase role
        fullName: authResponse.fullName,
      };
      
      // Verify required fields
      if (!userData.id || !userData.role) {
        console.error('❌ Missing required user data:', userData);
        throw new Error('Incomplete user data in response');
      }
      
      localStorage.setItem(`user_${role}`, JSON.stringify(userData));
      // Also set to 'user' for backward compatibility
      localStorage.setItem('user', JSON.stringify(userData));
      console.log(`✅ User data saved to localStorage as user_${role}:`, userData);
      
      // Verify it was saved
      const savedUser = JSON.parse(localStorage.getItem(`user_${role}`));
      if (savedUser && savedUser.role === role) {
        console.log('✅ Verification - User saved correctly:', savedUser);
      } else {
        console.error('❌ Verification FAILED - User not saved correctly:', {
          saved: savedUser,
          expected: userData
        });
      }
      
    } catch (error) {
      console.error('❌ authService.setAuthData - Error:', error);
      throw error;
    }
  },
};


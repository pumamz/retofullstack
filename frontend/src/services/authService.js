import api from '../api/axios';

const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const userData = response.data;

    if (userData.token) {
      const user = {
        id: userData.id,
        username: userData.username,
        firstName: userData.firstName,
        email: userData.email,
        role: userData.role,
        token: userData.token
      };
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }

    throw new Error('No se recibió token');
  },

  register: async (username, password, email, firstName) => {
    return api.post('/auth/register', { username, password, email, firstName });
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;

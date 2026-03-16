import axios from 'axios';

export const AuthService = {
  login: async (data: any) => {
    const response = await axios.post('/auth/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await axios.post('/auth/register', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await axios.get('/auth/profile');
    return response.data;
  },
  logout: () => {
    // Clear both local and session storage tokens just in case
    localStorage.removeItem("TimeSheet-authenticationToken");
    sessionStorage.removeItem("TimeSheet-authenticationToken");
  },
  registerVoter: async (data: any) => {
    const response = await axios.post('/voter-registration', data);
    return response.data;
  }
};

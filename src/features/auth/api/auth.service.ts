import axios from 'axios';

export const AuthService = {
  login: async (data: any) => {
    const payload = {
      loginId: data.loginId,
      password: data.password,
      captchaId: data.captchaId,
      captchaText: data.captchaText
    };
    const response = await axios.post('/auth/login', payload);
    return response.data;
  },
  generateCaptcha: async () => {
    const response = await axios.get('/public/generate-captcha');
    return response.data;
  },
  register: async (data: any) => {
    const response = await axios.post('/applicants/register', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("online voting system");
    sessionStorage.removeItem("online voting system");
  },
  registerVoter: async (data: any) => {
    const response = await axios.post('/voter-registration', data);
    return response.data;
  },
  forgotPassword: async (identifier: string) => {
    const response = await axios.post('/public/forgot-password', { identifier });
    return response.data;
  },
  changePassword: async (data: any) => {
    const response = await axios.post('/auth/change-password', data);
    return response.data;
  }
};

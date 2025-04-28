import axios from 'axios';

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });

export const requestAPI = {
  login: (name) =>
    axiosInstance
      .post('/api/login', { name })
      .then((response) => response.data),
  sendMessage: (data) =>
    axiosInstance.post('/api/send', data).then((response) => response.data),
  sendTouchedMsg: (data) =>
    axiosInstance.put('/api/touched', data).then((response) => response.data)
};

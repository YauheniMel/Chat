import axios from 'axios';

const axiosInstance = axios.create({ baseURL: process.env.BASE_URL });

export const requestAPI = {
  login: (name) =>
    axiosInstance
      .put('https://chatting-back.onrender.com/api/login', { name })
      .then((response) => response.data),
  sendMessage: (data) =>
    axiosInstance
      .post('https://chatting-back.onrender.com/api/send', data)
      .then((response) => response.data),
  sendTouchedMsg: (data) =>
    axiosInstance.put('/api/touched', data).then((response) => response.data)
};

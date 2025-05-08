import axios from 'axios';

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });

export const requestAPI = {
  login: (name) =>
    axiosInstance
      .post('/api/login', { name })
      .then((response) => response.data),
  getUsers: () =>
    axiosInstance.get('/api/users').then((response) => response.data),
  getMessages: (myId, userId) =>
    axiosInstance
      .get('/api/messages', {
        params: {
          myId,
          userId
        }
      })
      .then((response) => response.data),
  sendMessage: (message) =>
    axiosInstance
      .post('/api/send', { message })
      .then((response) => response.data),
  sendTouchedMsg: (data) =>
    axiosInstance.put('/api/touched', data).then((response) => response.data)
};

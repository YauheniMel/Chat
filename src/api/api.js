import axios from 'axios';

const requestAPI = {
  login(name) {
    return axios
      .put('https://chatting-back.onrender.com/api/login', { name })
      .then((response) => response.data);
  },
  sendMessage(data) {
    return axios
      .post('https://chatting-back.onrender.com/api/send', data)
      .then((response) => response.data);
  },
  sendTouchedMsg(data) {
    return axios
      .put('https://chatting-back.onrender.com/api/touched', data)
      .then((response) => response.data);
  },
};

export default requestAPI;

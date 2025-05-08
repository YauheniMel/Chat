import { toast } from 'react-toastify';
import { requestAPI } from '../../api';

export const loginUserAction = (user) => ({
  type: 'LOGIN-USER',
  payload: user
});
export const getUsersAction = (users) => ({
  type: 'GET-USERS',
  payload: users
});

const initState = {
  isAuth: false,
  name: '',
  db: [],
  id: '',
  users: []
};

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN-USER': {
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        isAuth: true
      };
    }
    case 'GET-USERS': {
      return {
        ...state,
        users: action.payload.filter((user) => user.id !== state.id)
      };
    }
    default:
      return state;
  }
};

export const loginUserThunk = (userName) => async (dispatch) => {
  try {
    const { name, id } = await requestAPI.login(userName);

    dispatch(loginUserAction({ name, id }));
  } catch (error) {
    toast.error(error);
  }
};

export const getUsersThunk = () => async (dispatch) => {
  try {
    const users = await requestAPI.getUsers();

    dispatch(getUsersAction(users));
  } catch (error) {
    toast.error(error);
  }
};

export const setTouchedMsgThunk = (payload) => () =>
  requestAPI
    .sendTouchedMsg(payload)
    .then((data) => {
      const [newData] = JSON.parse(data);
      getUsersAction({
        db: newData
      });
    })
    .catch((err) => toast.error(err));

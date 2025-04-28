import { toast } from 'react-toastify';
import { requestAPI } from '../../api';

export const loginUserAction = (user) => ({
  type: 'LOGIN-USER',
  payload: user
});
export const getDataAction = (data) => ({ type: 'GET-DATA', data });

const initState = {
  isAuth: false,
  name: '',
  db: [],
  id: '',
  users: []
};

function authReducer(state = initState, action) {
  switch (action.type) {
    case 'LOGIN-USER': {
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        isAuth: true
      };
    }
    case 'GET-DATA': {
      const stateCopy = {
        ...state,
        ...action.data
      };

      return stateCopy;
    }
    default:
      return state;
  }
}

export const loginUserThunk = (userName) => async (dispatch) => {
  try {
    const { name, id } = await requestAPI.login(userName);

    dispatch(loginUserAction({ name, id }));
  } catch (error) {
    toast.error(error);
  }
};

export const sendMessageThunk = (payload) => (dispatch) =>
  requestAPI
    .sendMessage(payload)
    .then((data) => {
      if (typeof data === 'object') {
        dispatch(
          getDataAction({ id: payload.myId, db: JSON.parse(data.JSON) })
        );
        dispatch(loginUserAction());
      } else {
        toast.success(data);
      }
    })
    .catch((err) => toast.error(err));

export const setTouchedMsgThunk = (payload) => () =>
  requestAPI
    .sendTouchedMsg(payload)
    .then((data) => {
      const [newData] = JSON.parse(data);
      getDataAction({
        db: newData
      });
    })
    .catch((err) => toast.error(err));

export default authReducer;

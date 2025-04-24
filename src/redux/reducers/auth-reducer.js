import { toast } from 'react-toastify';
import requestAPI from '../../api/api';

export const loginUserAction = () => ({ type: 'LOGIN-USER' });
export const createNameAction = (name) => ({ type: 'CREATE-NAME', name });
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
      const stateCopy = {
        ...state,
        isAuth: true
      };

      return stateCopy;
    }
    case 'CREATE-NAME': {
      const stateCopy = {
        ...state,
        name: action.name
      };

      return stateCopy;
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

export const loginUserThunk = (name) => (dispatch) =>
  requestAPI
    .login(name)
    .then((data) => {
      dispatch(
        getDataAction({
          id: data.id,
          db: JSON.parse(data.JSON),
          users: JSON.parse(data.users)
        })
      );
      dispatch(loginUserAction());
    })
    .catch((err) => toast.error(err));

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

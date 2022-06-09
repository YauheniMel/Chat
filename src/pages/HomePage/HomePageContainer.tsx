import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';
import {
  sendMessageThunk,
  setTouchedMsgThunk,
  getDataAction,
} from '../../redux/reducers/auth-reducer';
import HomePage from './HomePage';

const HomePageContainer: FC<any> = function ({
  name,
  data,
  sendMessage,
  id,
  users,
  setTouchedMsg,
  getData,
}) {
  const [newData, setNewData] = useState(null);
  const [newUsers, setNewUsers] = useState(null);

  const socket = io('https://chatting-back.onrender.com');

  useEffect(() => {
    socket.on('db', (d: any) => setNewData(d));

    socket.on('me', (d: any) => {
      const { id: resId, JSON: json } = JSON.parse(d);

      if (+resId === +id) {
        setNewData(json);
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-shadow
    socket.on('addressee', (d: any) => {
      const { id: resId, JSON: json } = JSON.parse(d);

      if (+resId === +id) {
        setNewData(json);
      }
    });
    if (newData) {
      getData({ db: JSON.parse(newData) });
    }
  }, [newData]);

  useEffect(() => {
    socket.on('users', (d: any) => setNewUsers(d));

    if (newUsers) {
      getData({ users: JSON.parse(newUsers) });
    }
  }, [newUsers]);

  return (
    <HomePage
      name={name}
      data={data}
      sendMessage={sendMessage}
      id={id}
      users={users}
      setTouchedMsg={setTouchedMsg}
    />
  );
};

const mapStateToProps = (state: any) => ({
  name: state.auth.name,
  id: state.auth.id,
  data: state.auth.db,
  users: state.auth.users,
});
const mapDispatchToProps = (dispatch: any) => ({
  sendMessage: (data: any) => dispatch(sendMessageThunk(data)),
  setTouchedMsg: (data: any) => dispatch(setTouchedMsgThunk(data)),
  getData: (data: any) => dispatch(getDataAction(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);

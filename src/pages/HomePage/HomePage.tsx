import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import classes from './HomePage.module.scss';
import DialogModal from '../../components/DialogModal/DialogModal';
import NavMessages from '../../components/BoxMessage/NavMessage';
import Editor from '../../components/Editor/Editor';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  getDataAction,
  sendMessageThunk,
  setTouchedMsgThunk
} from '../../redux/reducers/auth-reducer';

export const HomePage: FC = () => {
  const [newData, setNewData] = useState(null);
  const [newUsers, setNewUsers] = useState(null);

  const [alignment, setAlignment] = React.useState('text');
  const [isOpen, setIsOpen] = React.useState(false);

  const dispatch = useDispatch<any>();

  const users = useSelector((state: any) => state.auth.users);
  const data = useSelector((state: any) => state.auth.db);
  const name = useSelector((state: any) => state.auth.name);
  const id = useSelector((state: any) => state.auth.id);

  const socket = io('https://chatting-back.onrender.com');

  useEffect(() => {
    socket.on('db', (d: any) => setNewData(d));

    socket.on('me', (d: any) => {
      const { id: resId, JSON: json } = JSON.parse(d);

      if (+resId === +id) {
        setNewData(json);
      }
    });

    socket.on('addressee', (d: any) => {
      const { id: resId, JSON: json } = JSON.parse(d);

      if (+resId === +id) {
        setNewData(json);
      }
    });
    if (newData) {
      dispatch(getDataAction({ db: JSON.parse(newData) }));
    }
  }, [newData]);

  useEffect(() => {
    socket.on('users', (d: any) => setNewUsers(d));

    if (newUsers) {
      dispatch(getDataAction({ users: JSON.parse(newUsers) }));
    }
  }, [newUsers]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  const sendMessage = (data: any) => {
    dispatch(sendMessageThunk(data));
  };

  const setTouchedMsg = (data: any) => {
    dispatch(setTouchedMsgThunk(data));
  };

  const setTouched = (newData: any) => {
    const db = data.map((elem: any) => {
      if (+elem.id === +newData.id) {
        const n = elem.received.map((msg: any) => {
          if (
            newData.received.find(
              (touchedMsg: any) => +touchedMsg.date === +msg.date
            )
          ) {
            msg.state = 'touched';
          }
          return msg;
        });
        elem.received = n;
      }
      return elem;
    });
    setTouchedMsg({ id, JSON: JSON.stringify(db) });
  };

  const prepareMessagesInfo = (arr: any) => {
    return arr.map((item: any) => {
      item.name = users.find((item2: any) => +item2.id === +item.id).name;
      if (item.id == id) {
        item.received = item.sent;
      }
      if (!item.received) return { id: item.id, name: item.name, received: [] };

      return {
        id: item.id,
        name: item.name,
        received: item.received
      };
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <div>
            <Typography variant="h6" noWrap>
              {name}
            </Typography>
            <ToggleButtonGroup
              color="secondary"
              value={alignment}
              sx={{ backgroundColor: '#62727b' }}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value="text">Markdown</ToggleButton>
            </ToggleButtonGroup>
            <IconButton size="large" onClick={() => setIsOpen(true)}>
              <ForwardToInboxIcon color="secondary" sx={{ fontSize: 30 }} />
            </IconButton>
          </div>
          <div>
            <div>
              <NavMessages
                messages={prepareMessagesInfo(data)}
                id={id}
                data={data}
                setTouched={setTouched}
              />
            </div>
          </div>
        </Toolbar>
        <DialogModal
          id={id}
          data={data}
          users={users}
          isOpen={isOpen}
          close={handleClose}
          sendMessage={sendMessage}
        />
      </AppBar>
      {alignment === 'text' || (
        <Editor sendMessage={sendMessage} id={id} users={users} />
      )}
    </div>
  );
};

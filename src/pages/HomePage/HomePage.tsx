import { AppBar, Stack, Toolbar, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import classes from './HomePage.module.scss';
import NavMessages from '../../components/BoxMessage/NavMessage';
import { Editor } from '../../components/Editor/Editor';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { getUsersThunk, setTouchedMsgThunk } from '../../redux/reducers';
import { CreateMessageDto, IMessage } from '../../types';
import { requestAPI } from '../../api';
import { AlignmentType } from '../../components/Editor/type';

export const HomePage: FC = () => {
  const [alignment, setAlignment] = useState<AlignmentType>('textarea');

  const dispatch = useDispatch<any>();

  const users = useSelector((state: any) => state.users);
  const data = useSelector((state: any) => state.db);
  const name = useSelector((state: any) => state.name);
  const id = useSelector((state: any) => state.id);

  const socket = io(process.env.REACT_APP_BASE_URL);

  useEffect(() => {
    socket.on('on-send-message', (message: any) => {
      console.log(message);
    });

    dispatch(getUsersThunk());
  }, []);

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: AlignmentType
  ) => {
    if (!newAlignment) return;

    setAlignment(newAlignment);
  };

  const sendMessage = async (message: CreateMessageDto): Promise<IMessage> => {
    const response = await requestAPI.sendMessage(message);

    return response;
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

  return (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <div>
            <Typography variant="h6" noWrap>
              {name}
            </Typography>
            <Stack direction="row" spacing={4}>
              <ToggleButtonGroup
                color="secondary"
                value={alignment}
                sx={{ backgroundColor: '#62727b' }}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton value="markdown">Markdown</ToggleButton>
                <ToggleButton value="textarea">
                  <ForwardToInboxIcon sx={{ fontSize: 30 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
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
      </AppBar>
      <Editor submit={sendMessage} alignment={alignment} />
    </div>
  );
};

import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button, List, TextareaAutosize } from '@mui/material';
import { ASelect } from '../ASelect/ASelect';
import { useSelector } from 'react-redux';
import { IEditor } from './type';
import { IMessage } from '../../types';
import { AMessage } from '../AMessage/AMessage';
import { requestAPI } from '../../api';

export const Editor: FC<IEditor> = ({ submit, alignment }) => {
  const [content, setContent] = useState<any>('');
  const [toId, setToId] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);

  const users = useSelector((state: any) => state.users);
  const id = useSelector((state: any) => state.id) as number;

  useEffect(() => {
    setContent('');
  }, [alignment]);

  useEffect(() => {
    if (!toId || !id) return;

    handleGetAllMessages(id, +toId);
  }, [toId, id]);

  const handleGetAllMessages = async (myId: number, userId: number) => {
    const messages = await requestAPI.getMessages(myId, userId);

    setMessages(messages);
  };

  const handleSetContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim()) return;

    const message = await submit({
      authorId: id,
      toId: +toId,
      content: content
    });

    setContent('');

    setMessages((prevState) => [...prevState, message]);
  };

  return (
    <div className="container">
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: '20px',
          marginTop: '20px'
        }}
        action=""
        onSubmit={handleSubmit}
      >
        <ASelect options={users} selected={toId} onSelect={setToId} />
        {alignment === 'markdown' ? (
          <MDEditor value={content} onChange={setContent} />
        ) : (
          <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Message"
            onChange={handleSetContent}
            value={content}
            style={{
              resize: 'vertical',
              minHeight: 100,
              padding: 10
            }}
            required
          />
        )}
        <Button
          size="large"
          sx={{ p: 3, marginTop: '10px' }}
          fullWidth
          type="submit"
        >
          Submit
        </Button>
      </form>
      {toId && (
        <List
          sx={{
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 200,
            m: 1,
            '& ul': { padding: 0 }
          }}
          subheader={<li />}
        >
          {messages.map((message) => (
            <AMessage key={message.id} message={message} />
          ))}
        </List>
      )}
    </div>
  );
};

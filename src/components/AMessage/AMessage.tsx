import React, { FC } from 'react';

import MDEditor from '@uiw/react-md-editor';
import { IAMessage } from './type';
import { ListItem } from '@mui/material';

export const AMessage: FC<IAMessage> = ({ message }) => (
  <ListItem key={message.id}>
    <MDEditor.Markdown source={message.content} />
  </ListItem>
);

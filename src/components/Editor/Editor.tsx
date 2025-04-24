import React, { FC } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import MultiSelect from '../MultiSelect/MultiSelect';

const Editor: FC<any> = function ({ sendMessage, users, id }) {
  const [value, setValue] = React.useState<any>('');

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!value.trim()) toast.error('Form invalid');

    const theme = e.target[2].value;
    const selectUsers = e.target[0].value.split(',');
    const ids: any[] = [];
    users.forEach((user: any) => {
      selectUsers.forEach((selectUser: any) => {
        if (user.name === selectUser) {
          ids.push(user.id);
        }
      });
    });

    sendMessage({
      myId: id,
      id: ids,
      theme,
      content: value.replace(/\n/gim, '&')
    });
  }

  return (
    <div className="container">
      <form style={{ padding: 20 }} action="" onSubmit={handleSubmit}>
        <MultiSelect userName={users.map((user: any) => user.name)} />
        <TextField
          sx={{ margin: '0 0 20px 0', width: '100%' }}
          required
          label="Theme"
          variant="standard"
        />
        <MDEditor value={value} onChange={setValue} />
        <Button
          size="large"
          sx={{ p: 3, marginTop: '10px' }}
          fullWidth
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Editor;

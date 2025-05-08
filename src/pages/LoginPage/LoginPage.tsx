import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import classes from './LoginPage.module.scss';
import { useDispatch } from 'react-redux';
import { loginUserThunk } from '../../redux/reducers';

export const LoginPage: FC = () => {
  const [name, setName] = useState('');

  const dispatch = useDispatch<any>();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(loginUserThunk(name));
  };

  const createName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setName(value);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.dialog}>
        <DialogTitle>You must enter your name to log in.</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              label="Name"
              fullWidth
              variant="standard"
              value={name}
              required
              onChange={createName}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit">Enter</Button>
          </DialogActions>
        </form>
      </div>
    </div>
  );
};

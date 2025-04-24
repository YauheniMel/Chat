import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { TextareaAutosize, TextField } from '@mui/material';
import InputUser from '../InputUser/InputUser';
import ListComponent from '../List/List';

const DialogModal: React.FC<any> = function ({
  isOpen,
  close,
  data,
  sendMessage,
  id,
  users
}) {
  const [addressee, setAddressee] = React.useState<any>();
  const [value, setValue] = React.useState<any | null>(null);

  function handleSubmit(e: any) {
    e.preventDefault();

    sendMessage({
      myId: id,
      id: value.id,
      theme: e.target[2].value,
      content: e.target[3].value
    });
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form
          style={{ display: 'flex', flexDirection: 'column' }}
          action=""
          onSubmit={handleSubmit}
        >
          <InputUser
            data={data}
            setAddressee={setAddressee}
            setValue={setValue}
            value={value}
            users={users}
          />
          <TextField required label="Theme" variant="standard" sx={{ m: 1 }} />
          {addressee && (
            <ListComponent
              users={users}
              // eslint-disable-next-line eqeqeq
              data={data.find((user: any) => user.id == addressee.id)}
            />
          )}

          <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Message"
            required
            style={{
              resize: 'vertical',
              width: 400,
              minHeight: 100,
              padding: 10,
              margin: '10px'
            }}
          />
          <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" variant="contained">
              Send
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default DialogModal;

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: 400,
  overflow: 'scroll',
  bgcolor: 'background.paper',
  boxShadow: 24
};

const ModalComponent: React.FC<any> = function ({
  open,
  handleClose,
  newMessages,
  setTouched
}) {
  const [showMessages, setShowMessages] = React.useState<any>([]);
  function handleClick(id: any) {
    const checkMsg = showMessages.find((ID: any) => +ID === +id);
    let arr = [];
    if (!checkMsg) {
      arr = [...showMessages, id];
      setTouched({
        name: newMessages.name,
        id: newMessages.id,
        received: newMessages.received.filter((msg: any) => +msg.date === +id)
      });
      return setShowMessages(arr);
    }

    arr = showMessages.filter((ID: any) => +id !== +ID);

    return setShowMessages(arr);
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <List sx={{ bgcolor: 'background.paper', margin: 1 }}>
            {newMessages?.received.map((msg: any) =>
              msg.md ? (
                <ListItem
                  alignItems="flex-start"
                  style={{
                    backgroundColor:
                      msg.state === 'touched' ? 'none' : '#f4eeee',
                    flexDirection: 'column'
                  }}
                  key={msg.date}
                  onClick={() => handleClick(msg.date)}
                >
                  <ListItemText
                    primary={msg.theme}
                    sx={{ cursor: 'pointer', display: 'block' }}
                  />
                  <MDEditor.Markdown
                    source={
                      showMessages.find((id: any) => +id === +msg.date)
                        ? msg.content.replace(/&/gim, '\n')
                        : ''
                    }
                  />
                </ListItem>
              ) : (
                <ListItem
                  alignItems="flex-start"
                  style={{
                    backgroundColor:
                      msg.state === 'touched' ? 'none' : '#f4eeee'
                  }}
                  key={msg.date}
                  onClick={() => handleClick(msg.date)}
                >
                  <ListItemText
                    primary={msg.theme}
                    sx={{ cursor: 'pointer', width: 500 }}
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {showMessages.find((id: any) => +id === +msg.date)
                          ? msg.content
                          : `${msg.content.slice(0, 3)}...`}
                      </Typography>
                    }
                  />
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalComponent;

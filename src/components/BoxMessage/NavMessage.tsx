import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { Badge, IconButton, ListItemButton } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import ModalComponent from '../Modal/Modal';

const NavMessages: React.FC<any> = function ({
  messages = [],
  setTouched,
  data
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [open, setOpen] = React.useState<boolean>();
  const [newMessages, setNewMessages] = React.useState<any>();

  const handleOpen = (e: any) => {
    setOpen(true);

    messages.forEach((msg: any) => {
      if (msg.name.toUpperCase() === e.target.innerText.toUpperCase()) {
        setNewMessages({ name: msg.name, id: msg.id, received: msg.received });
      }
    });
  };
  const handleClose = () => setOpen(false);

  function countReceivedMessages(arr: any): number {
    let counter = 0;
    if (!arr.length) return counter;
    arr.forEach((item: any) => {
      if (item.received) {
        counter += item.received.filter(
          (msg: any) => msg.state === 'untouched'
        ).length;
      }
    });

    return counter;
  }

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: '16vw', minWidth: 150 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {messages.map((msg: any) => {
          if (!msg.received.length) return null;
          return (
            <ListItemButton
              style={{
                backgroundColor: msg.received.find(
                  (m: any) => m.state === 'untouched'
                )
                  ? '#f4eeee'
                  : 'none'
              }}
              key={msg.id}
              onClick={handleOpen}
            >
              {msg.name}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton
        onClick={toggleDrawer(true)}
        aria-label="show 4 new mails"
        color="inherit"
      >
        <Badge badgeContent={countReceivedMessages(data)} color="secondary">
          <MailIcon sx={{ fontSize: 30 }} />
        </Badge>
      </IconButton>
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        {messages.length && list()}
      </Drawer>
      <ModalComponent
        setTouched={setTouched}
        handleClose={handleClose}
        open={open}
        newMessages={newMessages}
      />
    </div>
  );
};

export default NavMessages;

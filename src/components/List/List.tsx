import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import moment from 'moment';

import { List } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';

const ListComponent: React.FC<any> = function ({ data }) {
  return (
    <div>
      {data?.sent && (
        <List
          sx={{
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 200,
            maxWidth: 410,
            m: 1,
            '& ul': { padding: 0 }
          }}
          subheader={<li />}
        >
          {data.sent.map((info: any, idx: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`section-${idx}`}>
              <ul>
                <ListSubheader sx={{ backgroundColor: '#f4eeee' }}>
                  {`${moment(info.date).format('DD.MM HH:MM')}`}
                </ListSubheader>
                <ListItem key={`item-${info.date}`}>
                  {info.md ? (
                    <MDEditor.Markdown
                      source={info.content.replace(/&/gim, '\n')}
                    />
                  ) : (
                    <ListItemText primary={` ${info.content}`} />
                  )}
                </ListItem>
              </ul>
            </li>
          ))}
        </List>
      )}
    </div>
  );
};

export default ListComponent;

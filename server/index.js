const bodyParser = require('body-parser');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const { Router } = require('express');
const path = require('path');
const connection = require('./DB');
const {
  createUser,
  updateListUsers,
  updateUsers,
  updateDb,
  createUsersTable,
  createMessagesTable
} = require('./DB/queries');

const port = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  socket.join('update');
});

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static(path.join(__dirname, '../build')));

const router = Router();

router.put('/api/login', async (req, res) => {
  const { name } = req.body;

  try {
    // eslint-disable-next-line consistent-return
    connection.query('SELECT * FROM users', (err, results) => {
      if (err) throw new Error(err);

      const users = Object.values(JSON.parse(JSON.stringify(results)));

      const arr = [];

      // eslint-disable-next-line array-callback-return
      users.forEach((user) => {
        arr.push({ name: user.name, id: user.id });
      });

      let targetUser = users.find((user) => user.name === name);

      if (!targetUser) {
        const id = +new Date();
        arr.push({ name, id });

        connection.query(
          `${createUser(name, id, JSON.stringify(arr))}${updateListUsers(
            JSON.stringify(arr)
          )} SELECT * FROM users`,
          (error) => {
            if (error) throw new Error(error);

            connection.query('SELECT * FROM users', (e, r) => {
              if (e) throw new Error(e);

              const newUsers = Object.values(JSON.parse(JSON.stringify(r)));

              targetUser = newUsers.find((user) => user.name === name);

              io.to('update').emit('users', targetUser?.users);

              return res.status(200).json(targetUser);
            });
          }
        );
      } else {
        connection.query(
          `${updateUsers(
            targetUser.id,
            JSON.stringify(arr)
          )} SELECT * FROM users`,
          (error, r) => {
            if (error) throw new Error(error);

            // eslint-disable-next-line @typescript-eslint/no-shadow
            const users = Object.values(JSON.parse(JSON.stringify(r)));

            targetUser = users[1].find((user) => user.name === name);

            return res.status(200).json(targetUser);
          }
        );
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/api/send', async (req, res) => {
  const { id, myId, theme, content } = req.body;

  try {
    // eslint-disable-next-line consistent-return
    connection.query('SELECT * FROM users', (err, results) => {
      if (err) throw new Error(err);

      const users = Object.values(JSON.parse(JSON.stringify(results)));

      let addressee;
      let addresseeData;
      let addresseeJSON;
      const me = users.find((user) => user.id == myId);
      const myData = JSON.parse(me.JSON);
      let myJSON;

      if (typeof id === 'object') {
        const i = [];
        id.forEach((m) => {
          const x = myData.findIndex((item) => item.id == m);

          if (x == '-1') {
            i.push({ id: m });
          } else {
            i.push(x);
          }
        });
        const date = +new Date();
        i.forEach((n) => {
          if (typeof n === 'object') {
            myData.push({
              id: n.id,
              sent: [
                {
                  date,
                  state: 'untouched',
                  theme,
                  content,
                  md: true
                }
              ]
            });
          } else {
            if (!myData[n].sent) myData[n].sent = [];
            myData[n].sent.push({
              date,
              state: 'untouched',
              theme,
              content,
              md: true
            });
          }
        });

        const arr = [];
        id.forEach((k) => {
          const m = users.find((user) => user.id == k);

          addresseeData = JSON.parse(m.JSON);

          const idx = addresseeData.findIndex((item) => item.id == myId);

          if (idx == '-1') {
            addresseeData.push({
              id: myId,
              received: [
                {
                  date,
                  state: 'untouched',
                  theme,
                  content,
                  md: true
                }
              ]
            });
          } else {
            if (!addresseeData[idx].received) addresseeData[idx].received = [];
            addresseeData[idx].received.push({
              date,
              state: 'untouched',
              theme,
              content,
              md: true
            });
          }

          if (!addresseeData[0]) {
            addresseeData.push({
              id: myId,
              received: [
                {
                  date,
                  state: 'untouched',
                  theme,
                  content,
                  md: true
                }
              ]
            });
          }

          arr.push({
            id: k,
            addresseeData: JSON.stringify([...addresseeData])
          });
        });

        const command = arr.map((elem) =>
          updateDb(elem.id, elem.addresseeData)
        );
        const str = command.join('');
        myJSON = JSON.stringify([...myData]);

        connection.query(
          `${str}
          ${updateDb(myId, myJSON)}`,
          (error) => {
            if (error) throw new Error(error);

            connection.query('SELECT * FROM users', (e, r) => {
              if (e) throw new Error(e);

              const newUsers = Object.values(JSON.parse(JSON.stringify(r)));

              const myNewData = newUsers.find((user) => +user.id === +myId);

              id.forEach((l) => {
                const addresseeNewData = newUsers.find(
                  (user) => +user.id === +l
                );
                io.to('update').emit(
                  'addressee',
                  JSON.stringify({ id: l, JSON: addresseeNewData.JSON })
                );
              });

              io.to('update').emit(
                'me',
                JSON.stringify({ id: myId, JSON: myNewData.JSON })
              );
            });

            return res.status(200).send('The message was sent!');
          }
        );
      } else {
        // eslint-disable-next-line eqeqeq
        const i = myData.findIndex((item) => item.id == id);
        // eslint-disable-next-line eqeqeq
        if (i == '-1') {
          myData.push({
            id,
            sent: [
              {
                date: +new Date(),
                state: 'untouched',
                theme,
                content,
                md: false
              }
            ]
          });
        } else {
          if (!myData[i].sent) myData[i].sent = [];
          myData[i].sent.push({
            date: +new Date(),
            state: 'untouched',
            theme,
            content,
            md: false
          });
        }

        if (!myData[0]) {
          myData.push({
            id,
            sent: [
              {
                date: +new Date(),
                state: 'untouched',
                theme,
                content,
                md: false
              }
            ]
          });
        }

        myJSON = JSON.stringify([...myData]);

        addressee = users.find((user) => user.id == id);
        addresseeData = JSON.parse(addressee.JSON);

        const idx = addresseeData.findIndex((item) => item.id == myId);

        if (idx == '-1') {
          addresseeData.push({
            id: myId,
            received: [
              {
                date: +new Date(),
                state: 'untouched',
                theme,
                content,
                md: false
              }
            ]
          });
        } else {
          if (!addresseeData[idx].received) addresseeData[idx].received = [];
          addresseeData[idx].received.push({
            date: +new Date(),
            state: 'untouched',
            theme,
            content,
            md: false
          });
        }

        if (!addresseeData[0]) {
          addresseeData.push({
            id: myId,
            received: [
              {
                date: +new Date(),
                state: 'untouched',
                theme,
                content,
                md: false
              }
            ]
          });
        }

        addresseeJSON = JSON.stringify([...addresseeData]);

        connection.query(
          `${updateDb(id, addresseeJSON)}
        ${updateDb(myId, myJSON)}`,
          (error) => {
            if (error) throw new Error(error);

            connection.query('SELECT * FROM users', (e, r) => {
              if (e) throw new Error(e);

              const newUsers = Object.values(JSON.parse(JSON.stringify(r)));

              const myNewData = newUsers.find((user) => +user.id === +myId);
              const addresseeNewData = newUsers.find(
                (user) => +user.id === +id
              );

              io.to('update').emit(
                'me',
                JSON.stringify({ id: myId, JSON: myNewData.JSON })
              );
              io.to('update').emit(
                'addressee',
                JSON.stringify({ id, JSON: addresseeNewData.JSON })
              );
            });

            return res.status(200).send('The message was sent!');
          }
        );
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put('/api/touched', async (req, res) => {
  const { JSON, id } = req.body;
  try {
    connection.query(`${updateDb(id, JSON)} SELECT * FROM users`, (error) => {
      if (error) throw new Error(error);
      connection.query('SELECT * FROM users', (e, r) => {
        if (e) throw new Error(e);

        const targetUser = r.find((user) => +user.id === +id);

        return res.status(200).json(targetUser.JSON);
      });
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'public', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'public', 'index.html'));
});

app.use(bodyParser.json());

app.use(router);

server.listen(port, () => {
  connection.query(createUsersTable() + ' ' + createMessagesTable());
  console.log(`running on port ${port}`);
});

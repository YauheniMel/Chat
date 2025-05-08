const bodyParser = require('body-parser');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const { Router } = require('express');
const path = require('path');
const pool = require('./DB');
const {
  createUser,
  createUsersTable,
  createMessagesTable,
  findByName,
  updateDb,
  sendMessage,
  findAllUsers,
  getAllMessages
} = require('./DB/queries');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: process.env.FRONT_URL
  })
);

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

router.post('/api/login', async (req, res) => {
  const { name } = req.body;

  try {
    let [[user]] = await pool.query(findByName(name));

    if (!user) {
      await pool.query(createUser(name));

      [[user]] = await pool.query(findByName(name));
    }

    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get('/api/users', async (req, res) => {
  try {
    let [users] = await pool.query(findAllUsers());

    return res.status(200).send(users);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get('/api/messages', async (req, res) => {
  const { myId, userId } = req.query;

  try {
    const [messages] = await pool.query(getAllMessages(myId, userId));

    return res.status(200).send(messages);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post('/api/send', async (req, res) => {
  const { message } = req.body;

  try {
    const [[, [createdMessage]]] = await pool.query(sendMessage(message));

    io.to('update').emit('on-send-message', message);

    return res.status(200).send(createdMessage);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.put('/api/touched', async (req, res) => {
  const { JSON, id } = req.body;
  try {
    pool.query(`${updateDb(id, JSON)} SELECT * FROM users`, (error) => {
      if (error) throw new Error(error);
      pool.query('SELECT * FROM users', (e, r) => {
        if (e) throw new Error(e);

        const targetUser = r.find((user) => +user.id === +id);

        return res.status(200).json(targetUser.JSON);
      });
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.use(bodyParser.json());

app.use(router);

app.use(express.static(`${__dirname}./../build`));
app.use(express.static(`${__dirname}./../build/static/js`));
app.use(express.static(`${__dirname}./../build/static/css`));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './../build/index.html'));
});

server.listen(port, () => {
  pool.query(createUsersTable() + ' ' + createMessagesTable());
  console.log(`running on port ${port}`);
});

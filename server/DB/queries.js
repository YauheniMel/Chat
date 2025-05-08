module.exports.findAllUsers = () => `
    SELECT * FROM users
`;

module.exports.findByName = (name) => `
    SELECT * FROM users
    WHERE (name = '${name}')
`;

module.exports.getAllMessages = (myId, userId) => `
    SELECT * FROM messages
    WHERE ((user_id = '${myId}' AND to_id = '${userId}') OR (user_id = '${userId}' AND to_id = '${myId}'))
`;

module.exports.createUser = (name) => `INSERT INTO users (
  name,
  state
) VALUES (
  '${name}',
  'online'
);`;

module.exports.updateDb = (id, JSON) => `
  UPDATE users SET JSON = '${JSON}'
  WHERE id = ${id};
`;

module.exports.updateUsers = (id, JSON) => `
  UPDATE users SET users = '${JSON}'
  WHERE id = ${id};
`;

module.exports.updateListUsers = (users) => `
  SET SQL_SAFE_UPDATES = 0;
  UPDATE users SET users = '${users}';
`;

module.exports.sendMessage = (message) => `
  INSERT INTO messages (
  content,
  user_id,
  to_id,
  state
) VALUES (
  '${message.content}',
  '${message.authorId}',
  '${message.toId}',
  'untouched'
);
SELECT * FROM messages WHERE id = LAST_INSERT_ID()
`;

module.exports.createUsersTable = () => `
  CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL auto_increment PRIMARY KEY,   
  name  varchar(100) NOT NULL,
  state  enum('online','offline','blocked') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

module.exports.createMessagesTable = () => `
  CREATE TABLE IF NOT EXISTS messages (
  id int(11) NOT NULL auto_increment PRIMARY KEY,
  user_id int(11) NOT NULL,
  to_id int(11) NOT NULL, 
  content TEXT NOT NULL,
  state  enum('touched','untouched') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (to_id) REFERENCES users(id)
);
`;

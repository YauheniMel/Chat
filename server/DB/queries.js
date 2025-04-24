module.exports.createUser = (name, id, users) => `INSERT INTO users (
  name,
  JSON,
  id,
  users
) VALUES (
  '${name}',
  '[]',
  '${id}',
  '${users}'
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
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
`;

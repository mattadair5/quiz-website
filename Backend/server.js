const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid-v4');
const mysql = require('mysql');
const argon2 = require('argon2');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: process.env.db,
  connectionLimit: 10,
  multipleStatements: true,
});

const serverQuery = (sqlCode, params, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      callback(err);
    } else {
      connection.query(sqlCode, params, function(err, result) {
        connection.release();
        if (err) {
          callback(err);
        } else {
          callback(null, result);
        }
      });
    }
  });
};
app.post('/register', async (req, res) => {
  const username = req.body.username;
  const password = await argon2.hash(req.body.password);
  const user = {username, password};

  serverQuery(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, userTable) => {
        if (userTable.length === 0) {
          serverQuery('INSERT INTO users SET ?', user, (err, userInput) => {
            if (err) {
              res.json({error: 'Unable to create user.'});
            } else {
              res.send(userInput);
            }
          });
        } else {
          res.json({error: 'Username is already taken.'});
        }
      },
  );
});

app.put('/changePassword', async (req, res) => {
  const username = req.body.username;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  serverQuery(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, result) => {
        const user = result[0];
        if (await argon2.verify(user.password, newPassword)) {
          res.json({error: 'Old and new password cannot be equal.'});
        } else {
          if (await argon2.verify(user.password, oldPassword)) {
            const changePassword = await argon2.hash(newPassword);
            serverQuery(
                'UPDATE users SET password = ? WHERE username = ?',
                [changePassword, username],
                (err, result) => {
                  if (err) {
                    res.json({error: ''});
                  } else {
                    res.json({message: 'Password changed successfully.'});
                  }
                },
            );
          } else {
            res.json({error: 'Password and/or username are not correct.'});
          }
        }
      });
});

app.get('/login', async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  serverQuery(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, result) => {
        const user = result[0];
        if (user !== undefined && await argon2.verify(user.password, password)) {
          const session = {user_id: user.id, session_key: uuid()};
          serverQuery('INSERT INTO sessions SET ?', session, (err) => {
            if (err) {
              return res.json({error: 'The session key could not be created.'});
            }
            res.json({
              message: 'You are now logged in.',
              key: session.session_key,
            });
          });
        } else {
          return res.json({error: 'Password or username did not match.'});
        }
      },
  );
});

app.get('/auth', (req, res) => {
  const sessionKey = req.query.session_key;
  serverQuery('SELECT sessions.user_id, sessions.timestamp, users.username FROM sessions LEFT JOIN users ON sessions.user_id = users.id WHERE sessions.session_key = ?', [sessionKey], (err, result) => {
    console.log(err);
    console.log(result);
  },
  );
  // const session = req.query.session;
  // const foundSession = sessions.find((s) => s.session === session);
  // if (foundSession) {
  //   res.send(foundSession.username);
  // } else {
  //   res.json({error: 'No session key found.'}).status(404);
  // }
});

app.get('/users', (req, res) => {
  serverQuery('SELECT * FROM users', [], (err, result) => {
    if (err) {
      res.json({error: 'Users table could not be found.'});
    } else {
      res.send(result);
    }
  });
});

module.exports.startApp = (callback) => {
  const PORT = process.env.PORT || 5432;

  server = app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
    if (callback) {
      callback();
    }
  });
};

module.exports.serverQuery = serverQuery;

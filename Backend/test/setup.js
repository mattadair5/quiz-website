require('dotenv').config({path: __dirname + '/.env'});
const server = require('../server');
const fs = require('fs');
const argon2 = require('argon2');

before((done) => {
  server.startApp(() => {
    const data = fs.readFileSync(__dirname + '/init.sql').toString('utf8');
    server.serverQuery(data, (error, result) => {
      if (error) {
        console.log(error);
        process.exit(1);
      } else {
        setupTestData(done);
      }
    });
  });
});

const setupTestData = async (done) => {
  const password = await argon2.hash('logintest');
  server.serverQuery('INSERT INTO users (username,password) VALUES("logintest",?)', [password], done);
};

after(() => {
  process.exit(0);
});

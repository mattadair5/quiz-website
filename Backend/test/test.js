const expect = require('chai').expect;
const axios = require('axios');

describe('Quiz Website API', () => {
  describe('/register', () => {
    it('Should allow user to register', (done) => {
      axios.post('http://localhost:5432/register', {
        username: 'admin',
        password: 'admin',
      }).then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });
    it('Should not allow a user to be registered with a username that already exists', (done) => {
      axios.post('http://localhost:5432/register', {
        username: 'admin',
        password: 'admin',
      }).then((res) => {
        expect(res.data).to.have.property('error')
            .that.equals('Username is already taken.');
        done();
      });
    });
  });
  describe('/login', () => {
    it('Should not allow user to login with incorrect username or password', (done) => {
      axios.get('http://localhost:5432/login', {
        params: {
          username: 'notadmin',
          password: 'notadmin',
        },

      }).then((res) => {
        expect(res.data).to.have.property('error')
            .that.equals('Password or username did not match.');
        done();
      });
    });
    it('Should allow the user to login if given correct username and password', (done) => {
      axios.get('http://localhost:5432/login', {
        params: {
          username: 'logintest',
          password: 'logintest',
        },

      }).then((res) => {
        expect(res.data).to.have.property('message')
            .that.equals('You are now logged in.');
        done();
      });
    });
  });
  describe('/changePassword', () => {
    it('Should not change the password if the old and new password are equal.', (done) => {
      axios.put('http://localhost:5432/changePassword', {
        username: 'admin',
        oldPassword: 'admin',
        newPassword: 'admin',
      }).then((res) => {
        expect(res.data).to.have.property('error')
            .that.equals('Old and new password cannot be equal.');
        done();
      });
    });
    it('Should not change the password if the old password and username are not correct.', (done) => {
      axios.put('http://localhost:5432/changePassword', {
        username: 'admin',
        oldPassword: 'incorrectpass',
        newPassword: 'admins',
      }).then((res) => {
        expect(res.data).to.have.property('error')
            .that.equals('Password and/or username are not correct.');
        done();
      });
    });
    it('Should change the password if the username and old password match and the new password is not equal to the old password.', (done) => {
      axios.put('http://localhost:5432/changePassword', {
        username: 'admin',
        oldPassword: 'admin',
        newPassword: 'admin2',
      }).then((res) => {
        expect(res.data).to.have.property('message')
            .that.equals('Password changed successfully.');
        done();
      });
    });
  });

  //   describe('/login', () => {
  //     it('Should have a password and username that match', (done) => {

  //     });
  //     it('Should create a session key', (done) => {

//     });
//   });
});

// request('http://localhost:8080' , function(error, response, body) {
//     expect(body).to.equal('Hello World');
//     done();
// });

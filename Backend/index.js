const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid-v4");
const mysql = require("mysql");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "quiz-website",
    connectionLimit: 10
  });


  
const users = [{username:"admin",password:"admin"}];
const sessions = [];

const serverQuery = (sqlCode, params, callback) => {
    pool.getConnection((err,connection) => {
        if (err) {
            callback(err);
        } else {
            connection.query(sqlCode, params, function (err, result) {
                connection.release();
                if (err) {
                    callback(err);
                } else {
                    callback(null,result)
                }
            });
        }
    })
}
app.post('/register', (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    var user = {username, password};

    serverQuery("SELECT * FROM users WHERE username = ?", [username], (err, userTable) => {
        if (userTable.length === 0) {
            serverQuery("INSERT INTO users SET ?", user, (err, userInput) => {
                if (err) {
                    res.send("Unable to create user.");
                } else {
                res.send(userInput);
                }
            });
        } else {
            res.send("Username is already taken.");
        }
    });
});

app.put('/changePassword', (req,res) => {

    const username = req.body.username;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (oldPassword !== newPassword) {
        serverQuery("UPDATE users SET password = ? WHERE username = ? && password = ?", [newPassword, username, oldPassword], (err, result) => {
            if (result.changedRows === 0) {
                res.send("Username and password do not match.")
            } else {
                res.send("Password changed successfully.")
            }
        })
    } else {
        res.send("Old password and new password cannot be the same.");
    }
});

app.get('/login', (req,res) => {

    const username = req.query.username;
    const password = req.query.password;

    //TODO: MAKE SESSION KEY FROM DATABASE

    serverQuery("SELECT * FROM users WHERE username = ? && password = ?", [username, password], (err, result) => {
        if (result.length === 0) {
            res.send("Username and password are incorrect.");
        } else {
            res.send("You are logged in.");
        }
    })
});

app.get('/auth', (req,res) => {

    const session = req.query.session
    const foundSession = sessions.find(s =>  s.session === session);
    if(foundSession) {
        res.send(foundSession.username)
    } else {
        res.send("No session key found.").status(404);
    }
});

app.get('/users', (req,res) => {
    // res.send(users.map(user => user.username))
    serverQuery("SELECT * FROM users", [], (err,result) => {
        res.send(result);
    });
})

const PORT = process.env.PORT || 5432;

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})
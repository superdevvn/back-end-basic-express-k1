var express = require('express');
var app = express();
var users = require('./models/users.js').User;
 
app.get('/', function (req, res) {
  res.send('Hello World')
});

app.get('/user/:id', function (req, res) {
    var result = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == req.params.id) {
            result = users[i];
            break;
        }
    }

    if (result !== null) {
        res.send(result);
    } else {
        res.send("Có lỗi!");
    }
});

app.get('/users', function (req, res) {
    console.log(req.query);
    res.send(users);
});

 
app.listen(3000);
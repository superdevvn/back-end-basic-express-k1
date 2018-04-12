
var express = require('express');

var app = express();
//khi goi domain khong thi no se xuat cai nay
app.get('/', function (req, res) { //phuong thuc get
    var info = {
        id: '001',
        name: 'linh',
        age: 21
    }
    res.send(info);
});
var info = {
    id: '004',
    name: 'linh dep trai',
}
app.get('/user', function (req, res) { //phuong thuc get
    var info1 = {
        id: '1512288',
        name: 'linh dep trai',
    }
    res.send(info1);
});
var users = [
    { id: '001', name: 'linh' },
    { id: '002', name: 'dep' },
    { id: '003', name: 'trai' }
];
users.push(info);
app.get('/users', function (req, res) { //phuong thuc get
    res.send(users);
});

app.get('/users/:id', function (req, res) { //phuong thuc get
    console.log(req.params);
    var temp = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === req.params.id) { //tránh đặt res.send trong vòng for
            temp = users[i];
            break;
        }
    }
    if (temp !== null)
        res.send(temp);
    else res.send('fail');
});

app.get('/users1', function (req, res) { //phuong thuc get
    console.log(req.query);
    res.send(true);
});
app.listen(4200);
//khai báo express
var express = require('express');
//khai báo express
var app = express();
//khai báo models
var users = require('./models/users.js').User;
//khai báo port
app.listen(3000);
var page, limit, head, tail, sort;
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
    var listPaging = [];
    var sortList = [];
    page = parseInt(req.query.page);
    limit = parseInt(req.query.limit);
    sort = req.query.sort;
    //Paging method
    if (limit * (page - 1) >= users.length || page === 0 || limit === 0) {
        return res.send('Có lỗi!');
    }
    head = (page - 1) * limit;
    tail = head + limit;
    if (tail >= users.length) {
        tail = users.length;
    }
    for (let i = head; i < tail; i++) {
        listPaging.push(users[i]);
    }

    //sort tăng dần theo ngày sinh
    for (let i = 0; i < listPaging.length; i++) {
        for (let j = i + 1; j < listPaging.length; j++) {
            if (listPaging[i].birthdate > listPaging[j].birthdate) {
                var temp = listPaging[i];
                listPaging[i] = listPaging[j];
                listPaging[j] = temp;
            }
        }
    }

    if (page !== null && limit !== null) {
        return res.send(listPaging);
    }

    //sort giảm dần
    if (sort === '1') {
        return res.send(listPaging);
    } else if (sort === '-1') {
        while (listPaging.length != 0) {
            sortList.push(listPaging[listPaging.length - 1]);
            listPaging.length--;
        }
        return res.send(sortList);
    }
    else {
        return res.send('Có lỗi!');
    }
});



var express = require('express');
var app = express();
var users = require('./models/users.js').User;
var len = users.length;
var page, limit, start, stop, sort;
app.get('/users', function (req, res) {
    var list = [];
    var decreList = [];
    var quereq = req.query;
    page = parseInt(quereq.page);
    limit = parseInt(quereq.limit);
    sort = quereq.sort;
    //cong thuc phan trang
    if (limit * (page - 1) >= len || page === 0 || limit === 0)
        return res.send('fail');
    start = limit * (page - 1);//trang bat dau
    stop = start + limit; //trang ket thuc
    if (stop >= len)
        stop = len;
    //list tu start -> stop
    for (var i = start; i < stop; i++) {
        list.push(users[i]);
    }
    // sort list tang dan theo ngay sinh
    for (var i = 0; i < list.length - 1; i++) {
        for (var j = i + 1; j < list.length; j++) {
            if (list[i].birthdate > list[j].birthdate) {
                var temp = list[i];
                list[i] = list[j];
                list[j] = temp;
            }
        }
    }
    // neu sort = 1 thi xuat tang dan
    if (sort === '1') {
        return res.send(list);
    }
    else if (sort === '-1') { // neu sort = -1 thi xuat giam dan
        var lenList = list.length;
        while (lenList !== 0) {
            decreList.push(list[lenList - 1]);
            lenList--;
        }
        return res.send(decreList);
        //return res.send(list.reverse());
    }
    else return res.send('fail');
});

app.listen(4200);
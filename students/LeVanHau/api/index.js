//khai báo express
var express = require('express');
var bodyParser = require('body-parser');
//khai báo express
var app = express();

//khai báo port
app.listen(3000);

// Connection URL
const url = 'mongodb://localhost:27017';

// Mongo Client
const MongoClient = require('mongodb').MongoClient;

// Database Name
const dbName = 'testDB';

//dùng ObjectId của mongodb để truyền Id
var ObjectId = require('mongodb').ObjectID;

//khai báo models
var users = require('./models/users.js').User;

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json());

// Use connect method to connect to the server
// MongoClient.connect(url, (err, client) => {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");

//     const db = client.db(dbName);

//     client.close();
// });

app.get('/userMongo', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: "mongoError", message: "Lỗi" });
        }
        const db = client.db(dbName);
        console.log(db.databaseName);
        res.send({ result: "done" });
    });
});

app.post('/createUser', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: "mongoError", message: "Lỗi" });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('User');

        userCollection.insertMany(users).then((result) => {
            res.send({ results: result, length: result.length });
            //process result
        }).catch((err) => {
            res.send({ error: 400, message: err });
        })
        client.close();
    });
});

app.post('/getUsers', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: "mongoError", message: "Lỗi" });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('User');

        userCollection.find({}).toArray((err, docs) => {
            if (err) {
                return res.send({ error: "mongoError", message: "Lỗi" });
            } else {
                return res.send({ users: docs, length: docs.length });
            }
        });
    });
});

app.get('/getUser/:id', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: "mongoError", message: "Lỗi" });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('User');

        userCollection.findOne({ '_id': req.params.id }, (err, docs) => {
            if (docs) {
                return res.send({ user: docs, length: docs.length });
            } else {
                return res.send({ error: "mongoError", message: "Lỗi" });
            }
        });
    });
});

app.delete('/deleteUsers', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: "mongoError", message: "Lỗi" });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('User');

        userCollection.deleteMany({}, (err, result) => {
            if (result) {
                return res.send({ message: "Delete successful ! " });
            } else {
                return res.send({ error: "mongoError", message: "Lỗi" });
            }
        });
    });
});

app.post('/updateUser/:id', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: "mongoError", message: "Lỗi" });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('User');

        console.log(req.params.id);
        console.log(typeof req.params.id);
        //cần chuyển đổi thành ObjectId
        userCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set:
                    {
                        "first_name": req.body.first_name,
                        "last_name": req.body.last_name
                    }
            }).then((result) => {
                res.send("Update thành công ! ");
                //process result
            }).catch((err) => {
                res.send({ error: 400, message: err });
            })
        client.close();
    });
});


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

    var listUser = [0, 1, 2, 3];

    if (typeof req.query.page == 'undefined' || typeof req.query.limit == 'undefined') {
        return res.send({ error: true, message: 'Invalid request' });
    }

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
    res.send({ users: listPaging, length: result.length });

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

    // if (page !== null && limit !== null) {
    //     return res.send(listPaging);
    // }

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


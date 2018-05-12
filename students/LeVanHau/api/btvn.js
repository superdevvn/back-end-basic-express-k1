var express = require('express');
var bodyParser = require('body-parser');

//declare express;
var app = express();

var path = require('path');
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/index', (req, res)=>{
    res.render('index', {data: "Hello World", data1: "Hele"});
});

//port
app.listen(1211);

//URL
const url = 'mongodb://localhost:27017';

//Mongo Client
var MongoClient = require('mongodb');

//Database Name
const dbName = 'testDB';

//khai báo object Id
var ObjectId = require('mongodb').ObjectID;

//models
var users = require('./models/users.js').User;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.post('/login', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: 'DatabaseError', message: 'Connecting failed !' });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('Person');
        userCollection.findOne({ username: req.body.username, password: req.body.password }).then((result) => {
            return res.send({ user: result });
        }).catch((err) => {
            return res.send(err);
        });
    });
});

//getLists
app.get('/getUsers', (req, res) => {

    var listPaging = [];

    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    var sort = parseInt(req.query.sort);

    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: 'DatabaseErro', message: 'Connecting failed ! ' });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('Person');

        if (typeof req.query.page == 'undefined' || typeof req.query.limit == 'undefined') {
            page = 0;
            limit = 0;
        }
        userCollection.find({}, { birthdate: 1, _id: 0 })
            .sort({ birthdate: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray().then((result) => {
                return res.send({ users: result, lenght: result.length });
                client.close();
            }).catch((err) => {
                return res.send({ error: 'DatabaseError', message: 'Connecting failed ! ' });
                client.close();
            });
    });
});

//createUser
app.post('/createUsers', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: 'DatabaseError', message: 'Connecting failed !' });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('Person');

        userCollection.insertMany(users).then((result) => {
            res.send({ result: result, lenght: result.lenght });
            client.close();
        }).catch((err) => {
            res.send({ error: 400, message: err });
        })
    });
});

app.post('/createUser', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: 'DatabaseError', message: 'Connecting failed !' });
        }
        const db = client.db(dbName);
        var userCollection = db.collection('Person');
        var query = req.body;
        if (userCollection.findOne({ username: query.username }) === null) {
            userCollection.insertOne({
                email: query.email,
                gender: query.gender,
                phone_number: query.phone_number,
                birthdate: query.birthdate,
                location: {
                    street: query.street,
                    city: query.city,
                    state: query.state,
                    postcode: query.postcode
                },
                username: query.username,
                password: query.password,
                first_name: query.first_name,
                last_name: query.last_name,
                title: query.title,
                picture: query.picture
            }).then((result) => {
                res.send({ result: "Add successfully ! " });
                client.close();
            }).catch((err) => {
                res.send({ error: 400, message: err });
                client.close();
            });
        } else {
            res.send({ result: "Account is exist ! " });
        }
    });
});

//getUser
app.get('/getUser/:id', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: 'DatabaseError', message: 'Connecting failed !' });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('Person');

        userCollection.findOne({ _id: ObjectId(req.params.id) }, (err, docs) => {
            if (docs) {
                return res.send({ user: docs, lenght: docs.lenght });
            } else {
                return res.send({ error: 'DatabaseError', message: 'Connecting failed!' });
            }
        });
    });
});

app.delete('/deleteUser/:id', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: "DatabaseError", message: "Connecting failed !" });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('Person');

        userCollection.deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
            if (result) {
                return res.send({ message: "Delete Successful!" });
            } else {
                return res.send({ error: 400, message: "Ko xoá dc" });
            }
        });
    });
});

//updateUser
app.put('/updateUser/:id', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({
                error: 'DatabaseError',
                message: 'Connecting failed !'
            });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('Person');

        userCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set:
                    {
                        'first_name': req.body.first_name,
                        "last_name": req.body.last_name
                    }
            }).then((result) => {
                res.send("Update thành công ! ");
                client.close();
                // res.send({ result: result, lenght: result.lenght });
            }).catch((err) => {
                res.send({ error: 400, message: err });
            })
    });
});

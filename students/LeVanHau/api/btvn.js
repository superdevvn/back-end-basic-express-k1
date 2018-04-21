var express = require('express');
var bodyParser = require('body-parser');


//declare express;
var app = express();

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

//getLists
app.get('/getUsers', (req, res) => {

    var listPaging = [];

    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);

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
        userCollection.find().skip((page - 1) * limit).limit(limit).toArray((err, docs) => {
            if (err) {
                return res.send({ error: 'DatabaseError', message: 'Connecting failed ! ' });
            } else {
                return res.send({ users: docs, lenght: docs.length });
            }
        });
    });
});

//createUser
app.post('/createUser', (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if (err) {
            return res.send({ error: 'DatabaseError', message: 'Connecting failed !' });
        }
        const db = client.db(dbName);

        var userCollection = db.collection('Person');

        userCollection.insertMany(users).then((result) => {
            res.send({ result: result, lenght: result.lenght });
        }).catch((err) => {
            res.send({ error: 400, message: err });
        })
        client.close();
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
                // res.send({ result: result, lenght: result.lenght });
            }).catch((err) => {
                res.send({ error: 400, message: err });
            })
        client.close();
    });
});

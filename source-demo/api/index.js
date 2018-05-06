var express = require('express');
var app = express();
var moduleFunction = require('./models/users.js');
var users = moduleFunction.User;
var MongoClient = require('mongodb').MongoClient;

var path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/index', function(req, res) {
    res.render('index', {data: "Hello World", name: "Duc"});
});

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'testDB';

// Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   client.close();
// });

app.get('/userMongo', function(req, res) {
    MongoClient.connect(url, function(err, client) {
        if(err) {
            return res.send({error: "mongoErro", message: err});
        }

        var db = client.db(dbName);

        console.log(db.databaseName);

        res.send({result: "done"});
    });
});

app.post('/createUser', function(req, res) {
    MongoClient.connect(url, function(err, client) {
        if(err) {
            return res.send({error: "mongoErro", message: err});
        }

        var db = client.db(dbName);

        var userCollection = db.collection('User');

        collection.insertMany([
            {
                "email": "melany.wijngaard@example.com",
                "gender": "female",
                "phone_number": "(727)-033-9347",
                "birthdate": 608022796,
                "location": {
                  "street": "2431 predikherenkerkhof",
                  "city": "staphorst",
                  "state": "gelderland",
                  "postcode": 64265
                },
                "username": "bigpeacock217",
                "password": "eagle",
                "first_name": "melany",
                "last_name": "wijngaard",
                "title": "miss",
                "picture": "women/70.jpg"
              },
              {
                "email": "nanna.pedersen@example.com",
                "gender": "female",
                "phone_number": "43672992",
                "birthdate": 591428535,
                "location": {
                  "street": "2177 fåborgvej",
                  "city": "aarhus",
                  "state": "syddanmark",
                  "postcode": 87547
                },
                "username": "purpleduck599",
                "password": "davids",
                "first_name": "nanna",
                "last_name": "pedersen",
                "title": "ms",
                "picture": "women/68.jpg"
              }
          ]).then(function(result) {
            res.send(result);
            // process result
          }).catch(function(err) {
            res.send({error: 400, message: err});
          })
    });
});


 
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

    if(typeof req.query.page == 'undefined' || typeof req.query.limit == 'undefined') {
        return res.send({error: true, message: 'invalid request'});
    }
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);

    var listUser = [ 0, 1, 2, 3];

    var sd = (page -1) * limit;
    var sc = sd + limit - 1;
    var result = [];

    for(var i=sd; i <=sc; i++) {
        result.push(users[i]);
    }

    var test = moduleFunction.sortUser(limit);
   

   
    res.send({users : result, length: test});
});

app.get("/search", (req, res) => {
    MongoClient.connect(url, (err, client) => {
        if(err) {
            return res.send({error: "Mongo error"});
        }
        userCollection.find({})
                      .sort({birthdate: query})
                      .toArray().then((result) => {

            res.send(result);
            
            client.close();

        }).catch((err) => {
            res.send({mess: err});
        });
    });
});
        

 
app.listen(3000);
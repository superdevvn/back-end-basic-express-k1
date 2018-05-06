var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

var MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'testDB';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user-login', function(req, res, next) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      return res.send({error: "mongoErro", message: err});
    }

    var db = client.db(dbName);
    var userCollection = db.collection('User');

    userCollection.findOne(
      {username: req.body.username, password: req.body.password}, 
      function(err, user) {
        if (err) {
          return res.send({error: "mongoErro", message: err});
        }

        var token = jwt.sign(user, "json-token", {
          expiresIn: 60 * 60
        });

        user.token = token;
        
        res.send({result: user});
      });
  });
});

module.exports = router;  

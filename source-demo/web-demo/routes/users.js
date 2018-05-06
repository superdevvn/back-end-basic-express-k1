var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'testDB';

var users = [
  {lastName: "John", firstName: "Doe", email: "john@example.com" },
  {lastName: "Mary", firstName: "Moe", email: "mary@example.com" },
  {lastName: "July", firstName: "Dooley", email: "july@example.com" }
];

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'json-token', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        console.log(decoded);
        req.user = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
		
  res.render('user', {title: "List Users", data: users});
});


router.post('/removeUser', function(req, res, next) {
  console.log(req.body);

  for (let index = 0; index < users.length; index++) {
    if (users[index].email = req.body.email) {
      users.splice(index, 1);
    }    
  } 
  		
  res.send({success: true});
});

router.get('/list', function(req, res, next) {
  res.send('respond with a resource list user');
});


router.post('/userlogin', function(req, res, next) {
  var cunrrentUser = req.user;
  res.send({result: true});
  // MongoClient.connect(url, function(err, client) {
  //   if(err) {
  //       return res.send({error: "mongoErro", message: err});
  //   }

  //   var db = client.db(dbName);

  //   var userCollection = db.collection('User');

  //   userCollection.findOne(
  //     {username: req.params.username, password: req.params.password}, 
  //     function(err, user) {
  //       if (err) {
  //         return res.send({error: "mongoErro", message: err});
  //       }

  //       res.send({result: user});
  //     });
  // });
});

module.exports = router;

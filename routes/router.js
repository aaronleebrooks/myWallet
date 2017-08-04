const {BasicStrategy} = require('passport-http');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {User, Wallet} = require('../models/models');

const router = express.Router();


router.use(bodyParser.json());

//basic encrpytion strategy for using Passport
const strategy = new BasicStrategy(
  (username, password, cb) => {
    User
      .findOne({username})
      .exec()
      .then(user => {
        if (!user) {
          return cb(null, false, {
            message: 'Incorrect username'
          });
        }
        if (user.password !== password) {
          return cb(null, false, 'Incorrect password');
        }
        return cb(null, user);
      })
      .catch(err => cb(err))
});

passport.use(strategy);

//adds a new user, but checks to make sure all required fields are met.
router.post('/', (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'No request body'
    });
  }

  if (!('username' in req.body)) {
    return res.status(422).json({
      message: 'Missing field: username'
    });
  }

  let {username, password, firstName, lastName} = req.body;

  if (typeof username !== 'string') {
    return res.status(422).json({
      message: 'Incorrect field type: username'
    });
  }

  username = username.trim();

  if (username === '') {
    return res.status(422).json({
      message: 'Incorrect field length: username'
    });
  }

  if (!(password)) {
    return res.status(422).json({
      message: 'Missing field: password'
    });
  }

  if (typeof password !== 'string') {
    return res.status(422).json({
      message: 'Incorrect field type: password'
    });
  }

  password = password.trim();

  if (password === '') {
    return res.status(422).json({
      message: 'Incorrect field length: password'
    });
  }

  // checks for existing user
  return User
    .find({username})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          name: 'AuthenticationError',
          message: 'username already taken'
        });
      }
      // if no existing user, hash password
      return User.hashPassword(password)
    })
    .then(hash => {
      return User
        .create({
          username: username,
          password: hash,
        })
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      if (err.name === 'AuthenticationError') {
        return res.status(422).json({message: err.message});
      }
      res.status(500).json({message: 'Internal server error'})
    });
});

//this gets the main wallet for the user based on their ID. The wallet is where their wallet is held.
router.get('/wallet/:id', (req, res) => {
  return User
    .findById(req.params.id)
    .exec()
    .then(users => res.json(users.justWallets()))
    .catch(err => {
      res.status(500).json({message: err})
    });
});

// NB: at time of writing, passport uses callbacks, not promises
const basicStrategy = new BasicStrategy(function(username, password, callback) {
  let user;
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
      }
      else {
        return callback(null, user)
      }
    });
});

passport.use(basicStrategy);
router.use(passport.initialize());

//checks to make sure a user exists and has the proper credentials before proceeding to the wallet.
router.get('/me',
  passport.authenticate('basic', {session: false}),
  (req, res) => 
  res.json({user: req.user.apiRepr()})
);

//Adds a new item to the wallet.
router.post('/wallet/:id', (req, res) => {
  //Checks to make sure the required fields are there. In this case, it is only the item description 
  const requiredFields = ['name'];
  for  (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  User
  .findById(req.params.id)
  .then(function(user) {
    let walletIndex = user.wallet.findIndex(function(walletArray) {
      return req.body.name === walletArray.name && req.body.name === walletArray.name
    });
    //this makes sure the 
    if(walletIndex == '-1') {
      user.wallet.push(req.body);
      // Need this line for mongoose to realize the array has been modified
      user.markModified('wallet');
      return user.save();
    }
  })
  .then(function(saved) {
      res.sendStatus(204);
  })
    .catch(err => {
      res.status(500).json({message: err})
    });
});

router.delete('/wallet/:id', (req, res) => {
  User
    .findById(req.params.id)
    .then(user => {
        user.wallet.forEach(function(walletObj){
          if(walletObj.id === req.body.id){
            user.wallet.splice(user.wallet.indexOf(req.params.id));
            user.markModified('wallet');
            user.save();
            res.sendStatus(204);
          }
        })
    })
});

router.put('/wallet/:id', function(req, res, next) {

  const requiredFields = ['name', 'description'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }


  User.findById(req.params.id)
  .then(function(user) {
    let walletIndex = user.wallet.findIndex(function(walletArray) {
      return req.body.id === walletArray.id
    });
    user.wallet[walletIndex] = req.body;
      // Need this line for mongoose to realize the array has been modified
      user.markModified('wallet');
    return user.save();
  })
  .then(function(saved) {
      res.sendStatus(204);
  })
    .catch(err => {
      res.status(500).json({message: err})
    })
});

module.exports = router;


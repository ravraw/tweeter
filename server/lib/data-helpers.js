'use strict';

const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

// Simulates the kind of delay we see with network or filesystem operations
//const simulateDelay = require('./util/simulate-delay');

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection('tweets').insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection('tweets')
        .find()
        .toArray((err, tweets) => {
          if (err) {
            return callback(err);
          }
          callback(null, tweets);
        });
    },

    // add or delete a like
    toggleLikes: function(id, count, callback) {
      db.collection('tweets').findOneAndUpdate(
        { _id: id },
        { $set: { content: 'helllo0000000000000' } },
        function(err, result) {
          if (err) {
            console.log(err);
          }
          console.log('Updated likes');
          callback(null, result);
        }
      );
    },
    // login a user
    loginUser: function(user, callback) {
      console.log('From datahelpers -login');
      const { username, password } = user;
      db.collection('users')
        .find({ username })
        .toArray((err, user) => {
          if (err) {
            console.log(err);
          }
          console.log('Inside array:', user);
          let currentUser = user[0];
          let id = currentUser._id;
          let userHandle = currentUser.userHandle;
          let userPassword = currentUser.hashedPassword;
          if (user.length && bcrypt.compareSync(password, userPassword)) {
            console.log('username is registered');
            callback(null, { id, username, userHandle });
          } else {
            console.log('username not registered');
          }
        });
    },

    // register users
    registerUser: function(newUser, callback) {
      const { username, password } = newUser;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const userHandle = `@${username}`;
      newUser = { username, hashedPassword, userHandle };
      db.collection('users')
        .find({ username })
        .toArray((err, users) => {
          if (err) {
            console.log(err);
          }
          console.log('Inside array:', users);
          if (users.length) {
            console.log('username not avaialable');
          } else {
            console.log('username is available');
            db.collection('users').insertOne(newUser, (err, result) => {
              if (err) {
                console.log(err);
              }
              //req.session.userSession = hashedPassword;
              callback(null, { username, userHandle });
            });
          }
        });
    }
  };
};

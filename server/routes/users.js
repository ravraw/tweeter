'use strict';

const userHelper = require('../lib/util/user-helper');

const express = require('express');
const usersRoutes = express.Router();
const cookieSession = require('cookie-session');

module.exports = function(DataHelpers) {
  // get currentUser
  usersRoutes.get('/currentUser', (req, res) => {
    const currentUserID = req.session.userSession;
    DataHelpers.getCurrentUser(currentUserID, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        console.log(user);
        res.status(200).send(user);
      }
    });
  });
  // register a user
  usersRoutes.post('/register', (req, res) => {
    const { username, password } = req.body;
    const newUser = {
      username,
      password
    };
    DataHelpers.registerUser(newUser, (err, newUser) => {
      if (err) {
        res.status(500).json({
          error: err.message
        });
      } else {
        console.log('FRom register :', newUser);
        req.session.userSession = newUser.id;
        res.status(201).send(newUser);
      }
    });
  });
  // login a user
  usersRoutes.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = {
      username,
      password
    };

    if (!username || !password) {
      res.status(400).send('status: 400 : Provide Email and password');
    } else {
      DataHelpers.loginUser(user, (err, currentUser) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          req.session.userSession = currentUser.id;
          res.status(200).send(currentUser);
        }
      });
    }
  });

  // logout a user
  usersRoutes.post('/logout', (req, res) => {
    req.session = null;
    res.status(200).redirect('/tweets');
  });

  return usersRoutes;
};

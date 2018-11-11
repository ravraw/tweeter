'use strict';

const userHelper = require('../lib/util/user-helper');

const express = require('express');
const usersRoutes = express.Router();

module.exports = function(DataHelpers) {
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
        //req.session.userSession = username;
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
    DataHelpers.loginUser(user, (err, currentUser) => {
      if (err) {
        res.status(500).json({
          error: err.message
        });
      } else {
        //req.session.userSession = username;
        res.status(200).send({ currentUser });
      }
    });
  });

  return usersRoutes;
};

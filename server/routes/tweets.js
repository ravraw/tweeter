'use strict';

const userHelper = require('../lib/util/user-helper');

const express = require('express');
const tweetsRoutes = express.Router();

module.exports = function(DataHelpers) {
  // get all Tweets route
  tweetsRoutes.get('/', function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        1;
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(tweets);
      }
    });
  });

  // post a new tweet route
  tweetsRoutes.post('/', function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;
    }

    const user = req.body.user
      ? req.body.user
      : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      likes: 0,
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, err => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(tweet);
      }
    });
  });

  // add or remove a like
  tweetsRoutes.post('/:id/likes', (req, res) => {
    const { count } = req.body;
    const { id } = req.params;
    DataHelpers.toggleLikes(id, count, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        //console.log(res);
        res.status(201).send(result);
      }
    });
  });

  return tweetsRoutes;
};

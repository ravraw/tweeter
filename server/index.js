'use strict';
require('dotenv').config();

// Basic express setup:

const PORT = 8080;
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  cookieSession({
    name: 'session',
    keys: ['qwertyu', 'ertyui'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = 'mongodb://localhost:27017/tweeter';

// FOR MLAB DB
// const MONGODB_URI = `mongodb://${process.env.DB_USER}:${
//   process.env.DB_PASSWORD
// }@ds159493.mlab.com:59493/tweeter`;

MongoClient.connect(
  MONGODB_URI,
  (err, db) => {
    if (err) {
      console.error(`Failed to connect: ${MONGODB_URI}`);
      throw err;
    }
    console.log(`Connected to mongodb: ${MONGODB_URI}`);

    const DataHelpers = require('./lib/data-helpers.js')(db);

    const tweetsRoutes = require('./routes/tweets')(DataHelpers);
    const usersRoutes = require('./routes/users')(DataHelpers);
    //const rootRoutes = require('./routes/')(DataHelpers);

    app.use('/tweets', tweetsRoutes);
    app.use('/users', usersRoutes);
    // app.use('/');

    //db.close();
  }
);

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});

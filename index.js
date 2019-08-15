require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi); //to validate ObjectId
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customer = require('./routes/customer');
const movies = require('./routes/movie');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();
const config = require('config');
const error = require('./middlewares/error');
const winston = require('winston'); //logging library
require('winston-mongodb'); //logging for mongodb

process.on('uncaughtException',(ex)=>{
  winston.error(ex.message,ex);
  process.exit(1);
});

process.on('unhandledRejection',(ex)=>{
  winston.error(ex.message,ex);
  process.exit(1);
});

winston.add(new winston.transports.File({filename:'logfile.log'}));
winston.add(new winston.transports.MongoDB({db:'mongodb://localhost/vidly'}));

if(!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);//exit on error
}

// throw new Error('Uncaught Exception');
mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customer);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);

//express overall middleware to catch errors

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
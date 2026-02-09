// npm
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();

const cors = require('cors');
const logger = require('morgan');


// Import routers
const authRouter = require('./controllers/auth');
const usersRouter = require('./controllers/users');
const moodRouter = require('./controllers/mood')
require('./middleware/connection')


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(logger('dev'));

// Routes
app.use('/auth', authRouter);
// app.use('/test-jwt', testJwtRouter);
app.use('/users', usersRouter);
app.use('/moods',moodRouter)

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('The express app is ready!');
});

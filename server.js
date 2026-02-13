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
const moodRouter = require('./controllers/moods');
const communityRouter = require('./controllers/community')
require('./middleware/connection')


// Middleware
app.use(cors({
  origin: '*',
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(logger('dev'));

// Routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/moods', moodRouter);
app.use('/community', communityRouter);


// Start the server and listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
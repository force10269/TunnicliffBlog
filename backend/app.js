const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const { mongoose } = require("./db.js");

var app = express();
app.use(bodyParser.json());
app.use(cors([{ origin: process.env.CORS_ORIGIN }]));

var blogController = require('./controllers/blogController.js');
app.use('/blogs', blogController);

var commentController = require('./controllers/commentController.js');
app.use('/comments', commentController);

var likeController = require('./controllers/likeController.js');
app.use('/likes', likeController);

var userController = require('./controllers/userController.js');
app.use('/users', userController);

var loginController = require('./controllers/loginController.js');
var signupController = require('./controllers/signupController.js');

app.post('/login', loginController.login);
app.post('/signup', signupController.signup);

module.exports = { app };

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const { mongoose } = require("./db.js");

var app = express();
app.use(bodyParser.json({ limit: '4mb' }));
app.use(bodyParser.urlencoded({ limit: '4mb', extended: true }));
app.use(cors());

var blogController = require('./controllers/blogController.js');
app.use('/blogs', blogController);

var commentController = require('./controllers/commentController.js');
app.use('/comments', commentController);

var likeController = require('./controllers/likeController.js');
app.use('/likes', likeController);

var userController = require('./controllers/userController.js');
app.use('/users', userController);

var imageController = require('./controllers/imageController.js');
app.use('/images', imageController);

var loginController = require('./controllers/loginController.js');
var signupController = require('./controllers/signupController.js');

app.use('/login', loginController);
app.use('/signup', signupController);

module.exports = { app };

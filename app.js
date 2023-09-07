//npx nodemon to start
const dotenv = require('dotenv')  //npm i dotenv - Should be on the top
dotenv.config()
const config = require('config')  //npm i config
const conf = require('./config/configData')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan')

const cors = require('cors')
const jwt = require('jsonwebtoken') //npm i jsonwebtoken
const bcrypt = require('bcrypt')  //npm i bcrpt
const cookieParser = require('cookie-parser') //an alternative to jwt?
const session = require('express-session') //npm i express-sessio

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var ordersRouter = require('./routes/orders');
const counterRouter = require('./routes/counter')

var app = express();
app.use(cors({
  origin: [conf.clientSettings.url],
  methods: ["POST", "GET"],
  credentials: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger(process.env.LOG_EVEL || 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: conf.sessionSettings.codephrase,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 2*60*1000} //in milliseconds
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/counter', counterRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log(`Server is up and running`)

module.exports = app;

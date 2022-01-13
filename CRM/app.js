const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const managerRouter = require('./routes/manager');
const customerRouter = require('./routes/customer');
const projectRouter = require('./routes/project');

const app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/manager', managerRouter);
app.use('/customer', customerRouter);
app.use('/project', projectRouter);

module.exports = app;

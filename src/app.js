const express = require('express');
const app = express();

app.use('/', require('./route/index'));
app.use('/configuration', require('./route/configurationRoute'));

module.exports = app;

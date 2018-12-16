var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

global.sql = require('mssql');
global.sqlConfig = {
    user: 'DPVM',
    password: 'DPVM.2018.x',
    server: '161.53.18.102',
    database: 'DPVM'
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/Routes');
routes(app);

app.listen(port);

console.log('RESTful API server started on: ' + port);

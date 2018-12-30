var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());

app.use(session({
  key: 'user_sid',
  secret: 'ferunizagreb',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));


var path = require("path");
global.sql = require('mssql');
global.sqlConfig = {
    user: 'DPVM',
    password: 'DPVM.2018.x',
    server: '161.53.18.102',
    database: 'DPVM'
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard');
  } else {
      next();
  }    
};

app.get('/', sessionChecker, (req, res) => {
  res.redirect('/login');
});

app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

            global.sql.connect(global.sqlConfig, function() {
              var request = new sql.Request();
              var query = 'select COUNT(*) postoji FROM Korisnik WHERE KorisnickoIme = \'' + username + '\' AND Lozinka =\'' + password + '\'';
        
              request.query(query, function(err, recordset) {
                  if (err)
                  res.send(err);
        
                  if(recordset.recordset[0].postoji === 1){
                    req.session.user = username;
                res.redirect('/dashboard');
                  }else{
                    res.redirect('/login');
                  }
        
                  sql.close();
              }); });

    });

    app.get('/dashboard', (req, res) => {
      if (req.session.user && req.cookies.user_sid) {
          res.sendFile(__dirname + '/public/dash.html');
      } else {
          res.redirect('/login');
      }
  });

app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      res.redirect('/');
  } else {
      res.redirect('/login');
  }
});

app.use(function (req, res, next) {
res.status(404).send("Sorry can't find that!")
});

var routes = require('./api/routes/Routes');
routes(app);

app.listen(port);

console.log('RESTful API server started on: ' + port);

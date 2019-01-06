var subjects = require('./api/controllers/userController.js');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
var path = require("path");

app.set('views', path.join(__dirname, '/public'));

app.set('view engine', 'ejs');

app.use(session({
  key: 'user_sid',
  secret: 'ferunizagreb',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));


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

  /* sandrina brljotina */
  app.get('/studenti', (req, res) => {
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var query = 'select * FROM Korisnik WHERE TipId=1';
            request.query(query, function(err, recordset) {
                if (err)
                res.send(err);
                var student = (recordset.recordset);
                sql.close();
                res.render('studenti', {students:student});
            }); });
    });

    app.get('/predmeti', (req, res) => {
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var query = 'select * from PREDMET, ZAVOD where Predmet.ZavodID=ZAVOD.Id';
            request.query(query, function(err, recordset) {
                if (err)
                res.send(err);
                var predmet = (recordset.recordset);
                sql.close();
                console.log(predmet);
                res.render('predmeti', {predmeti:predmet});
            }); });
    });

    app.get('/ispiti', (req, res) => {
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var query = 'select * from ISPIT';
            request.query(query, function(err, recordset) {
                if (err)
                res.send(err);
                var ispit = (recordset.recordset);
                sql.close();
                console.log(ispit);
                res.render('ispiti', {ispiti:ispit});
            }); });
    });

app.get('/newUser', (req, res) => {
    res.render('novi_user');
});

    app.post('/newUser', (req, res) => {
        global.sql.connect(global.sqlConfig, function() {
          var request = new sql.Request();
      
          var username = req.body.KorisnickoIme; 
          var password = req.body.Lozinka;
          var name = req.body.Ime;
          var jmbag = req.body.JMBAG;
          var surname = req.body.Prezime;
          var date = req.body.Datum;
          var type = req.body.TipId;
          var id = req.body.Id;
          var query = `INSERT INTO (KorisnickoIme,Ime,JMBAG,Prezime,Datum,Lozinka,TipId) Korisnik Values (${username},${name},${jmbag},${surname},${date},${password},${type})` ;
       
          request.query(query, function(err, recordset) {
                if (err)
                res.send(err);
      
                if(recordset.rowsAffected.length === 1){
                  res.json({odgovor:"true"})
                }else{
                  res.json({odgovor:"false"})
                }
      
                sql.close();
            });
        });
    }); 
  
/* kraj sandrine brljotine */
 

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

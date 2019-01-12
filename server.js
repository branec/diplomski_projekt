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
app.use("/apidoc", express.static(__dirname + '/apidoc'))

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
                res.redirect('/dashboard?user=' + username);
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

  app.get('/scanner', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/scanner.html');
    } else {
        res.redirect('/login');
    }
});
/*ovo treba prilagoditi, napravila sam samo da mogu pregledavat stranicu*/
app.get('/uvid', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/uvid.html');
    } else {
        res.redirect('/login');
    }
});

<<<<<<< HEAD
=======
app.get('/prof_dash', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/prof_dash.html');
    } else {
        res.redirect('/login');
    }
});
/*kraj*/

  

  /* sandrina brljotina */
>>>>>>> adbbaffb5d3e56c1b452e832f6ee9c24ace9b12e
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
                if (err){
                res.send(err);
                sql.close();
            }
                var predmet = (recordset.recordset);
                sql.close();
                console.log(predmet);
                res.render('predmeti', {predmeti:predmet});
            }); });
    });

    app.get('/ispiti', (req, res) => {
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var query = 'select * from ISPIT JOIN PREDMET on PREDMET.Id = ISPIT.PredmetId ';
            
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
          let canUpdate = true
          Object.keys(req.body).forEach(row => {
            if(req.body[row] === "") {
                res.status(400)
                res.send(row + " is missing")
                canUpdate = false
            }
            })
            if(!canUpdate) return

          var query = `INSERT INTO Korisnik (KorisnickoIme,Ime,JMBAG,Prezime,Lozinka,TipId) values ('${username}','${name}','${jmbag}','${surname}','${password}','${type}')` ;
          console.log(req.body, query)
       
          request.query(query, function(err, recordset) {
                if (err) {
                    res.send(err);
                    sql.close()
                    return
                  }
    
                if(recordset.rowsAffected.length === 1){
                  res.redirect("/studenti")
                }else{
                  res.json({odgovor:"false"})
                }
      
                sql.close();
            });
        });
    }); 
  
 
app.get('/subjects/newSubject', (req, res) => {
    res.render('noviPredmet');
});

app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      res.redirect('/');
  } else {
      res.redirect('/login');
  }
});

var routes = require('./api/routes/Routes');
routes(app);

app.use(function (req, res, next) {
res.status(404).send("Sorry can't find that!")
});


app.listen(port);

console.log('RESTful API server started on: ' + port);

var subjects = require('./api/controllers/userController.js');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');
  const multer = require("multer");
  const fs = require("fs");

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

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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

app.get('/uvid', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/uvid.html');
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

/*handling pictures*/
const upload = multer({
    dest: "./temp",
    limits: { fieldSize: 25 * 1024 * 1024 }
  });
  
  
  const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

app.post(
    "/uploadfile",
    upload.single("file" /* name attribute of <file> element in your form */),
    (req, res) => {

        var user = req.query.user;
        var ispit = req.query.exam;
        var sheet = req.query.sheet;
        var rbr = req.query.rbr;
        var urlSlika =  "./uploaded/" + ispit + "/" + user + req.query.rbr +".png";

        var dir = './uploaded/' + ispit;

            if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
            }


      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, urlSlika);
  
      if (path.extname(req.file.originalname).toLowerCase() === "") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);

          global.sql.connect(global.sqlConfig).then(pool => {
            return pool.request()
            .query(`select id from KOSULJICA WHERE Qrkod ='${sheet}' `)
        }).then(result => {
            console.dir(result)
                if(result.recordset.length > 0){
                    global.sheetId = result.recordset[0].id;
                }else{
                    global.sheetId = -1
                }
                global.sql.close();
            return global.sql.connect(global.sqlConfig)
           
        }).then(pool => {
            return pool.request()
            .query(`select id from Korisnik WHERE KorisnickoIme ='${user}' `)
        }).then(result => {
            console.dir(result)
            if(result.recordset.length > 0){
                global.userId = result.recordset[0].id;
            }else{
                global.userId = -1
            }
            global.sql.close();
        return global.sql.connect(global.sqlConfig)
        }).then(pool => {

            if(global.sheetId === -1){
                return pool.request()
                .query(`INSERT INTO Kosuljica (Qrkod,IspitID,KorisnikId,StatusKosuljice) VALUES ('${sheet}',${ispit},${global.userId},1); INSERT INTO Slika (KosuljicaId,KorisnikId,Url) VALUES (SCOPE_IDENTITY(),${global.userId},'${urlSlika}');`)
            }else{
                return pool.request()
                .query(`INSERT INTO Slika (KosuljicaId,KorisnikId,Url) VALUES (${global.sheetId},${global.userId},'${urlSlika}');`)
            }
            
        }).then(result => {
            console.dir(result)
        }).catch(err => {
            var rror = err;
            global.sql.close();
        })

          res
            .status(200)
            .contentType("text/plain")
            .end("File uploaded!");
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(403)
            .contentType("text/plain")
            .end("Only .png files are allowed!");
        });
      }
    }
  );

var routes = require('./api/routes/Routes');
routes(app);

app.use(function (req, res, next) {
res.status(404).send("Sorry can't find that!")
});


app.listen(port);

console.log('RESTful API server started on: ' + port);

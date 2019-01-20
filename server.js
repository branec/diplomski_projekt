var subjects = require('./api/controllers/userController.js');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');
  const multer = require("multer");
  const fs = require("fs");

var Globals = {
    'user': {},
    'predmeti': {}
}

module.exports = Globals;

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
              var query = 'select * FROM Korisnik WHERE KorisnickoIme = \'' + username + '\' AND Lozinka =\'' + password + '\'';
        
              request.query(query, function(err, recordset) {
                  if (err) {
                      sql.close();
                      res.send(err);
                  }
        
                  if(recordset.recordset[0]){
                    Globals.user=recordset.recordset[0];
                    req.session.user = username;
                    if(Globals.user.TipId === 1)
                        res.redirect('/dashboard?user=' + username);
                    else
                        res.redirect(`prof_dash?user=${username}`);
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

  app.get('/slika/:id', (req, res) => {
         var sql = global.sql;
         sql.close();
    sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();
        var query = `select Url FROM Slika WHERE Id=${req.params.id}`;
        request.query(query, function(err, recordset) {
            if (err) {
                  sql.close();
                  res.send(err);
              }
            var url = (recordset.recordset[0].Url);
            url = url.replace('.',"");
            sql.close();
            res.sendFile(__dirname +url);
        }); });
});

  app.get('/dashboard_prof', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/prof_dash.html');
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
        res.sendFile(__dirname + '/public/student_uvid.html');
    } else {
        res.redirect('/login');
    }
});
/*ovo treba prilagoditi, napravila sam samo da mogu pregledavat stranicu*/
app.get('/uvid/:exam/:user', (req, res) => {
    var ispit = req.params.exam;
    var user = req.params.user;
 
    global.sql.connect(global.sqlConfig, function() {
        var kosuljicaRequest = new sql.Request();
       
            var Kosuljica
            var Slike
            kosuljicaRequest.query(`select top 1 Kosuljica.Id as KosuljicaId,Kosuljica.Qrkod, Ispit.*, statusKosuljica.Naziv as statusKosuljica, statusIspit.Naziv as statusIspit, Predmet.Naziv as ImePredmeta, Korisnik.Ime, Korisnik.Prezime from Kosuljica join Ispit on Ispit.Id = Kosuljica.IspitID left join [Status] statusKosuljica on statusKosuljica.Id = Kosuljica.StatusKosuljice left join [Status] statusIspit on [statusIspit].Id = Ispit.[STATUS] join Predmet on Ispit.PredmetId = Predmet.Id join Korisnik on Predmet.KorisnikId = Korisnik.Id where Kosuljica.IspitID= ${ispit} and Kosuljica.KorisnikId=${user}`, function(err, recordset) {
                if(err)
                    res.send(err);

                Kosuljica = recordset.recordsets[0][0];
                kosuljicaRequest.query(`select * from Slika where KosuljicaId = ${Kosuljica.KosuljicaId}`, function(err, recordset) {
                    if(err)
                        res.send(err);
                    
                    Slike= recordset.recordsets[0];
                    kosuljicaRequest.query(`select * from Bodovi where KosuljicaId = ${Kosuljica.KosuljicaId} order by Zadatak`, function(err, recordset) {
                        if(err)
                            res.send(err);
                    
                        var Bodovi = recordset.recordsets[0];
                        var ukupno=0;
                        for(var i=0; i< Bodovi.length;i++) {
                            ukupno+= Bodovi[i].Bodovi;
                        }
                        res.json( {kosuljica: Kosuljica, slike: Slike, bodovi: Bodovi, ukupnoBodova: ukupno});
                        sql.close();
                });
            });
        });
      
    });
});



app.get('/uvid_student/:exam/:user', (req, res) => {
    var ispit = req.params.exam;
    var user = req.params.user;
 
    global.sql.connect(global.sqlConfig, function() {
        var kosuljicaRequest = new sql.Request();
       
            var Kosuljica
            var Slike
            kosuljicaRequest.query(`  select top 1 Kosuljica.Id as KosuljicaId,Kosuljica.Qrkod, Ispit.*, statusKosuljica.Naziv as statusKosuljica, statusIspit.Naziv as statusIspit, Predmet.Naziv as ImePredmeta, Korisnik.Ime, Korisnik.Prezime from Kosuljica join Ispit on Ispit.Id = Kosuljica.IspitID left join [Status] statusKosuljica on statusKosuljica.Id = Kosuljica.StatusKosuljice left join [Status] statusIspit on [statusIspit].Id = Ispit.[STATUS] join Predmet on Ispit.PredmetId = Predmet.Id left outer join KorisnikPredmet on KorisnikPredmet.PredmetId = ispit.PredmetId join Korisnik on KorisnikPredmet.KorisnikId = Korisnik.Id  where Kosuljica.IspitID= ${ispit} and Korisnik.KorisnickoIme = '${user}'`, function(err, recordset) {
                if(err)
                    res.send(err);

                Kosuljica = recordset.recordsets[0][0];
                kosuljicaRequest.query(`select * from Slika where KosuljicaId = ${Kosuljica.KosuljicaId}`, function(err, recordset) {
                    if(err)
                        res.send(err);
                    
                    Slike= recordset.recordsets[0];
                    kosuljicaRequest.query(`select * from Bodovi where KosuljicaId = ${Kosuljica.KosuljicaId} order by Zadatak`, function(err, recordset) {
                        if(err)
                            res.send(err);
                    
                        var Bodovi = recordset.recordsets[0];
                        var ukupno=0;
                        for(var i=0; i< Bodovi.length;i++) {
                            ukupno+= Bodovi[i].Bodovi;
                        }
                        res.json( {kosuljica: Kosuljica, slike: Slike, bodovi: Bodovi, ukupnoBodova: ukupno});
                        sql.close();
                });
            });
        });
      
    });
});

app.get('/prof_dash', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {      
        res.sendFile(__dirname + '/public/prof_dash.html');
    } else {
        res.redirect('/login');
    }
});
/*kraj*/

  

  /* sandrina brljotina */
  app.get('/studenti', (req, res) => {
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var query = 'select * FROM Korisnik WHERE TipId=1';
            request.query(query, function(err, recordset) {
                if (err) {
                      sql.close();
                      res.send(err);
                  }
                var student = (recordset.recordset);
                sql.close();
                res.render('studenti', {students:student});
            }); });
    });

    app.get('/predmeti', (req, res) => {
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var user = Globals.user;
            var query = `select * from PREDMET join ZAVOD on Predmet.ZavodID=ZAVOD.Id where Predmet.KorisnikId = ${user.Id}`;
            request.query(query, function(err, recordset) {
                if (err) {
                      sql.close();
                      res.send(err);
                  }
                var predmet = recordset.
                
                recordset;
                sql.close();
                console.log(predmet);
                res.render('predmeti', {predmeti:predmet, korisnik:user});
            });
        });
    });

    app.get('/department/:department', (req, res) => {
        var department = req.params.department;
        var user = Globals.user;
        if (user.KorisnickoIme !== req.query.user)
        {
            updateUser(req.query.user);
        }
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var query = `select * from PREDMET join Korisnik on Predmet.KorisnikId = Korisnik.Id where Predmet.ZavodID = ${department}`;
            request.query(query, function(err, recordset) {
                if (err) {
                      sql.close();
                      res.send(err);
                  }
                var predmet = recordset.recordset;
                sql.close();
                console.log(predmet);
                res.render('zavod', {predmeti:predmet, korisnik:user, zavod:department});
            });
        });
    });

    app.get('/ispiti', (req, res) => {
        if (req.session.user && req.cookies.user_sid) {
            res.sendFile(__dirname + '/public/ispiti.html');
        } else {
            res.redirect('/login');
        }           
    });

    //PROF POCETAK

    app.get('/predmeti', (req, res) => {
        if (req.session.user && req.cookies.user_sid) {
            res.sendFile(__dirname + '/public/prof_predmeti.html');
        } else {
            res.redirect('/login');
        }           
    });
    app.get('/ispravljanje', (req, res) => {
        if (req.session.user && req.cookies.user_sid) {
            res.sendFile(__dirname + '/public/ispitprof_ispravljanje.html');
        } else {
            res.redirect('/login');
        }           
    });
    app.get('/ispravljeno', (req, res) => {
        if (req.session.user && req.cookies.user_sid) {
            res.sendFile(__dirname + '/public/prof_ispravljeno.html');
        } else {
            res.redirect('/login');
        }           
    });

    app.get('/prof_ispiti', (req, res) => {
        if (req.session.user && req.cookies.user_sid) {
            res.sendFile(__dirname + '/public/prof_ispiti.html');
        } else {
            res.redirect('/login');
        }           
    });
    //PROF KRAJ

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
                    sql.close();
                    res.send(err);
                    return;
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
    var department = req.query.department
    var user = Globals.user;
    if (user.KorisnickoIme !== req.query.user)
    {
        updateUser(req.query.user);
    }
    res.render('noviPredmet', { zavod: department, korisnik: user.Id });
});

app.get('/subject/updateSubject', (req, res) => {
    var department = req.query.department
    var user = Globals.user;
    var predmet = req.query.Id;
    if (user.KorisnickoIme !== req.query.user)
    {
        updateUser(req.query.user);
    }
    res.render('updatePredmet', { predmet: predmet, zavod: department, korisnik: user.Id });
});

app.get('/updateUser', (req, res) => {
    var department = req.query.department
    var user = Globals.user;
    var id = req.query.Id;
    if (user.KorisnickoIme !== req.query.user)
    {
        updateUser(req.query.user);
    }
    res.render('updateStudent', { id: id, zavod: department, korisnik: user.Id });
});

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
        var urlSlika =  "./public/uploaded/" + ispit + "/" + user + req.query.rbr +".png";

        var dir = './public/uploaded/' + ispit;

            if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
            }


      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, urlSlika);
  
      if (path.extname(req.file.originalname).toLowerCase() === "") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);
          global.sql.close();
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

  app.post(
    "/uploaddraw",
    upload.single("file" /* name attribute of <file> element in your form */),
    (req, res) => {

        var user = req.query.user;
        var ispit = req.query.exam;
        var sheet = req.query.sheet;
        var rbr = req.query.rbr;
        var urlSlika =  "./public/uploaded/" + ispit + "/" + user + req.query.rbr +".png";

        var dir = './public/uploaded/' + ispit;

            if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
            }


      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, urlSlika);
  
      if (path.extname(req.file.originalname).toLowerCase() === "") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);
          global.sql.close();
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

            if(global.sheetId === -1){
                return pool.request()
                .query(`INSERT INTO Kosuljica (Qrkod,IspitID,KorisnikId,StatusKosuljice) VALUES ('${sheet}',${ispit},${user},1); INSERT INTO Slika (KosuljicaId,KorisnikId,Url) VALUES (SCOPE_IDENTITY(),${user},'${urlSlika}');`)
            }else{
                return pool.request()
                .query(`INSERT INTO Slika (KosuljicaId,KorisnikId,Url) VALUES (${global.sheetId},${user},'${urlSlika}');`)
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

function updateUser(username) {
    if(username === undefined) {
           return;
    }

    global.sql.connect(global.sqlConfig, function() {
       var request = new sql.Request();
       var query = `select * from Korisnik where KorisnickoIme = ${username}`;
       request.query(query, function(err, recordset) {
           if (err) {
              sql.close();
           }
           var korisnik = recordset.recordset;
           sql.close();
           Globals.user = korisnik;
       });
    });
}

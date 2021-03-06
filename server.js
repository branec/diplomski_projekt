var subjects = require('./api/controllers/userController.js');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');
  const multer = require("multer");
  const fs = require("fs");

var Globals = {
    'user': [],
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
      var user = getUser(req.query.user);
      if(!user) {
          req.session.user = undefined;
          res.redirect('/login');
      } else if(user.TipId === 1) {
          res.redirect(`/dashboard?user=${user.KorisnickoIme}`);
      } else {
          //res.redirect(`/prof_dash?user=${user.KorisnickoIme}`);
      }
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
            global.sql.close();
            global.sql.connect(global.sqlConfig, function() {
              var request = new sql.Request();
              var query = 'select * FROM Korisnik WHERE KorisnickoIme = \'' + username + '\' AND Lozinka =\'' + password + '\'';
        
              request.query(query, function(err, recordset) {
                  if (err) {
                      sql.close();
                      res.send(err);
                  }
        
                  if(recordset.recordset[0]){
                    Globals.user.push(recordset.recordset[0]);
                    req.session.user = username;
                    if(recordset.recordset[0].TipId === 1)
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
          var user = getUser(req.query.user);
          if(user && user.TipId === 1) {
              res.sendFile(__dirname + '/public/dash.html');
          } else {
              req.session.user = undefined;
              res.redirect('/login');
          }
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
          var user = getUser(req.query.user);
          if(user || user.TipId === 2) {
              res.sendFile(__dirname + '/public/prof_dash.html');
          } else {
              req.session.user = undefined;
              res.redirect('/login');
          }
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

app.get('/statistika/', (req, res) => {
    var user = getUser(req.query.user);
    if(user && user.TipId === 2) {
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var query = `SELECT Ispit.Id, Predmet.Naziv as nazivPredmeta, Ispit.Naziv as nazivIspita, SUM(Bodovi.Bodovi)/SUM(Bodovi.max_bodovi) as avgBodovi, COUNT(Distinct Korisnik.Id) as brStudenata
            from Kosuljica JOIN Korisnik ON (Kosuljica.KorisnikId = Korisnik.Id)
            join KorisnikPredmet ON (KorisnikPredmet.KorisnikId = Korisnik.Id)
            JOIN Predmet ON (KorisnikPredmet.PredmetId = predmet.Id)
            JOIN Ispit ON (Ispit.PredmetId = PREDMET.ID)
            JOIN Bodovi ON Bodovi.KosuljicaId = Kosuljica.Id
            where Kosuljica.IspitID = Ispit.ID
            group by Ispit.Id,  Predmet.Naziv, Ispit.Naziv`;
            request.query(query, function(err, recordset) {
                if (err) {
                      sql.close();
                      res.send(err);
                  }
                var predmeti = (recordset.recordset);
                sql.close();
                res.render('statistika', {predmeti:predmeti, korisnik:user});
            });
        });
    }
});

app.get('/statistika/:ispit', (req, res) => {
    var ispit = req.params.ispit;
    var user = getUser(req.query.user);
    if(ispit && user && user.TipId === 2) {
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var query = `select Bodovi.* from Kosuljica join Bodovi on Kosuljica.Id = Bodovi.KosuljicaId order by Bodovi.Zadatak asc`;
            request.query(query, function(err, recordset) {
                if (err) {
                      sql.close();
                      res.send(err);
                  }
                var bodovi = (recordset.recordset);
                sql.close();
                
                var tempStatistika = [];
                var statistika = [];
                tempStatistika.push({ zadatak: 0, bodovi: 0, n: 0});
                for(var i=0 ; i < bodovi.length ; i++ ) {
                    tempStatistika[0].bodovi += bodovi[i].Bodovi;
                    tempStatistika[0].n += 1;

                    var index = tempStatistika.findIndex(x => x.zadatak === bodovi[i].Zadatak)
                    if(index === -1) {
                        tempStatistika.push({ zadatak: bodovi[i].Zadatak, bodovi: bodovi[i].Bodovi, n: 1 });
                    }
                    else {
                        tempStatistika[index].bodovi += bodovi[i].Bodovi;
                        tempStatistika[index].n += 1;
                    }
                }
                for(var i=0 ; i < tempStatistika.length ; i++ ) {
                    var row = {
                        zadatak: tempStatistika[i].zadatak,
                        bodovi: tempStatistika[i].bodovi / tempStatistika[i].n
                    }
                    statistika.push(row);
                }

                res.render('statistikaIspita', {statistika: statistika, korisnik: user});
            });
        });
    }
});

app.get('/prof_dash', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        var user = getUser(req.query.user);
        if(user || user.TipId === 2) {
            res.sendFile(__dirname + '/public/prof_dash.html');
        } else {
            req.session.user = undefined;
            res.redirect('/login');
        }
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

    app.get('/prof_ispravljeni_ispiti', (req, res) => {
        var user = getUser(req.query.user);
        if(!user || user.TipId === 1) {
            req.session.user = undefined;
            res.redirect('/login');
            return;
        }
        sql.close();
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var query = `SELECT Ispit.Id, CONCAT(korisnik.Ime, ' ', Korisnik.Prezime) as korisnik, Predmet.Naziv as nazivPredmeta, Ispit.Naziv as nazivIspita, SUM(Bodovi.Bodovi) as bodovi, SUM(Bodovi.max_bodovi) as max
            from Kosuljica JOIN Korisnik ON (Kosuljica.KorisnikId = Korisnik.Id)
            join KorisnikPredmet ON (KorisnikPredmet.KorisnikId = Korisnik.Id)
            JOIN Predmet ON (KorisnikPredmet.PredmetId = predmet.Id)
            JOIN Ispit ON (Ispit.PredmetId = PREDMET.ID)
            JOIN Bodovi ON Bodovi.KosuljicaId = Kosuljica.Id
            where Predmet.KorisnikId = ${user.Id}
            AND Kosuljica.IspitID = Ispit.ID
            group by Ispit.Id, CONCAT(korisnik.Ime, ' ', Korisnik.Prezime), Predmet.Naziv, Ispit.Naziv`;
            request.query(query, function(err, recordset) {
                if (err) {
                      sql.close();
                      res.send(err);
                }
                var predmet = recordset.recordset;
                sql.close();
                console.log(predmet);

                
                res.render('prof_ispravljeni_ispiti', {predmeti:predmet, korisnik:user});
            });
        });         
    });
    
    app.get('/predmeti', (req, res) => {
        var user = getUser(req.query.user);
        if(!user || user.TipId === 1) {
            req.session.user = undefined;
            res.redirect('/login');
            return;
        }
        sql.close();
        global.sql.connect(global.sqlConfig, function() {
            var request = new sql.Request();
            var query = `select * from PREDMET join ZAVOD on Predmet.ZavodID=ZAVOD.Id where Predmet.KorisnikId = ${user.Id}`;
            request.query(query, function(err, recordset) {
                if (err) {
                      sql.close();
                      res.send(err);
                  }
                var predmet = recordset.recordset;
                sql.close();
                console.log(predmet);
                res.render('predmeti', {predmeti:predmet, korisnik:user});
            });
        });
    });

    app.get('/department/:department', (req, res) => {
        var department = req.params.department;
        var user = getUser(req.query.user);
        if(!user || user.TipId === 1) {
            req.session.user = undefined;
            res.redirect('/login');
            return;
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
            res.sendFile(__dirname + '/public/profispiti.html');
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
    var department = req.query.department;
    var user = getUser(req.query.user);
    if(!user) {
        res.redirect('/login');
    }
    res.render('noviPredmet', { zavod: department, korisnik: user.Id });
});

app.get('/exams/newExam', (req, res) => {
    var predmet = req.query.Id;
    var user = getUser(req.query.user);
    if(!user) {
        res.redirect('/login');
    }
    res.render('noviIspit', { predmet: predmet});
});


app.get('/subject/updateSubject', (req, res) => {
    var department = req.query.department;
    var predmet = req.query.Id;
    var user = getUser(req.query.user);
    if(!user) {
        res.redirect('/login');
    }
    res.render('updatePredmet', { predmet: predmet, zavod: department, korisnik: user.Id });
});

app.get('/exams/updateExam', (req, res) => {
    var predmet = req.query.predmet;
    var ispit = req.query.Id;
    var user = getUser(req.query.user);
    if(!user) {
        res.redirect('/login');
    }
    res.render('updateIspit', { ispit: ispit, predmet: predmet});
});

app.get('/users/newUserPredmet', (req, res) => {
    
    var predmet = req.query.Id;
    var user = getUser(req.query.user);
    if(!user) {
        res.redirect('/login');
    }
    res.render('noviUserPredmet', { predmet: predmet});
});

app.get('/updateUser', (req, res) => {
    var department = req.query.department;
    var id = req.query.Id;
    var user = getUser(req.query.user);
    if(!user) {
        res.redirect('/login');
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


app.get('/bodovi', (req, res) => {
  var sheet = req.query.sheet;
  var bodovi = req.query.bodovi;
  var zadatak = req.query.zadatak;

  global.sql.connect(global.sqlConfig, function() {
    var request = new sql.Request();
    var query = `INSERT INTO Bodovi(Bodovi, KosuljicaId,Zadatak) VALUES (${bodovi}, ${sheet}, ${zadatak});`;
    request.query(query, function(err, recordset) {
        if (err) {
              sql.close();
              res.send(err);
          }
 
        sql.close();
    
    });
});



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

function getUser(username) {
    if(Globals.user.length === 0) {
        return ;
    }
    var user = Globals.user.filter(x => x.KorisnickoIme === username);
    if(user.length !== 0) {
        return user[0];
    }
    return Globals.user[0];
}

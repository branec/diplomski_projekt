'use strict';

exports.get_exams = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from ISPIT WHERE PredmetId = ' + req.params.subject , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}

exports.new_exam = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var name = req.body.Naziv;
        var from = req.body.VrijemeOd;
        var to = req.body.VrijemeDo;
        var duration = req.body.Trajanje;
        var room = req.body.Prostorija;
        var subject = req.body.Predmet;
        var query=`INSERT INTO Ispit (Naziv,VrijemeOd,VrijemeDo,Trajanje,Prostorija,Predmet) VALUES (${name},${from},${to},${duration},${room},${subject})`;
        request.query(query,function(err, recordset) {
            if(err)
            res.send(err);

            if(recordset.recordset[0].postoji === 1){
                res.send(200)
            }else{
                res.json({odgovor:"false"})
            }

            sql.close();
        });
    });
}

exports.update_exam = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var name = req.body.Naziv;
        var from = req.body.VrijemeOd;
        var to = req.body.VrijemeDo;
        var duration = req.body.Trajanje;
        var room = req.body.Prostorija;
        var subject = req.body.Predmet;
        var query=`UPDATE Ispit SET Naziv=\'${name}\', VrijemeOd=\'${from}\', VrijemeDo=\'${to}\', Trajanje=\'${duration}\', Prostorija=\'${room}\', Predmet=\'${subject}\ WHERE Id=\'${id}\'`;
        request.query(query,function(err, recordset) {
            if(err)
            res.send(err);

            if(recordset.recordset[0].postoji === 1){
                res.send(200)
            }else{
                res.json({odgovor:"false"})
            }

            sql.close();
        });
    });
}

exports.delete_exam = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var query=`DELETE FROM Ispit WHERE Id=\'${id}\'`;
        request.query(query,function(err, recordset) {
            if(err)
            res.send(err);

            if(recordset.recordset[0].postoji === 1){
                res.send(200)
            }else{
                res.json({odgovor:"false"})
            }

            sql.close();
        });
    });

  
}

exports.get_exams_per_user = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
    
      var upit = "SELECT ispit.Id,Ispit.Naziv, Predmet.Naziv as Predmet FROM ISPIT " +
      "LEFT OUTER JOIN PREDMET ON PREDMET.ID = ISPIT.PredmetId " +
      "LEFT OUTER JOIN KorisnikPredmet ON KorisnikPredmet.PredmetId = Predmet.ID " +
      "LEFT OUTER JOIN Korisnik ON Korisnik.ID = KorisnikPredmet.KorisnikId " +
      `WHERE Korisnik.KorisnickoIme = '${req.params.username}' and ISPIT.STATUS = 0`

      request.query(upit , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets[0]);
          sql.close();
      });
  });}
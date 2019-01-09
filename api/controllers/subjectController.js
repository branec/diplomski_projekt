'use strict';

exports.get_subjects = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query(` SELECT PREDMET.ID, Predmet.Naziv FROM KorisnikPredmet LEFT OUTER JOIN Predmet ON Predmet.id = KorisnikPredmet.PredmetId left outer join Korisnik on Korisnik.Id = KorisnikPredmet.KorisnikId WHere Korisnik.KorisnickoIme = \'${req.params.user}\'` , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets[0]);
          sql.close();
      });
  });
}

exports.new_subject = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var name = req.body.Naziv;
        var departmentId = req.body.ZavodId;
        var userId = req.body.KorisnikId;
        var query=`INSERT INTO Predmet (Naziv,ZavodId,KorisnikId) VALUES (${name},${departmentId},${userId})`;
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

exports.update_subject = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var name = req.body.Naziv;
        var departmentId = req.body.ZavodId;
        var userId = req.body.KorisnikId;
        var query=`UPDATE Korisnik SET Naziv=\'${name}\', ZavodId=\'${departmentId}\', KorisnikId=\'${userId}\' WHERE Id=\'${id}\'`;
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

exports.delete_subject = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var query=`DELETE FROM Korisnik WHERE Id=\'${id}\'`;
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
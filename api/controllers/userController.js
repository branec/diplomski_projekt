'use strict';

exports.get_all_users = function (req, res) {
      global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();
        request.query('select * from KORISNIK', function(err, recordset, fields) {
            if (err)
            res.send(err); 
            res.json(recordset.recordsets);
            sql.close();
        });
    });
}

exports.login = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      var username = req.body.username; 
      var password = req.body.password;
      var query = 'select COUNT(*) postoji FROM Korisnik WHERE KorisnickoIme = \'' + username + '\' AND Lozinka =\'' + password + '\'';

      request.query(query, function(err, recordset) {
          if (err)
          res.send(err);

          if(recordset.recordset[0].postoji === 1){
            res.json({odgovor:"true"})
          }else{
            res.json({odgovor:"false"})
          }

          sql.close();
      });
  });
}

exports.update_user = function (req, res) {
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
      var query = `UPDATE Korisnik SET KorisnickoIme = \'${username}\', Ime = \'${name}\', JMBAG = \'${jmbag}\', Prezime = \'${surname}\', Datum =\'${date}\', Lozinka = \'${password}\', TipId = \'${type}\'  WHERE Id = '${id}'`;

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
}

exports.new_user = function (req, res) {
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
}


exports.delete_user = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
    
      var username = req.body.KorisnickoIme; 
      var password = req.body.Lozinka;
      var query = 'DELETE FROM Korisnik WHERE Id = ' + req.body.Id;
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
}



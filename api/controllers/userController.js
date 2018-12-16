'use strict';


exports.get_all_users = function (req, res) {
      global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();
        request.query('select * from KORISNIK', function(err, recordset) {
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
      var query = 'UPDATE Korisnik SET KorisnickoIme = \'' + username + '\', Ime = \'' + req.body.Ime + '\', JMBAG = \'' + req.body.JMBAG + '\', Prezime = \'' + req.body.Prezime + '\', Datum =\'' + req.body.Datum + '\', Lozinka = \'' + password + '\', TipId = ' + req.body.TipId + '  WHERE Id = ' +  req.body.Id;

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



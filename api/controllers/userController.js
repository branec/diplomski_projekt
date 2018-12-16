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


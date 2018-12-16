'use strict';

exports.get_subjects = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select PREDMET.ID,PREDMET.NAZIV from KorisnikPredemt LEFT OUTER JOIN PREDMET ON PREDMET.ID = KORISNIKPREDMET.PREDMETID WHERE KORISNIKPREDMET.KORISNIKID = ' + req.params.user , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}
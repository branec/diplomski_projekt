'use strict';


exports.get_all_sheets = function (req, res) {
      global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();
        request.query('select * from KOSULJICA', function(err, recordset) {
            if (err)
            res.send(err);
      
            res.json(recordset.recordsets);
            sql.close();
        });
    });
}

exports.get_sheet_by_user = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from KOSULJICA WHERE KORISNIK = ' + req.params.subject , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}

exports.get_sheet_by_exam = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from KOSULJICA WHERE ID_ISPIT = ' + req.params.subject , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}
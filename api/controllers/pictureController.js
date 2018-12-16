'use strict';

exports.get_pictures = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from SLIKA', function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}

exports.get_picture_by_QR = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from SLIKA WHERE QRKOD_KOSULJICA = \'' + req.params.sheet +'\'' , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}
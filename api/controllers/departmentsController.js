'use strict';

exports.get_departments = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from ZAVOD', function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}

exports.get_department = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from ZAVOD WHERE ID = ' + req.params.ID , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}

exports.get_department_by_boss = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from ZAVOD WHERE OVLASTENA_OSOBA = \'' + req.params.user + '\'', function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}
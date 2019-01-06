'use strict';

exports.get_departments = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from Zavod', function(err, recordset) {
          if (err)
          res.send(err);
          sql.close();
          console.log(recordset.recordsets);
          res.render('departments', {departments:recordset.recordsets})
      });
  });
}

exports.get_department = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from Zavod WHERE Id = ' + req.params.ID , function(err, recordset) {
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
      request.query('select * from ZAVOD WHERE OVLASTENAOSOBA = \'' + req.params.user + '\'', function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}
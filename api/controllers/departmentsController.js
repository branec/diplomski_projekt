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

exports.new_department = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
    var request = new sql.Request();

        var name = req.body.Naziv;
        var user = req.body.Osoba;
        var query=`INSERT INTO Zavod (Naziv, OvlastenaOsoba) VALUES (${name},${user})`;
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

exports.update_department = function (req, res) {
        global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var name = req.body.Naziv;
        var user = req.body.Osoba;
        var query=`UPDATE Zavod SET Zavod=\'${name}\', OvlastenaOsoba=\'${exam}\' WHERE Id=\'${id}\'`;
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

exports.delete_department = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var query=`DELETE FROM Zavod WHERE Id=\'${id}\'`;
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
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
      request.query('select * from KOSULJICA WHERE KorisnikId = ' + req.params.subject , function(err, recordset) {
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
      request.query('select * from KOSULJICA WHERE IspitId = ' + req.params.subject , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}

exports.new_sheet = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var qr = req.body.Qrkod;
        var exam = req.body.IspitId;
        var points = req.body.BrojBodova;
        var user = req.body.KorisnikId;
        var status = req.body.StatusKosuljice;
        var query=`INSERT INTO Kosuljica (Qrkod,IspitID,BrojBodova,KorisnikId,StatusKosuljice) VALUES (${qr},${exam},${points},${user},${status})`;
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

exports.update_sheet = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var qr = req.body.Qrkod;
        var exam = req.body.IspitId;
        var points = req.body.BrojBodova;
        var user = req.body.KorisnikId;
        var status = req.body.StatusKosuljice;
        var query=`UPDATE Kosuljica SET Qrkod=\'${qr}\', IspitID=\'${exam}\', BrojBodova=\'${points}\', KorisnikId=\'${user}\', StatusKosuljice=\'${status}\' WHERE Id=\'${id}\'`;
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

exports.delete_sheet = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var query=`DELETE FROM Kosuljica WHERE Id=\'${id}\'`;
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
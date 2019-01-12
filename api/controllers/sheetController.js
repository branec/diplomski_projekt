'use strict';

/**
 * 
 * @api {get} /sheets Get all sheets.
 * @apiName getSheets
 * @apiGroup Sheets
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess (200) {Number} ID Picture unique ID.
 * @apiSuccess (200) {String} QrKod Foreign Id of sheet.
 * @apiSuccess (200) {Number} IspitId Foreign Id of user.
 * @apiSuccess (200) {Number} BrojBodova Picture data.
 * @apiSuccess (200) {Number} KorisnikId Picture name.
 * @apiSuccess (200) {Number} StatusKosuljice Picture name.
 * 
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "QrKod" : "kod",
 *       "IspitId" : 1,
 *       "BrojBodova" : 2,
 *       "KorisnikId" : "2",
 *       "StatusKosuljice" : "1"
 *     }
 * }
 * 
 * 
 */

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
/**
 * 
 * @api {get} /sheets/:users Get all sheets by user.
 * @apiName getSheetByUser
 * @apiGroup Sheets
 * @apiVersion  1.0.0
 * 
 * @apiParam  {Number} KorisnikId  Foreign Id of user.
 * 
 * @apiSuccess (200) {Number} ID Picture unique ID.
 * @apiSuccess (200) {String} QrKod Foreign Id of sheet.
 * @apiSuccess (200) {Number} IspitId Foreign Id of user.
 * @apiSuccess (200) {Number} BrojBodova Picture data.
 * @apiSuccess (200) {Number} KorisnikId Picture name.
 * @apiSuccess (200) {Number} StatusKosuljice Picture name.
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     KorisnikId : 1
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "QrKod" : "kod",
 *       "IspitId" : 1,
 *       "BrojBodova" : 2,
 *       "KorisnikId" : "2",
 *       "StatusKosuljice" : "1"
 *     }
 * }
 * 
 * 
 */

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

/**
 * 
 * @api {get} /sheets/:exams Get all sheets by exam.
 * @apiName getSheetByExam
 * @apiGroup Sheets
 * @apiVersion  1.0.0
 * 
 * @apiParam  {Number} IspitId  Foreign Id of exam.
 * 
 * @apiSuccess (200) {Number} ID Picture unique ID.
 * @apiSuccess (200) {String} QrKod Foreign Id of sheet.
 * @apiSuccess (200) {Number} IspitId Foreign Id of user.
 * @apiSuccess (200) {Number} BrojBodova Picture data.
 * @apiSuccess (200) {Number} KorisnikId Picture name.
 * @apiSuccess (200) {Number} StatusKosuljice Picture name.
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     IspitId : 1
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "QrKod" : "kod",
 *       "IspitId" : 1,
 *       "BrojBodova" : 2,
 *       "KorisnikId" : "2",
 *       "StatusKosuljice" : "1"
 *     }
 * }
 * 
 * 
 */

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

/**
 * 
 * @api {post} /sheets/newSheet Creates new sheet.
 * @apiName newSheet
 * @apiGroup Sheets
 * @apiVersion  1.0.0
 * 
 * @apiParam  {String} QrKod Foreign Id of sheet.
 * @apiParam  {Number} IspitId Foreign Id of user.
 * @apiParam  {Number} BrojBodova Picture data.
 * @apiParam  {Number} KorisnikId Picture name.
 * @apiParam  {Number} StatusKosuljice Picture name.
 * 
 * 
 * @apiSuccess (201) {Number} ID Picture unique ID.
 * @apiSuccess (201) {String} QrKod Foreign Id of sheet.
 * @apiSuccess (201) {Number} IspitId Foreign Id of user.
 * @apiSuccess (201) {Number} BrojBodova Picture data.
 * @apiSuccess (201) {Number} KorisnikId Picture name.
 * @apiSuccess (201) {Number} StatusKosuljice Picture name.
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     "QrKod" : "kod",
 *     IspitId : 1,
 *     BrojBodova : 2,
 *     KorisnikId : 2,
 *     StatusKosuljice : 1
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 201 Created
 * }
 * 
 * 
 */

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

/**
 * 
 * @api {post} /sheets/updateSheet Updates existing sheet.
 * @apiName updateSheet
 * @apiGroup Sheets
 * @apiVersion  1.0.0
 * 
 * @apiParam  {String} QrKod Foreign Id of sheet.
 * @apiParam  {Number} IspitId Foreign Id of user.
 * @apiParam  {Number} BrojBodova Picture data.
 * @apiParam  {Number} KorisnikId Picture name.
 * @apiParam  {Number} StatusKosuljice Picture name.
 * 
 * 
 * @apiSuccess (200) {Number} ID Picture unique ID.
 * @apiSuccess (200) {String} QrKod Foreign Id of sheet.
 * @apiSuccess (200) {Number} IspitId Foreign Id of user.
 * @apiSuccess (200) {Number} BrojBodova Picture data.
 * @apiSuccess (200) {Number} KorisnikId Picture name.
 * @apiSuccess (200) {Number} StatusKosuljice Picture name.
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     "QrKod" : "kod",
 *     IspitId : 1,
 *     BrojBodova : 2,
 *     KorisnikId : 2,
 *     StatusKosuljice : 1
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "QrKod" : "kod",
 *       "IspitId" : 1,
 *       "BrojBodova" : 2,
 *       "KorisnikId" : "2",
 *       "StatusKosuljice" : "1"
 *     }
 * }
 * 
 * 
 */

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

/**
 * 
 * @api {post} /sheets/deleteSheet Deletes existing sheet.
 * @apiName deleteSheet
 * @apiGroup Sheets
 * @apiVersion  1.0.0
 * 
 * @apiParam  {Number} Id Picture unique ID.
 * 
 * 
 * @apiSuccess (200) {Number} ID Picture unique ID.
 * @apiSuccess (200) {String} QrKod Foreign Id of sheet.
 * @apiSuccess (200) {Number} IspitId Foreign Id of user.
 * @apiSuccess (200) {Number} BrojBodova Picture data.
 * @apiSuccess (200) {Number} KorisnikId Picture name.
 * @apiSuccess (200) {Number} StatusKosuljice Picture name.
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     Id : 1
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 * }
 * 
 * 
 */

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
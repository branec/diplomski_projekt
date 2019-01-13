'use strict';

/**
 * 
 * @api {get} /pictures Get all pictures.
 * @apiName getPictures
 * @apiGroup Pictuers
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess (200) {Number} ID Picture unique ID.
 * @apiSuccess (200) {Number} KosuljicaId Foreign Id of sheet.
 * @apiSuccess (200) {Number} KorisnikId Foreign Id of User.
 * @apiSuccess (200) {String} Podaci Picture data.
 * @apiSuccess (200) {String} Slika Picture name.
 * 
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "KosuljicaId" : 1,
 *       "KorisnikId" : 2,
 *       "Podaci" : "Ispit",
 *       "Slika" : "Slika1"
 *     }
 * }
 * 
 * 
 */

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

/**
 * 
 * @api {get} /pictures/:sheet Get pictures by sheet ID.
 * @apiName getPictureByQr
 * @apiGroup Pictures
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} KosuljicaId Pictures unique ID.
 * 
 * @apiSuccess (200) {Number} ID Picture unique ID.
 * @apiSuccess (200) {Number} KosuljicaId Foreign Id of sheet.
 * @apiSuccess (200) {Number} KorisnikId Foreign Id of User.
 * @apiSuccess (200) {String} Podaci Picture data.
 * @apiSuccess (200) {String} Slika Picture name.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     KosuljicaId : 1
 * }
 * 
 * 
  * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "KosuljicaId" : 1,
 *       "KorisnikId" : 2,
 *       "Podaci" : "Ispit",
 *       "Slika" : "Slika1"
 *     }
 * }
 * 
 * 
 */

exports.get_picture_by_QR = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from SLIKA WHERE KosuljicaId = \'' + req.params.sheet +'\'' , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}

/**
 * 
 * @api {post} picture/newPicture Creates new picture.
 * @apiName newPicture
 * @apiGroup Pictures
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} KosuljicaId Foreign Id of sheet.
 * @apiParam  {Number} KorisnikId Foreign Id of User.
 * @apiParam  {String} Podaci Picture data.
 * @apiParam  {String} Slika Picture name.
 * 
 * @apiSuccess (201) {Number} ID Picture unique ID.
 * @apiSuccess (201) {Number} KosuljicaId Foreign Id of sheet.
 * @apiSuccess (201) {Number} KorisnikId Foreign Id of User.
 * @apiSuccess (201) {String} Podaci Picture data.
 * @apiSuccess (201) {String} Slika Picture name.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       KosuljicaId : 1,
 *       KorisnikId : 2,
 *       "Podaci" : "Ispit",
 *       "Slika" : "Slika1"
 * }
 * 
 * 
  * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 201 Created
 * }
 * 
 * 
 */

exports.new_picture = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var sheet = req.body.KosuljicaId;
        var user = req.body.KorisnikId;
        var data = req.body.Podaci
        var pic = req.body.Slika;
        var query=`INSERT INTO Slika (KosuljicaId,KorisnikId,Podaci,Slika) VALUES (${sheet},${user},${data},${pic})`;
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
 * @api {post} picture/updatePicture Updates existing picture.
 * @apiName updatePicture
 * @apiGroup Pictures
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} KosuljicaId Foreign Id of sheet.
 * @apiParam  {Number} KorisnikId Foreign Id of User.
 * @apiParam  {String} Podaci Picture data.
 * @apiParam  {String} Slika Picture name.
 * 
 * @apiSuccess (200) {Number} ID Picture unique ID.
 * @apiSuccess (200) {Number} KosuljicaId Foreign Id of sheet.
 * @apiSuccess (200) {Number} KorisnikId Foreign Id of User.
 * @apiSuccess (200) {String} Podaci Picture data.
 * @apiSuccess (200) {String} Slika Picture name.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       KosuljicaId : 1,
 *       KorisnikId : 2,
 *       "Podaci" : "Ispit",
 *       "Slika" : "Slika1"
 * }
 * 
 * 
  * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "KosuljicaId" : 1,
 *       "KorisnikId" : 2,
 *       "Podaci" : "Ispit",
 *       "Slika" : "Slika1"
 *     }
 * }
 * 
 * 
 */

exports.update_picture = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var sheet = req.body.KosuljicaId;
        var user = req.body.KorisnikId;
        var data = req.body.Podaci
        var pic = req.body.Slika;
        var query=`UPDATE Slika SET KosuljicaId=\'${sheet}\', KorisnikId=\'${user}\', Podaci=\'${data}\', Slika=\'${pic}\' WHERE Id=\'${id}\'`;
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
 * @api {post} picture/deletePicture Deletes existing picture.
 * @apiName deletePicture
 * @apiGroup Pictures
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} Id Picture unique ID.
 * 
 * @apiSuccess (200) {Number} ID Picture unique ID.
 * @apiSuccess (200) {Number} KosuljicaId Foreign Id of sheet.
 * @apiSuccess (200) {Number} KorisnikId Foreign Id of User.
 * @apiSuccess (200) {String} Podaci Picture data.
 * @apiSuccess (200) {String} Slika Picture name.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       Id : 1
 * }
 * 
 * 
  * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 * }
 * 
 * 
 */

exports.delete_picture = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var query=`DELETE FROM Slika WHERE Id=\'${id}\'`;
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
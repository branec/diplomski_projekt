'use strict';

/**
 * 
 * @api {get} /subjects/:user Get all subjects by user.
 * @apiName getSubjects
 * @apiGroup Subjects
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess (200) {Number} ID Subject unique ID.
 * @apiSuccess (200) {String} Naziv Subject name.
 * @apiSuccess (200) {Number} ZavodId Foreign Id of department.
 * @apiSuccess (200) {Number} KorisnikId Foreign Id of user.
 * 
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "Naziv" : "Math",
 *       "ZavodId" : 1,
 *       "KorisnikId" : 2
 *     }
 * }
 * 
 * 
 */

exports.get_subjects = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select PREDMET.ID,PREDMET.NAZIV from KorisnikPredmet LEFT OUTER JOIN PREDMET ON PREDMET.ID = KORISNIKPREDMET.PREDMETID LEFT OUTER JOIN KORISNIK ON KORISNIK.ID = KORISNIKPREDMET.KORIsNIKID WHERE KORISNIK.KORISNICKOIME = \'' + req.params.user +'\'' , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets[0]);
          sql.close();
      });
  });
}

/**
 * 
 * @api {post} /subjects/newSubject Creates new subject.
 * @apiName newSubject
 * @apiGroup Subjects
 * @apiVersion  1.0.0
 * 
 * @apiParam  {String} Naziv Subject name.
 * @apiParam  {Number} ZavodId Foreign Id of department.
 * @apiParam  {Number} KorisnikId foreign id of user.
 * 
 * 
 * @apiSuccess (201) {Number} ID Subject unique ID.
 * @apiSuccess (201) {String} Naziv Subject name.
 * @apiSuccess (201) {Number} ZavodId Foreign Id of department.
 * @apiSuccess (201) {Number} KorisnikId Foreign Id of user.
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       "Naziv" : "Math",
 *       "ZavodId" : 1,
 *       "KorisnikId" : 2
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 201 Created
 * }
 * 
 * 
 */

exports.new_subject = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var name = req.body.Naziv;
        var departmentId = req.body.ZavodId;
        var userId = req.body.KorisnikId;
        var query=`INSERT INTO Predmet (Naziv,ZavodId,KorisnikId) VALUES (${name},${departmentId},${userId})`;
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
 * @api {put} /subject/updateSubject Updates existing subject.
 * @apiName updateSubject
 * @apiGroup Subjects
 * @apiVersion  1.0.0
 * 
 * @apiParam  {String} Naziv Subject name.
 * @apiParam  {Number} ZavodId Foreign Id of department.
 * @apiParam  {Number} KorisnikId foreign id of user.
 * 
 * 
 * @apiSuccess (200) {Number} ID Subject unique ID.
 * @apiSuccess (200) {String} Naziv Subject name.
 * @apiSuccess (200) {Number} ZavodId Foreign Id of department.
 * @apiSuccess (200) {Number} KorisnikId Foreign Id of user.
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       "Naziv" : "Math",
 *       "ZavodId" : 1,
 *       "KorisnikId" : 2
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *      {
 *          "Id" : 1,
 *          "Naziv" : "Math",
 *          "ZavodId" : 1,
 *          "KorisnikId" : 2
 *      }
 * }
 * 
 * 
 */

exports.update_subject = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var name = req.body.Naziv;
        var departmentId = req.body.ZavodId;
        var userId = req.body.KorisnikId;
        var query=`UPDATE Korisnik SET Naziv=\'${name}\', ZavodId=\'${departmentId}\', KorisnikId=\'${userId}\' WHERE Id=\'${id}\'`;
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
 * @api {delete} /subject/deleteSubject Deletes existing subject.
 * @apiName deleteSubject
 * @apiGroup Subject
 * @apiVersion  1.0.0
 * 
 * @apiParam  {Number} Id Subject unique ID.
 * 
 * 
 * @apiSuccess (200) {Number} ID Subject unique ID.
 * @apiSuccess (200) {String} Naziv Subject name.
 * @apiSuccess (200) {Number} ZavodId Foreign Id of department.
 * @apiSuccess (200) {Number} KorisnikId Foreign Id of user.
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

exports.delete_subject = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var query=`DELETE FROM Korisnik WHERE Id=\'${id}\'`;
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
'use strict';

/**
 * 
 * @api {get} /types Get all types.
 * @apiName getTypes
 * @apiGroup Types
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess (200) {Number} ID Type unique ID.
 * @apiSuccess (200) {String} Ime Type name.
 * @apiSuccess (200) {String} Opis Type details.
 * 
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "Ime" : "John",
 *       "Opis" : "Doe"
 *     }
 * }
 * 
 * 
 */

exports.get_types = function (req, res) {
      global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();
        request.query('select * from Tip', function(err, recordset) {
            if (err)
            res.send(err);
      
            res.json(recordset.recordsets);
            sql.close();
        });
    });
}

/**
 * 
 * @api {post} /types/newType Creates new type.
 * @apiName newType
 * @apiGroup Types
 * @apiVersion  1.0.0
 * 
 * @apiParam  {String} Ime Type name.
 * @apiParam  {String} Opis Type description.
 * 
 * 
 * @apiSuccess (201) {Number} ID Type unique ID.
 * @apiSuccess (201) {String} Ime Type name.
 * @apiSuccess (201) {String} Opis Type details.
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       "Ime" : "John",
 *       "opis" : "Doe"
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 201 Created
 * }
 * 
 * 
 */

exports.new_type = function (req, res) {
        global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var name = req.body.Ime;
        var about = req.body.Opis;
        var query=`INSERT INTO Tip (Ime,Opis) VALUES (${name},${about})`;
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
 * @api {put} /types/updateType Updates existing type.
 * @apiName updateType
 * @apiGroup Types
 * @apiVersion  1.0.0
 * 
 * @apiParam  {String} Ime Type name.
 * @apiParam  {String} Opis Type description.
 * 
 * 
 * @apiSuccess (200) {Number} ID Type unique ID.
 * @apiSuccess (200) {String} Ime Type name.
 * @apiSuccess (200) {String} Opis Type details.
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       "Ime" : "John",
 *       "opis" : "Doe"
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "Ime" : "John",
 *       "Opis" : "Doe"
 *     }
 * }
 * 
 * 
 */

exports.update_type = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var name = req.body.Ime;
        var user = req.body.Opis;
        var query=`UPDATE Tip SET Ime=\'${name}\', Opis=\'${exam}\' WHERE Id=\'${id}\'`;
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
 * @api {delete} /types/deleteType Deletes existing type.
 * @apiName deleteType
 * @apiGroup Types
 * @apiVersion  1.0.0
 * 
 * @apiParam  {Number} Id Type unique ID.
 * 
 * 
 * @apiSuccess (200) {Number} ID Type unique ID.
 * @apiSuccess (200) {String} Ime Type name.
 * @apiSuccess (200) {String} Opis Type details.
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

exports.delete_type = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var query=`DELETE FROM Tip WHERE Id=\'${id}\'`;
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
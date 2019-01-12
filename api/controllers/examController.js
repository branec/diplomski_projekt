'use strict';

/**
 * 
 * @api {get} /exams Get all exams.
 * @apiName getExams
 * @apiGroup Exams
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess (200) {Number} ID Exam unique ID.
 * @apiSuccess (200) {String} Naziv Exam name.
 * @apiSuccess (200) {Date} VrijemeOd Exam starting time.
 * @apiSuccess (200) {Date} VrijemeDo Exam ending time.
 * @apiSuccess (200) {Number} Trajanje Exam duration.
 * @apiSuccess (200) {String} Prostorija Exam place.
 * @apiSuccess (200) {Number} PredmetId Subject of exam.
 * @apiSuccess (200) {Number} Status Current state of exam.
 * 
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id": "1",
 *       "Naziv": "Math",
 *       "VrijemeOd": "28.10.2018. 10:00",
 *       "VrijemeDo": "28.10.2018. 12:00",
 *       "Trajanje": 2,
 *       "Prostorija": "D1",
 *       "PredmetId" : 1,
 *       "Status" : 0
 *     }
 * }
 * 
 * 
 */

exports.get_exams = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      request.query('select * from ISPIT' , function(err, recordset) {
          if (err)
          res.send(err);
    
          res.json(recordset.recordsets);
          sql.close();
      });
  });
}

/**
 * 
 * @api {get} /exams/:subject Get exams by subject ID.
 * @apiName getExamsBySubject
 * @apiGroup Exams
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} PredmetId Exams unique ID.
 * 
 * @apiSuccess (200) {Number} ID Exam unique ID.
 * @apiSuccess (200) {String} Naziv Exam name.
 * @apiSuccess (200) {Date} VrijemeOd Exam starting time.
 * @apiSuccess (200) {Date} VrijemeDo Exam ending time.
 * @apiSuccess (200) {Number} Trajanje Exam duration.
 * @apiSuccess (200) {String} Prostorija Exam place.
 * @apiSuccess (200) {Number} PredmetId Subject of exam.
 * @apiSuccess (200) {Number} Status Current state of exam.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     PredmetId : 1
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id": "1",
 *       "Naziv": "Math",
 *       "VrijemeOd": "28.10.2018. 10:00",
 *       "VrijemeDo": "28.10.2018. 12:00",
 *       "Trajanje": 2,
 *       "Prostorija": "D1",
 *       "PredmetId" : 1,
 *       "Status" : 0
 *     }
 * }
 * 
 * 
 */

exports.get_exams_for_subject = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();
        request.query(`SELECT * FROM Ispit WHERE Ispit.PredmetId = ${req.params.subjects}`, function(err, recordset) {
            if (err)
          res.send(err);

          res.json(recordset.recordsets);
          sql.close();
        });
    });
}

/**
 * 
 * @api {post} /exams/newExam Create new exam.
 * @apiName newExam
 * @apiGroup Exams
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} PredmetId Exams unique ID.
 * @apiParam  {String} Naziv Exam name.
 * @apiParam  {Date} VrijemeOd Exam starting time.
 * @apiParam  {Date} VrijemeDo Exam ending time.
 * @apiParam  {Number} Trajanje Exam duration.
 * @apiParam  {String} Prostorija Exam place.
 * @apiParam  {Number} PredmetId Subject of exam.
 * @apiParam  {Number} Status Current state of exam.
 * 
 * @apiSuccess (201) {Number} ID Exam unique ID.
 * @apiSuccess (201) {String} Naziv Exam name.
 * @apiSuccess (201) {Date} VrijemeOd Exam starting time.
 * @apiSuccess (201) {Date} VrijemeDo Exam ending time.
 * @apiSuccess (201) {Number} Trajanje Exam duration.
 * @apiSuccess (201) {String} Prostorija Exam place.
 * @apiSuccess (201) {Number} PredmetId Subject of exam.
 * @apiSuccess (201) {Number} Status Current state of exam.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       "Id": "1",
 *       "Naziv": "Math",
 *       "VrijemeOd": "28.10.2018. 10:00",
 *       "VrijemeDo": "28.10.2018. 12:00",
 *       "Trajanje": 2,
 *       "Prostorija": "D1",
 *       "PredmetId" : 1,
 *       "Status" : 0
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

exports.new_exam = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var name = req.body.Naziv;
        var from = req.body.VrijemeOd;
        var to = req.body.VrijemeDo;
        var duration = req.body.Trajanje;
        var room = req.body.Prostorija;
        var subject = req.body.Predmet;
        var query=`INSERT INTO Ispit (Naziv,VrijemeOd,VrijemeDo,Trajanje,Prostorija,Predmet) VALUES (${name},${from},${to},${duration},${room},${subject})`;
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
 * @api {put} /exams/updateExam Updates existing exam.
 * @apiName updateExam
 * @apiGroup Exams
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} PredmetId Exams unique ID.
 * @apiParam  {String} Naziv Exam name.
 * @apiParam  {Date} VrijemeOd Exam starting time.
 * @apiParam  {Date} VrijemeDo Exam ending time.
 * @apiParam  {Number} Trajanje Exam duration.
 * @apiParam  {String} Prostorija Exam place.
 * @apiParam  {Number} PredmetId Subject of exam.
 * @apiParam  {Number} Status Current state of exam.
 * 
 * @apiSuccess (200) {Number} ID Exam unique ID.
 * @apiSuccess (200) {String} Naziv Exam name.
 * @apiSuccess (200) {Date} VrijemeOd Exam starting time.
 * @apiSuccess (200) {Date} VrijemeDo Exam ending time.
 * @apiSuccess (200) {Number} Trajanje Exam duration.
 * @apiSuccess (200) {String} Prostorija Exam place.
 * @apiSuccess (200) {Number} PredmetId Subject of exam.
 * @apiSuccess (200) {Number} Status Current state of exam.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       "Id": "1",
 *       "Naziv": "Math",
 *       "VrijemeOd": "28.10.2018. 10:00",
 *       "VrijemeDo": "28.10.2018. 12:00",
 *       "Trajanje": 2,
 *       "Prostorija": "D1",
 *       "PredmetId" : 1,
 *       "Status" : 0
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id": "1",
 *       "Naziv": "Math",
 *       "VrijemeOd": "28.10.2018. 10:00",
 *       "VrijemeDo": "28.10.2018. 12:00",
 *       "Trajanje": 2,
 *       "Prostorija": "D1",
 *       "PredmetId" : 1,
 *       "Status" : 0
 *     }
 * }
 * 
 * 
 */

exports.update_exam = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var name = req.body.Naziv;
        var from = req.body.VrijemeOd;
        var to = req.body.VrijemeDo;
        var duration = req.body.Trajanje;
        var room = req.body.Prostorija;
        var subject = req.body.Predmet;
        var query=`UPDATE Ispit SET Naziv=\'${name}\', VrijemeOd=\'${from}\', VrijemeDo=\'${to}\', Trajanje=\'${duration}\', Prostorija=\'${room}\', Predmet=\'${subject}\ WHERE Id=\'${id}\'`;
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
 * @api {delete} /exams/deleteExam Deletes existing exam.
 * @apiName deleteExam
 * @apiGroup Exams
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} PredmetId Exams unique ID.
 * 
 * @apiSuccess (200) {Number} ID Exam unique ID.
 * @apiSuccess (200) {String} Naziv Exam name.
 * @apiSuccess (200) {Date} VrijemeOd Exam starting time.
 * @apiSuccess (200) {Date} VrijemeDo Exam ending time.
 * @apiSuccess (200) {Number} Trajanje Exam duration.
 * @apiSuccess (200) {String} Prostorija Exam place.
 * @apiSuccess (200) {Number} PredmetId Subject of exam.
 * @apiSuccess (200) {Number} Status Current state of exam.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       Id: 1
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

exports.delete_exam = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();

        var id = req.body.Id;
        var query=`DELETE FROM Ispit WHERE Id=\'${id}\'`;
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
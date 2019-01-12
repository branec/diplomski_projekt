'use strict';

/**
 * 
 * @api {get} /departments Get all departments
 * @apiName getDepartments
 * @apiGroup Departments
 * @apiVersion  1.0.0
 * 
 * @apiSuccess (200) {Number} ID Department unique ID.
 * @apiSuccess (200) {String} Naziv Department name.
 * @apiSuccess (200) {String} OvlastenaOsoba Department boss.
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "ID": "1",
 *       "Naziv": "Doe",
 *       "OvlastenaOsoba": "John"
 *     }
 * }
 * 
 */

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

/**
 * 
 * @api {get} /department/:ID Get department by ID
 * @apiName getDepartment
 * @apiGroup Departments
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} ID Departments unique ID.
 * 
 * @apiSuccess (200) {Number} ID Department unique ID.
 * @apiSuccess (200) {String} Naziv Department name.
 * @apiSuccess (200) {String} OvlastenaOsoba Department boss.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     ID : 1
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "ID": "1",
 *       "Naziv": "Doe",
 *       "OvlastenaOsoba": "John"
 *     }
 * }
 * 
 * 
 */

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

/**
 * 
 * @api {get} /departmentsbyuser/:user Get all departments by Ovlastena_osoba
 * @apiName getDepartmentsByBoss
 * @apiGroup Departments
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} Ovlastena_osoba Departments boss name.
 * 
 * @apiSuccess (200) {Number} ID Department unique ID.
 * @apiSuccess (200) {String} Naziv Department name.
 * @apiSuccess (200) {String} OvlastenaOsoba Department boss.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     OvlastenaOsoba : "John"
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "ID": "1",
 *       "Naziv": "Doe",
 *       "OvlastenaOsoba": "John"
 *     }
 * }
 * 
 * 
 */

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

/**
 * 
 * @api {post} /departments/newDepartment Create new department
 * @apiName newDepartment
 * @apiGroup Departments
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} Naziv Departments name.
 * @apiParam  {String} Ovlastena_osoba Departments boss name.
 * 
 * @apiSuccess (200) {Number} ID Department unique ID.
 * @apiSuccess (200) {String} Naziv Department name.
 * @apiSuccess (200) {String} OvlastenaOsoba Department boss.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     Naziv : "Doe",
 *     OvlastenaOsoba : "John"
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

/**
 * 
 * @api {post} departments/updateDepartment Update existing department
 * @apiName updateDepartment
 * @apiGroup Departments
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} Naziv Departments name.
 * @apiParam  {String} Ovlastena_osoba Departments boss name.
 * 
 * @apiSuccess (201) {Number} ID Department unique ID.
 * @apiSuccess (201) {String} Naziv Department name.
 * @apiSuccess (201) {String} OvlastenaOsoba Department boss.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     Naziv : "Doe",
 *     OvlastenaOsoba : "John"
 * }
 * 
 * 
 * @apiSuccessExample  Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *
 * }
 * 
 * 
 */

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

/**
 * 
 * @api {post} /departments/deleteDepartment Deletes existing department
 * @apiName deleteDepartment
 * @apiGroup Departments
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} ID Departments unique ID.
 * 
 * @apiSuccess (200) {Number} ID Department unique ID.
 * @apiSuccess (200) {String} Naziv Department name.
 * @apiSuccess (200) {String} OvlastenaOsoba Department boss.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     ID : 1
 * }
 * 
 * 
 * @apiSuccessExample  Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *
 * }
 * 
 * 
 */

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
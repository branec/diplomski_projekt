'use strict';

/**
 * 
 * @api {get} /users Get all users.
 * @apiName getUsers
 * @apiGroup Users
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess (200) {Number} ID User unique ID.
 * @apiSuccess (200) {String} KorisnickoIme User nickname.
 * @apiSuccess (200) {String} Ime User name.
 * @apiSuccess (200) {String} JMBAG User unique number.
 * @apiSuccess (200) {String} Prezime User surname.
 * @apiSuccess (200) {Date} Datum User birth date.
 * @apiSuccess (200) {String} Lozinka User password.
 * @apiSuccess (200) {Number} TipId User type.
 * 
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "KorisnickoIme" : "John",
 *       "JMBAG" : "00112",
 *       "Prezime" : "Doe",
 *       "Datum" : "29.1.2019 12:00",
 *       "Lozinka" : "Pass",
 *       "TipId" : 1
 *     }
 * }
 * 
 * 
 */

exports.get_all_users = function (req, res) {
      global.sql.connect(global.sqlConfig, function() {
        var request = new sql.Request();
        request.query('select * from KORISNIK', function(err, recordset, fields) {
            if (err)
            res.send(err); 
            res.json(recordset.recordsets);
            sql.close();
        });
    });
}

/**
 * 
 * @api {post} /login Get all users.
 * @apiName getUsers
 * @apiGroup Users
 * @apiVersion  1.0.0
 * 
 * @apiParam  {String} KorisnickoIme User nickname.
 * @apiParam  {String} Lozinka User password.
 * 
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       "KorisnickoIme" : "John",
 *       "Lozinka" : "pass"
 * }
 * 
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "postoji" : 1
 *     }
 * }
 * 
 * 
 */

exports.login = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
      var username = req.body.username; 
      var password = req.body.password;
      var query = 'select COUNT(*) postoji FROM Korisnik WHERE KorisnickoIme = \'' + username + '\' AND Lozinka =\'' + password + '\'';

      request.query(query, function(err, recordset) {
          if (err)
          res.send(err);

          if(recordset.recordset[0].postoji === 1){
            res.json({odgovor:"true"})
          }else{
            res.json({odgovor:"false"})
          }

          sql.close();
      });
  });
}

/**
 * 
 * @api {post} /user/updateUser Updates existing user.
 * @apiName updateUser
 * @apiGroup Users
 * @apiVersion  1.0.0
 * 
 * @apiParam  {Number} ID User unique ID.
 * @apiParam  {String} KorisnickoIme User nickname.
 * @apiParam  {String} Ime User name.
 * @apiParam  {String} JMBAG User unique number.
 * @apiParam  {String} Prezime User surname.
 * @apiParam  {Date} Datum User birth date.
 * @apiParam  {String} Lozinka User password.
 * @apiParam  {Number} TipId User type.
 * 
 * 
 * @apiSuccess (200) {Number} ID User unique ID.
 * @apiSuccess (200) {String} KorisnickoIme User nickname.
 * @apiSuccess (200) {String} Ime User name.
 * @apiSuccess (200) {String} JMBAG User unique number.
 * @apiSuccess (200) {String} Prezime User surname.
 * @apiSuccess (200) {Date} Datum User birth date.
 * @apiSuccess (200) {String} Lozinka User password.
 * @apiSuccess (200) {Number} TipId User type.
 * 
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       "Id" : 1,
 *       "KorisnickoIme" : "John",
 *       "JMBAG" : "00112",
 *       "Prezime" : "Doe",
 *       "Datum" : "29.1.2019 12:00",
 *       "Lozinka" : "Pass",
 *       "TipId" : 1
 * }
 * 
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 200 OK
 *     {
 *       "Id" : 1,
 *       "KorisnickoIme" : "John",
 *       "JMBAG" : "00112",
 *       "Prezime" : "Doe",
 *       "Datum" : "29.1.2019 12:00",
 *       "Lozinka" : "Pass",
 *       "TipId" : 1
 *     }
 * }
 * 
 * 
 */

exports.update_user = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();
    
      var username = req.body.KorisnickoIme; 
      var password = req.body.Lozinka;
      var name = req.body.Ime;
      var jmbag = req.body.JMBAG;
      var surname = req.body.Prezime;
      var date = req.body.Datum;
      var type = req.body.TipId;
      var id = req.body.Id;
      var query = `UPDATE Korisnik SET KorisnickoIme = \'${username}\', Ime = \'${name}\', JMBAG = \'${jmbag}\', Prezime = \'${surname}\', Datum =\'${date}\', Lozinka = \'${password}\', TipId = \'${type}\'  WHERE Id = '${id}'`;

      request.query(query, function(err, recordset) {
          if (err)
          res.send(err);

          if(recordset.rowsAffected.length === 1){
            res.json({odgovor:"true"})
          }else{
            res.json({odgovor:"false"})
          }

          sql.close();
      });
  });
}

/**
 * 
 * @api {post} /newUser Creates new user.
 * @apiName newUser
 * @apiGroup Users
 * @apiVersion  1.0.0
 * 
 * @apiParam  {Number} ID User unique ID.
 * @apiParam  {String} KorisnickoIme User nickname.
 * @apiParam  {String} Ime User name.
 * @apiParam  {String} JMBAG User unique number.
 * @apiParam  {String} Prezime User surname.
 * @apiParam  {Date} Datum User birth date.
 * @apiParam  {String} Lozinka User password.
 * @apiParam  {Number} TipId User type.
 * 
 * 
 * @apiSuccess (201) {Number} ID User unique ID.
 * @apiSuccess (201) {String} KorisnickoIme User nickname.
 * @apiSuccess (201) {String} Ime User name.
 * @apiSuccess (201) {String} JMBAG User unique number.
 * @apiSuccess (201) {String} Prezime User surname.
 * @apiSuccess (201) {Date} Datum User birth date.
 * @apiSuccess (201) {String} Lozinka User password.
 * @apiSuccess (201) {Number} TipId User type.
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *       "KorisnickoIme" : "John",
 *       "JMBAG" : "00112",
 *       "Prezime" : "Doe",
 *       "Datum" : "29.1.2019 12:00",
 *       "Lozinka" : "Pass",
 *       "TipId" : 1
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     HTTP/1.1 201 Created
 * }
 * 
 * 
 */

exports.new_user = function (req, res) {
  console.log("szovem 222")
  global.sql.connect(global.sqlConfig, function() {
    var request = new sql.Request();

    var username = req.body.KorisnickoIme; 
    var password = req.body.Lozinka;
    var name = req.body.Ime;
    var jmbag = req.body.JMBAG;
    var surname = req.body.Prezime;
    var date = req.body.Datum;
    var type = req.body.TipId;
    var id = req.body.Id;
    var query = `INSERT INTO (KorisnickoIme,Ime,JMBAG,Prezime,Datum,Lozinka,TipId) Korisnik Values (${username},${name},${jmbag},${surname},${date},${password},${type})` ;
    console.log("szovem 1")
    request.query(query, function(err, recordset) {
          if (err) {
            res.send(err);
            return
          }

          if(recordset.rowsAffected.length === 1){
            res.json({odgovor:"true"})
          }else{
            res.json({odgovor:"false"})
          }

          sql.close();
      });
  });
}

/**
 * 
 * @api {delete} /delUser Deletes existing user.
 * @apiName deleteUser
 * @apiGroup Users
 * @apiVersion  1.0.0
 * 
 * @apiParam  {Number} ID User unique ID.
 * 
 * 
 * @apiSuccess (201) {Number} ID User unique ID.
 * @apiSuccess (201) {String} KorisnickoIme User nickname.
 * @apiSuccess (201) {String} Ime User name.
 * @apiSuccess (201) {String} JMBAG User unique number.
 * @apiSuccess (201) {String} Prezime User surname.
 * @apiSuccess (201) {Date} Datum User birth date.
 * @apiSuccess (201) {String} Lozinka User password.
 * @apiSuccess (201) {Number} TipId User type.
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

exports.delete_user = function (req, res) {
    global.sql.connect(global.sqlConfig, function() {
      var request = new sql.Request();

      var query = 'DELETE FROM Korisnik WHERE Id = ' + req.body.id;
      request.query(query, function(err, recordset) {
          if (err) {
            res.send(err);
            return
          }

          if(recordset.rowsAffected.length === 1){
            res.redirect("/studenti")
          }else{
            res.json({odgovor:"false"})
          }

          sql.close();
      });
  });
}



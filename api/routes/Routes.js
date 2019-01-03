'use strict';

module.exports = function(app) {
  var users = require('../controllers/userController');
  var subjects = require('../controllers/subjectController');
  var exams = require('../controllers/examController');
  var departments = require('../controllers/departmentsController');
  var types = require('../controllers/typeController');
  var pictures = require('../controllers/pictureController');
  var sheets = require('../controllers/sheetController');

  app.route('/users')
    .get(users.get_all_users)
    .post(users.update_user);

    app.route('/delUser')
    .post(users.delete_user);

    app.route('/login')
    .post(users.login);

    app.route('/newUser')
    .post(users.new_user);

    app.route('/subjects/:user')
    .get(subjects.get_subjects);

    app.route('/subjects/newSubject')
    .post(subjects.new_subject);

    app.route('/subject/updateSubject')
    .post(subjects.update_subject);

    app.route('/subject/deleteSubject')
    .post(subjects.delete_subject);

    app.route('/exams/:subject')
    .get(exams.get_exams);

    app.route('/exams/newExam')
    .post(exams.new_exams);

    app.route('/exams/updateExam')
    .post(exams.update_exams);

    app.route('/exams/deleteExam')
    .post(exams.delete_exams);

    app.route('/department/:ID')
    .get(departments.get_department);

    app.route('/departments')
    .get(departments.get_departments);

    app.route('/departmentsbyuser/:user')
    .get(departments.get_department_by_boss);

    app.route('/types')
    .get(types.get_types);

    app.route('/pictures')
    .get(pictures.get_pictures);

    app.route('/pictures/:sheet')
    .get(pictures.get_picture_by_QR);

    app.route('picture/newPicture')
    .post(picture.new_picture);

    app.route('picture/updatePicture')
    .post(picture.update_picture);

    app.route('picture/deletePicture')
    .post(picture.delete_picture);

    app.route('/sheets')
    .get(sheets.get_all_sheets);

    app.route('/sheets/:exams')
    .get(sheets.get_sheet_by_exam);

    app.route('/sheets/:users')
    .get(sheets.get_sheet_by_user);

    app.route('/sheets/newSheet')
    .get(sheets.new_sheet);

    app.route('/sheets/updateSheet')
    .get(sheets.update_sheet);

    app.route('/sheets/deleteSheet')
    .get(sheets.delete_sheet);


    


};

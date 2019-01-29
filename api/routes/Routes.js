'use strict';

module.exports = function(app) {
  var users = require('../controllers/userController');
  var subjects = require('../controllers/subjectController');
  var exams = require('../controllers/examController');
  var departments = require('../controllers/departmentsController');
  var types = require('../controllers/typeController');
  var pictures = require('../controllers/pictureController');
  var sheets = require('../controllers/sheetController');


// sandrin komentar 
  /*app.route('/predmeti')
    .get(users.get_all_users)
    .post(users.update_user);*/
// kraj sandrinog komentara 


    app.route('/delUser')
    .post(users.delete_user);

    app.route('/updateUser')
    .post(users.update_user);

    app.route('/login')
    .post(users.login);

    // app.route('/newUser')
    // .post(users.new_user);

    app.route('/subjects/:user')
    .get(subjects.get_subjects);

    app.route('/subjects/newSubject')
    .post(subjects.new_subject);

    app.route('/subject/updateSubject')
    .post(subjects.update_subject);

    app.route('/subject/deleteSubject')
    .post(subjects.delete_subject);

    app.route('/exams')
    .get(exams.get_exams);

    app.route('/exams/:subject')
	  .get(exams.get_exams_for_subject);

    app.route('/exams_user/:username')
    .get(exams.get_exams_per_user);
    
    app.route('/exams_uvid/:username')
    .get(exams.get_uvid_per_user);

    app.route('/exams_prof/:username/:subject')
    .get(exams.get_uvid_per_prof);
    app.route('/exams_per_prof/:username')
    .get(exams.get_exam_per_prof);

    app.route('/users/:subject')
    .get(users.get_users_by_subject);

    app.route('/usersbyprof/:prof')
    .get(users.get_users_by_prof);

    app.route('/users/newUserPredmet')
    .post(exams.newUserPredmet);

    app.route('/exams/newExam')
    .post(exams.new_exam);

    app.route('/exams/updateExam')
    .post(exams.update_exam);

    app.route('/exams/deleteExam')
    .delete(exams.delete_exam);

    app.route('/departments')
    .get(departments.get_departments);

    app.route('/department/:ID')
    .get(departments.get_department);
      
    app.route('/departmentsbyuser/:username')
    .get(departments.get_department_by_boss);

    app.route('/departments/newDepartment')
    .post(departments.new_department);

    app.route('/departments/updateDepartment')
    .post(departments.update_department);

    app.route('/departments/deleteDepartment')
    .post(departments.delete_department);

    app.route('/types')
    .get(types.get_types);

    app.route('/types/newType')
    .post(types.new_type);

    app.route('/types/updateType')
    .put(types.update_type);

    app.route('/types/deleteType')
    .delete(types.delete_type);

    app.route('/pictures')
    .get(pictures.get_pictures);

    app.route('/pictures/:sheet')
    .get(pictures.get_picture_by_QR);

    app.route('picture/newPicture')
    .post(pictures.new_picture);

    app.route('picture/updatePicture')
    .post(pictures.update_picture);

    app.route('picture/deletePicture')
    .post(pictures.delete_picture);

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

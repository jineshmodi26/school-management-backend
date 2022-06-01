const express = require('express');
const examCtrl = require("../controllers/exam.controller");
const auth = require('../middlewares/authentication')
const tauth = require('../middlewares/teacher')
const sauth = require('../middlewares/student');
const Student = require('../models/Student');
const router = express.Router();

router.get('/student',sauth,examCtrl.getRelevenceExams);

router.get('/teacher',tauth,examCtrl.getCreatedExamsByTeacher);

router.get('/admin',auth,examCtrl.getAllExamsAdmin);

router.get('/all',auth,examCtrl.getAllExamsNew);

router.get('/',auth,examCtrl.getAllExams);

router.get('/admin/:id',auth ,examCtrl.getExamByIdAdmin); //// change in this

router.get('/student/:id',sauth,examCtrl.getExamByIdStudent); //// change in this

router.get('/teacher/:id', tauth,examCtrl.getExamByIdTeacher); //// change in this

// router.get('/class/:id', examCtrl.getExamsByClass);  //// change in this

router.post('/teacher', tauth,examCtrl.addExamTeacher);

router.post('/admin', auth,examCtrl.addExamAdmin);

router.patch('/admin/:id',auth,examCtrl.updateExamByAdmin);

router.patch('/teacher/:id', tauth,examCtrl.updateExamByTeacher);

router.delete('/admin/:id',auth,examCtrl.deleteExam);

router.delete('/teacher/:id', tauth,examCtrl.deleteExamByTeacher);

module.exports = router;
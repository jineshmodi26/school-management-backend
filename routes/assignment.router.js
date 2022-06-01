const express = require('express');
const assignmentCltr = require("../controllers/Assignment.controller");
const router = express.Router();
const tauth = require('../middlewares/teacher')
const auth = require('../middlewares/authentication')
const sauth = require('../middlewares/student')

router.get('/',auth ,assignmentCltr.getAssignment);  /// update this 

router.get('/file/:id',tauth,assignmentCltr.getAssignmentOnly);

router.get('/file/:id',sauth,assignmentCltr.getAssignmentOnlyStudent);

router.get('/student', sauth,assignmentCltr.getRelevenceAssignment);

router.get('/class/:id',auth ,assignmentCltr.getAssignmentByClass); ////// change this 

router.get('/subject/:id',auth ,assignmentCltr.getAssignmentBySubject);  /// change this

router.get('/teacher', tauth,assignmentCltr.getAssignmentByTeacher);

router.post('/',tauth,assignmentCltr.addAssignment);

router.patch('/:id', tauth,assignmentCltr.updateAssignment);

router.delete('/:id', tauth,assignmentCltr.deleteAssignment);

module.exports = router;
const express = require('express');
const router = express.Router();
const subctrl = require("../controllers/subject.controller");
const auth = require('../middlewares/authentication')
const tauth = require('../middlewares/teacher');

router.get('/class', tauth, subctrl.getSubject);

router.get('/class/:id', tauth, subctrl.getSubjectByClassId);

router.get('/subject/class/:id', auth, subctrl.getSubjectByClassIdAdmin);

router.get('/details',auth,subctrl.getSubjectWithDetails)

router.get('/:id',auth,subctrl.getSubjectById) //admin check

router.get('/', auth,subctrl.getSubjectadmin);

router.post('/', auth,subctrl.addSubject);

router.patch('/:id',auth,subctrl.updateSubject)

router.delete('/:id',auth,subctrl.deleteSubject)

module.exports = router;
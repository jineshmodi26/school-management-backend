const express = require('express');
const materialCtrl = require("../controllers/material.controller");
const router = express.Router();
const tauth = require('../middlewares/teacher')
const sauth = require('../middlewares/student');
const auth = require('../middlewares/authentication');

router.get('/', auth,materialCtrl.getMaterial);  

router.get('/file/:id',tauth,materialCtrl.getMaterialOnly);

router.get('/file/:id',sauth,materialCtrl.getMaterialOnlyStudent);

router.get('/student', sauth,materialCtrl.getRelevenceMaterial);

router.get('/class/:id', auth,materialCtrl.getMaterialByClass); 

router.get('/subject/:id', auth,materialCtrl.getMaterialBySubject);  

router.get('/teacher', tauth,materialCtrl.getMaterialByTeacher);

router.post('/',tauth,materialCtrl.addMaterial);

router.patch('/:id', tauth,materialCtrl.updateMaterial);

router.delete('/:id', tauth,materialCtrl.deleteMaterial);

module.exports = router;
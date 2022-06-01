const express = require('express');
const router = express.Router();
const noticeCltr = require('../controllers/notice.controller')
const auth = require('../middlewares/authentication')
const tauth = require('../middlewares/teacher')
const sauth = require('../middlewares/student')

router.get('/admin',auth,noticeCltr.getallNotices); 

router.get('/student', sauth,noticeCltr.getallRelevenceNoticesStudent); 

router.get('/teacher', tauth,noticeCltr.getallNoticesCreatedByHim); 

// router.get('/:id', noticeCltr.getNoticeById); ///we have to change this 

router.get('/teacher/:id', tauth,noticeCltr.getNoticeByIdTeacher); 

router.get('/student/:id',sauth ,noticeCltr.getNoticeByIdStudent); 

router.get('/admin/:id',auth,noticeCltr.getNoticeByIdadmin); 

router.post('/admin',auth,noticeCltr.addNotice); 

router.post('/teacher',tauth,noticeCltr.addNoticeByTeacher); 

router.patch('/teacher/:id',tauth,noticeCltr.updateNoticeByTeacher)

router.patch('/admin/:id',auth,noticeCltr.updateNoticeByAdmin)

router.delete('/admin/:id',auth,noticeCltr.deleteNoticeByAdmin)

router.delete('/teacher/:id',tauth,noticeCltr.deleteNoticeByTeacher)

module.exports = router;
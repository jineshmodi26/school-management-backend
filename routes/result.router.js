const express = require('express');
const router = express.Router();
const resultCtrl = require('../controllers/result.controller');
const auth = require('../middlewares/authentication')
const sauth = require('../middlewares/student')
const tauth = require('../middlewares/teacher')

router.get("/student",sauth ,resultCtrl.getResultByStudentId);
// router.get("/", tauth,resultCtrl.getResults);
router.get("/", auth,resultCtrl.getResults);

router.get("/exam/:id", tauth,resultCtrl.getResultByExamId);

// router.post("/",tauth,resultCtrl.addResult);
router.post("/",auth,resultCtrl.addResult);

router.patch("/:id", tauth,resultCtrl.updateResult);

router.delete("/:id", tauth,resultCtrl.deleteResult);

module.exports = router
const express = require('express');
const router = express.Router();
// const adminCltr = require('../controllers/admin.controller')
const superadminCltr = require('../controllers/superadmin.controller')

router.post('/login', superadminCltr.loginSuperAdmin);

module.exports = router;
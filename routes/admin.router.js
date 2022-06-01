const express = require('express');
const router = express.Router();
const adminCltr = require('../controllers/admin.controller')
const auth = require('../middlewares/authentication')
const Superauth = require('../middlewares/SuperAdmin')

router.post('/check',auth,adminCltr.checkAdmin);

router.post('/login', adminCltr.loginAdmin);

router.post('/logout',auth,adminCltr.logoutAdmin);

router.post('/add',Superauth,adminCltr.addAdmin);

router.get('/allAdmins',Superauth,adminCltr.getAdmins);

router.get('/:id',Superauth,adminCltr.getAdminById);

router.patch('/:id',Superauth,adminCltr.updateAdminById);

router.delete('/:id',Superauth,adminCltr.deleteAdminById);

module.exports = router;
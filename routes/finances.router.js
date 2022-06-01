const express = require('express');
const router = express.Router();
const financescltr = require('../controllers/finance.controller')
const auth = require('../middlewares/authentication')
router.get('/totalfinance',auth,financescltr.getFinanceTotal);

router.get('/:startDate/:endDate', auth,financescltr.getFinancess);

router.get('/:id', auth,financescltr.getFinancessById);


router.post('/', auth,financescltr.addFinance);

router.patch('/:id',auth,financescltr.updateFinance)

router.delete('/:id',auth,financescltr.deleteFinance);

module.exports = router;
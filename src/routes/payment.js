const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for purchasing airtime
router.post('/purchase-airtime', authMiddleware.authenticate, paymentController.purchaseAirtime);

// Route for handling utility payments
router.post('/utility-payment', authMiddleware.authenticate, paymentController.utilityPayment);

module.exports = router;
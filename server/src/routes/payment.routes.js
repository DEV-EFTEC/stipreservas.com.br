import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', paymentController.createPayment);
router.get('/get-payment', paymentController.findPaymentById);
router.get('/get-payments', paymentController.findPaymentsByUser);
router.get('/update-status/:id', paymentController.updatePaymentStatus);

export default router;

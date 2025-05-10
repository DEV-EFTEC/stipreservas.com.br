import express from 'express';
import * as dependentsController from '../controllers/dependentsController.js';

const router = express.Router();

router.post('/', dependentsController.createDependent);
router.patch('/update-dependent/:id', dependentsController.updateDependent);
router.get('/get-dependent', dependentsController.findDependentById);
router.get('/get-dependents', dependentsController.findDependentsByUser);
router.get('/delete-dependent', dependentsController.deleteDependent);
router.post('/create-dependent-booking', dependentsController.createDependentByBooking);

export default router;

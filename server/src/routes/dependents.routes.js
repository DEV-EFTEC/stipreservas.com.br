import express from 'express';
import * as dependentsController from '../controllers/dependentsController.js';

const router = express.Router();

router.post('/', dependentsController.createDependent);
router.get('/get-dependent', dependentsController.findDependentById);
router.get('/get-dependents', dependentsController.findDependentsByUser);
router.get('/update-dependent', dependentsController.updateDependent);
router.get('/delete-dependent', dependentsController.deleteDependent);

export default router;

import express from 'express';
import * as stepchildrenController from '../controllers/stepchildrenController.js';

const router = express.Router();

router.post('/', stepchildrenController.createStepchild);
router.get('/get-stepchild', stepchildrenController.findStepchildById);
router.get('/get-stepchildren', stepchildrenController.findStepchildrenByUser);
router.post('/get-stepchildren', stepchildrenController.findStepchildrenByUserAdmin);
router.patch('/update-stepchild/:id', stepchildrenController.updateStepchild);
router.get('/delete-stepchild', stepchildrenController.deleteStepchild);

export default router;

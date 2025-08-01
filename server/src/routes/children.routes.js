// Children Routes
import express from 'express';
import * as childrenController from '../controllers/childrenController.js';

const router = express.Router();

router.post('/', childrenController.createChild);
router.get('/get-child', childrenController.findChildById);
router.get('/get-children', childrenController.findChildrenByUser);
router.post('/get-children', childrenController.findChildrenByUserAdmin);
router.patch('/update-child/:id', childrenController.updateChild);
router.get('/delete-child', childrenController.deleteChild);

export default router;

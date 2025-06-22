import express from 'express';
import * as periodController from '../controllers/periodController.js';

const router = express.Router();

router.post('/', periodController.createPeriod);
router.get('/get-periods', periodController.getPeriods);
router.patch('/update-period/:id', periodController.updatePeriod);

export default router;

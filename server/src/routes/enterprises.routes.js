import express from 'express';
import * as enterpriseController from '../controllers/enterpriseController.js';

const router = express.Router();

router.post('/', enterpriseController.createEnterprise);
router.get('/:id', enterpriseController.getEnterpriseById);

export default router;

import express from 'express';
import * as enterpriseController from '../controllers/enterpriseController.js';

const router = express.Router();

router.post('/', enterpriseController.createEnterprise);

export default router;

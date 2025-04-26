import express from 'express';
import * as storageController from '../controllers/storageController.js';
import upload from '#middlewares/multer.js';

const router = express.Router();

router.post('/send-document', upload.single('file'), storageController.sendDocument);

export default router;

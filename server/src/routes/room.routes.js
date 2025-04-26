// Room Routes
import express from 'express';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

router.post('/', roomController.createRoom);
router.get('/get-rooms', roomController.getAll);

export default router;

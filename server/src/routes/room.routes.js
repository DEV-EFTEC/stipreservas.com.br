// Room Routes
import express from 'express';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

router.post('/', roomController.createRoom);
router.get('/get-rooms', roomController.getAll);
router.get('/get-available-rooms', roomController.findAvailableRooms)

export default router;

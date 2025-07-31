import express from 'express';
import * as calendarController from '../controllers/calendarController.js';

const router = express.Router();

router.get('/', calendarController.findAllOccupations);

export default router;

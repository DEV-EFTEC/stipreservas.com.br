import express from 'express';
import * as guestsController from '../controllers/guestsController.js';

const router = express.Router();

router.post('/', guestsController.createGuest);
router.get('/get-guest', guestsController.findGuestById);
router.get('/get-guests', guestsController.findGuestsByUser);
router.patch('/update-guest/:id', guestsController.updateGuest);
router.get('/delete-guest', guestsController.deleteGuest);

export default router;

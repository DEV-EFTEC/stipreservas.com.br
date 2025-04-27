import express from 'express';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', bookingController.createBooking);
router.get('/get-booking', bookingController.findBookingById);
router.get('/get-bookings', bookingController.findBookingsByUser);
router.get('/get-booking-complete', bookingController.getBookingComplete);
router.get('/get-participants', bookingController.getParticipants);
router.post('/create-participants', bookingController.createParticipants);
router.post('/update-booking', bookingController.updateBooking);
router.post('/update-participants', bookingController.updateParticipants);
router.delete('/delete-booking/:id', bookingController.deleteBooking);

export default router;

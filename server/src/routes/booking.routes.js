import express from 'express';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', bookingController.createBooking);
router.post('/update-booking', bookingController.updateBooking);
router.post('/create-participants-booking', bookingController.createParticipantsBooking);
router.put('/update-participants-booking', bookingController.updateParticipantsBooking);
router.get('/get-all-bookings', bookingController.getAllBookings);
router.get('/get-booking', bookingController.findBookingById);
router.get('/get-bookings', bookingController.findBookingsByUser);
router.get('/get-booking-complete', bookingController.getBookingComplete);
router.get('/get-participants', bookingController.getParticipants);
router.delete('/delete-booking/:id', bookingController.deleteBooking);

export default router;

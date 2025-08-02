import express from "express";
import * as webhookController from "../controllers/webhookController.js";

const router = express.Router();

router.post("/booking-paided", webhookController.bookingPaided);
router.post("/booking-refunded", webhookController.bookingRefunded);

export default router;

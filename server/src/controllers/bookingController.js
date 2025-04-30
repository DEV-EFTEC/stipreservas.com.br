import * as bookingService from '../services/bookingService.js';
import logger from '#core/logger.js';

export async function findBookingById(req, res) {
    try {
        const { id } = req.query;
        const result = await bookingService.findBookingById(id);

        if (!result) return res.status(404).json({ message: "Nenhuma reserva encontrada." });

        res.status(200).json(result);
    } catch (err) {
        logger.error('Error on findBookingById', { err });
        res.status(500).json({ error: err.message });
    }
}

export async function findBookingsByUser(req, res) {
    try {
        const { user_id } = req.query;
        const result = await bookingService.findBookingsByUser(user_id);
        
        if (!result) return res.status(404).json({ message: "Nenhuma reserva encontrada." });

        res.status(200).json(result);
    } catch (err) {
        logger.error('Error on findBookingsByUser', { err });
        res.status(500).json({ error: err.message });
    }
}

export async function createBooking(req, res) {
    try {
        const result = await bookingService.createBooking(req.body);
        res.status(200).json(result);
    } catch (err) {
        logger.error('Erro em createBooking', { err });
        res.status(400).json({ error: err.message });
    }
}

export async function updateBooking(req, res) {
    try {
        const updatedBooking = await bookingService.updateBooking(req.body);
        res.status(200).json(updatedBooking);
    } catch (err) {
        logger.error('Erro em updateStatus', { err });
        res.status(400).json({ error: err.message });
    }
}

export async function getBookingComplete(req, res) {
    try {
        const { booking_id } = req.query;
        const result = await bookingService.getBookingComplete(booking_id);
        
        if (!result) return res.status(404).json({ message: "Nenhuma reserva encontrada." });

        res.status(200).json(result);
    } catch (err) {
        logger.error('Error on getBookingComplete', { err });
        res.status(500).json({ error: err.message });
    }
}

export async function createParticipants(req, res) {
    try {
        const result = await bookingService.createParticipants(req.body);
        res.status(201).json(result);
    } catch (err) {
        logger.error('Error on createParticipants', { err });
        res.status(500).json({ error: err.message });
    }
}

export async function getParticipants(req, res) {
    try {
        const { booking_id } = req.query;
        const result = await bookingService.getParticipants(booking_id);
        res.status(201).json(result);
    } catch (err) {
        logger.error('Error on createParticipants', { err });
        res.status(500).json({ error: err.message });
    }
}

export async function updateParticipants(req, res) {
    try {
        const result = await bookingService.updateParticipants(req.body);
        res.status(200).json(result);
    } catch (err) {
        logger.error('Error on updateParticipants', { err });
        res.status(500).json({ error: err.message });
    }
}

export async function deleteBooking(req, res) {
    try {
        const { id } = req.params;
        const result = await bookingService.deleteBooking(id);
        res.status(200).json(result);
    } catch (err) {
        logger.error('Error on updateParticipants', { err });
        res.status(500).json({ error: err.message });
    }
}
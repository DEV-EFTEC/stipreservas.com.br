// Room Controller
import * as roomService from '../services/roomService.js';
import logger from '#core/logger.js';

export async function getAll(req, res) {
  try {
    const result = await roomService.getAllRooms();
    res.status(200).json(result);
  } catch (err) {
    logger.error('Error on getAll', { err });
    res.status(500).json({ error: 'Erro ao buscar rooms' });
  }
}

export async function createRoom(req, res) {
  try {
    await roomService.createRoom(req.body);
    res.status(200).json({ message: "Room created." })
  } catch (err) {
    logger.error('Error on createRoom', { err });
    res.status(500).json({ error: 'Erro ao criar room' });
  }
}

export async function findAvailableRooms(req, res) {
  try {
      const { check_in, check_out, capacity, booking_id } = req.query;
      const result = await roomService.findAvailableRooms(check_in, check_out, capacity, booking_id);
      
      if (!result) return res.status(404).json({ message: "Nenhum quarto disponível para essas datas." });

      res.status(200).json(result);
  } catch (err) {
      logger.error('Error on findAvailableRooms', { err });
      res.status(500).json({ error: err.message });
  }
}

export async function findRoomById(req, res) {
  try {
    const { id } = req.query;
    const result = await roomService.findRoomById(id);
    
    if (!result) return res.status(404).json({ message: "nenhum quarto encontrado." });

    res.status(200).json(result);
  } catch (err) {
      logger.error('Error on findAvailableRooms', { err });
      res.status(500).json({ error: err.message });
  }
}

export async function bookRoom(req, res) {
  try {
    const { rooms } = req.body;
    const result = await roomService.bookRoom(rooms);
    
    if (!result) return res.status(404).json({ message: "nenhum quarto encontrado." });

    res.status(200).json(result);
  } catch (err) {
      logger.error('Error on findAvailableRooms', { err });
      res.status(500).json({ error: err.message });
  }
}

export async function unselectRoom(req, res) {
  try {
    const { booking_id, room_id } = req.body;
    const result = await roomService.unselectRoom(booking_id, room_id);
    
    if (!result) return res.status(404).json({ message: "nenhum quarto encontrado." });

    res.status(200).json(result);
  } catch (err) {
      logger.error('Error on findAvailableRooms', { err });
      res.status(500).json({ error: err.message });
  }
}
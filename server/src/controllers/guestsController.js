import * as guestsServices from '../services/guestsService.js';
import logger from '#core/logger.js';

export async function createGuest(req, res) {
  try {
    const guest = await guestsServices.createGuest(req.body);
    res.status(200).json({ ...guest, is_saved: false });
  } catch (err) {
    logger.error('Error on createGuest', { err });
    res.status(500).json({ error: 'Erro ao criar Guest' });
  }
}

export async function updateGuest(req, res) {
  try {
    const { id } = req.params;
    const guest = await guestsServices.updateGuest(id, req.body);
    res.status(200).json({ guest });
  } catch (err) {
    logger.error('Error on createGuests', { err });
    res.status(500).json({ error: 'Erro ao atualizar Guests' });
  }
}

export async function deleteGuest(req, res) {
  try {
    const { id } = req.params;
    const guest = await guestsServices.deleteGuest(id);
    res.status(200).json({ guest });
  } catch (err) {
    logger.error('Error on deleteGuest', { err });
    res.status(500).json({ error: 'Erro ao deletar Guests' });
  }
}

export async function findGuestById(req, res) {
  try {
    const { id } = req.query;
    const guest = await guestsServices.findGuestById(id);
    res.status(200).json({ guest });
  } catch (err) {
    logger.error('Error on findGuestById', { err });
    res.status(500).json({ error: 'Erro ao encontrar Guests' });
  }
}

export async function findGuestsByUser(req, res) {
  try {
    const { id } = req.query;
    const guests = await guestsServices.findGuestsByUser(id);
    res.status(200).json(guests);
  } catch (err) {
    logger.error('Error on findGuestsByUser', { err });
    res.status(500).json({ error: 'Erro ao encontrar Guests' });
  }
}
import * as paymentService from '../services/paymentService.js';
import logger from '#core/logger.js';

export async function createPayment(req, res) {
  try {
    const result = await paymentService.createPayment(req.body);
    res.status(201).json(result);
  } catch (err) {
    logger.error('Error on createPayment', { err });
    res.status(500).json({ error: 'Erro ao criar payments' });
  }
}

export async function updatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const status = req.body;
    await paymentService.updatePaymentStatus(id, status);
    res.status(200).json({ message: 'Payment atualizado' });
  } catch (err) {
    logger.error('Error on updatePaymentStatus', { err });
    res.status(500).json({ error: 'Erro ao atualizar payment status' });
  }
}

export async function findPaymentById(req, res) {
  try {
    const { id } = req.query;
    const result = await paymentService.findPaymentById(id);
    res.status(201).json(result);
  } catch (err) {
    logger.error('Error on findPaymentById', { err });
    res.status(500).json({ error: 'Erro ao buscar payment by id' });
  }
}

export async function findPaymentsByUser(req, res) {
  try {
    const { id } = req.query;
    const result = await paymentService.findPaymentsByUser(id);
    res.status(201).json(result);
  } catch (err) {
    logger.error('Error on findPaymentsByUser', { err });
    res.status(500).json({ error: 'Erro ao buscar payments by user' });
  }
}
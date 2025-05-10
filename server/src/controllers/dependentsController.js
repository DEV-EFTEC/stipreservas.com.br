import * as dependentsServices from '../services/dependentsService.js';
import logger from '#core/logger.js';

export async function createDependent(req, res) {
  try {
    const dependent = await dependentsServices.createDependent(req.body);
    res.status(200).json({...dependent, is_saved: false});
  } catch (err) {
    logger.error('Error on createdependent', { err });
    res.status(500).json({ error: 'Erro ao criar dependent' });
  }
}

export async function updateDependent(req, res) {
  try {
    const { id } = req.params;
    const dependent = await dependentsServices.updateDependent(id, req.body);
    res.status(200).json({ dependent });
  } catch (err) {
    logger.error('Error on createdependents', { err });
    res.status(500).json({ error: 'Erro ao atualizar dependents' });
  }
}

export async function createDependentByBooking(req, res) {
  try {
    await dependentsServices.createDependentByBooking(req.body),
    res.status(200).json({ message: 'dependent_booking atrelado com sucesso!' });
  } catch (err) {
    logger.error('Error on createDependentByBooking', { err });
    res.status(500).json({ error: 'Erro ao criar dependente por reserva' });
  }
}

export async function deleteDependent(req, res) {
  try {
    const { id } = req.params;
    const dependent = await dependentsServices.deleteDependent(id);
    res.status(200).json({ dependent });
  } catch (err) {
    logger.error('Error on deleteDependent', { err });
    res.status(500).json({ error: 'Erro ao deletar Dependents' });
  }
}

export async function findDependentById(req, res) {
  try {
    const { id } = req.query;
    const dependent = await dependentsServices.findDependentById(id);
    res.status(200).json({ dependent });
  } catch (err) {
    logger.error('Error on findDependentById', { err });
    res.status(500).json({ error: 'Erro ao encontrar Dependents' });
  }
}

export async function findDependentsByUser(req, res) {
  try {
    const { id } = req.query;
    const dependents = await dependentsServices.findDependentsByUser(id);
    res.status(200).json(dependents);
  } catch (err) {
    logger.error('Error on findDependentsByUser', { err });
    res.status(500).json({ error: 'Erro ao encontrar Dependents' });
  }
}

export async function getDependetByParcialName(req, res) {
  try {
    const { parcial_name, created_by } = req.query;
    const dependents = await dependentsServices.getDependetByParcialName(parcial_name, created_by);
    res.status(200).json({ dependents });
  } catch (err) {
    logger.error('Error on findDependentsByUser', { err });
    res.status(500).json({ error: 'Erro ao encontrar Dependents' });
  }
}
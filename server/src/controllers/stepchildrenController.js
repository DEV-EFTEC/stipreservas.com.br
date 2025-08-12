import * as stepchildrenService from '../services/stepchildrenService.js';
import logger from '#core/logger.js';

export async function createStepchild(req, res) {
  try {
    const child = await stepchildrenService.createStepchild(req.body);
    res.status(200).json({...child, is_saved: false});
  } catch (err) {
    logger.error('Error on createStepchild', { err });
    res.status(500).json({ error: 'Erro ao criar children' });
  }
}

export async function updateStepchild(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const child = await stepchildrenService.updateStepchild(id, data);
    res.status(200).json({ child });
  } catch (err) {
    logger.error('Error on updateStepchild', { err });
    res.status(500).json({ error: 'Erro ao criar children' });
  }
}

export async function deleteStepchild(req, res) {
  try {
    const { id } = req.params;
    const child = await stepchildrenService.deleteStepchild(id);
    res.status(200).json({ child });
  } catch (err) {
    logger.error('Error on deleteStepchild', { err });
    res.status(500).json({ error: 'Erro ao deletar stepchildren' });
  }
}

export async function findStepchildById(req, res) {
  try {
    const { id } = req.query;
    const child = await stepchildrenService.findStepchildById(id);
    res.status(200).json({ child });
  } catch (err) {
    logger.error('Error on findStepchildById', { err });
    res.status(500).json({ error: 'Erro ao criar stepchildren' });
  }
}

export async function findStepchildrenByUser(req, res) {
  try {
    const { id } = req.user;
    const children = await stepchildrenService.findStepchildrenByUser(id);
    res.status(200).json(children);
  } catch (err) {
    logger.error('Error on findStepchildrenByUser', { err });
    res.status(500).json({ error: 'Erro ao encontrar stepchildren' });
  }
}

export async function findStepchildrenByUserAdmin(req, res) {
  try {
    const { user } = req.body;
    const children = await stepchildrenService.findStepchildrenByUserAdmin(user.id);
    res.status(200).json(children);
  } catch (err) {
    logger.error('Error on findStepchildrenByUserAdmin', { err });
    res.status(500).json({ error: 'Erro ao encontrar stepchildren' });
  }
}
// Children Controller
import * as childrenService from '../services/childrenService.js';
import logger from '#core/logger.js';

export async function createChild(req, res) {
  try {
    const child = await childrenService.createChild(req.body);
    res.status(200).json({...child, is_saved: false});
  } catch (err) {
    logger.error('Error on createChildren', { err });
    res.status(500).json({ error: 'Erro ao criar children' });
  }
}

export async function updateChild(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const child = await childrenService.updateChild(id, data);
    res.status(200).json({ child });
  } catch (err) {
    logger.error('Error on createChildren', { err });
    res.status(500).json({ error: 'Erro ao criar children' });
  }
}

export async function deleteChild(req, res) {
  try {
    const { id } = req.params;
    const child = await childrenService.deleteChild(id);
    res.status(200).json({ child });
  } catch (err) {
    logger.error('Error on createChildren', { err });
    res.status(500).json({ error: 'Erro ao criar children' });
  }
}

export async function findChildById(req, res) {
  try {
    const { id } = req.query;
    const child = await childrenService.findChildById(id);
    res.status(200).json({ child });
  } catch (err) {
    logger.error('Error on createChildren', { err });
    res.status(500).json({ error: 'Erro ao criar children' });
  }
}

export async function findChildrenByUser(req, res) {
  try {
    const { id } = req.query;
    const children = await childrenService.findChildrenByUser(id);
    res.status(200).json(children);
  } catch (err) {
    logger.error('Error on createChildren', { err });
    res.status(500).json({ error: 'Erro ao criar children' });
  }
}
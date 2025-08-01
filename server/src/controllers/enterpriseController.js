import * as enterpriseService from '../services/enterpriseService.js';
import logger from '#core/logger.js';

export async function createEnterprise(req, res) {
  try {
    await enterpriseService.createEnterprise(req.body);
    res.status(200).json({ message: "Enterprise created." })
  } catch (err) {
    logger.error('Error on createEnterprise', { err });
    res.status(500).json({ error: 'Erro ao criar empresa' });
  }
}

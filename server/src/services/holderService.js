import * as holderModel from '../models/holderModel.js';

export async function createHolder(data) {
  return holderModel.createHolder(data);
}

export async function updateHolder(id, data) {
  return holderModel.updateHolder(id, data);
}
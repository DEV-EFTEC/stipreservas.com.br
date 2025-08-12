import * as stepchildrenModel from '../models/stepchildrenModel.js';

export async function createStepchild(data) {
  return stepchildrenModel.createStepchild(data);
}

export async function updateStepchild(id, data) {
  return stepchildrenModel.updateStepchild(id, data);
}

export async function deleteStepchild(id) {
  return stepchildrenModel.deleteStepchild(id);
}

export async function findStepchildById(id) {
  return stepchildrenModel.findStepchildById(id);
}

export async function findStepchildrenByUser(id) {
  return stepchildrenModel.findStepchildrenByUser(id);
}

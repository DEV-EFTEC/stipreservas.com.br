// Children Service
import * as childrenModel from '../models/childrenModel.js';

export async function createChild(data) {
  return childrenModel.createChild(data);
}

export async function updateChild(id, data) {
  return childrenModel.updateChild(id, data);
}

export async function deleteChild(id) {
  return childrenModel.deleteChild(id);
}

export async function findChildById(id) {
  return childrenModel.findChildById(id);
}

export async function findChildrenByUser(id) {
  return childrenModel.findChildrenByUser(id);
}
// Adicione regras de negócio aqui

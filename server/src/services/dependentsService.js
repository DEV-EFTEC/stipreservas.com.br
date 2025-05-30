import * as dependentsModel from '../models/dependentsModel.js';

export async function createDependent(data) {
  return dependentsModel.createDependent(data);
}

export async function updateDependent(id, data) {
  return dependentsModel.updateDependent(id, data);
}

export async function deleteDependent(id) {
  return dependentsModel.deleteDependent(id);
}

export async function findDependentById(id) {
  return dependentsModel.findDependentById(id);
}

export async function findDependentsByUser(id) {
  return dependentsModel.findDependentsByUser(id);
}

export async function getDependetByParcialName(parcialName, createdBy) {
  return dependentsModel.getDependetByParcialName(parcialName, createdBy);
}

export async function createDependentByBooking(data) {
  return dependentsModel.createDependentByBooking(data);
}
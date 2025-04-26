import * as guestsModel from '../models/guestsModel.js';

export async function createGuest(data) {
  return guestsModel.createGuest(data);
}

export async function updateGuest(id, data) {
  return guestsModel.updateGuest(id, data);
}

export async function deleteGuest(id) {
  return guestsModel.deleteGuest(id);
}

export async function findGuestById(id) {
  return guestsModel.findGuestById(id);
}

export async function findGuestsByUser(id) {
  return guestsModel.findGuestsByUser(id);
}

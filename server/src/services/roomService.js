// Room Service
import * as roomModel from '../models/roomModel.js';

export async function getAllRooms() {
  return roomModel.findAllRooms();
}

export async function createRoom(data) {
  return roomModel.createRoom(data);
}

export async function findRoomById(id) {
  return roomModel.findRoomById(id);
}

export async function findAvailableRooms(checkIn, checkOut) {
  return roomModel.findAvailableRooms(checkIn, checkOut);
}

// Adicione regras de negócio aqui

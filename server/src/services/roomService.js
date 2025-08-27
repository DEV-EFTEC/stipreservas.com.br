// Room Service
import * as roomModel from '../models/roomModel.js';

export async function getAllRooms() {
  return roomModel.findAllRooms();
}

export async function getDefaultRoom() {
  return roomModel.findDefaultRoom();
}

export async function createRoom(data) {
  return roomModel.createRoom(data);
}

export async function findRoomById(id) {
  return roomModel.findRoomById(id);
}

export async function findAvailableRooms(checkIn, checkOut, capacity, bookingId, hasChild, hasOld) {
  return roomModel.findAvailableRooms(checkIn, checkOut, capacity, bookingId, hasChild, hasOld);
}

export async function bookRoom(data) {
  return roomModel.bookRoom(data);
}

export async function unselectRoom(bookingId, roomId) {
  return roomModel.unselectRoom(bookingId, roomId)
}
import * as bookingModel from '../models/bookingModel.js';
import * as dependentsModel from '#models/dependentsModel.js';
import * as guestsModel from '#models/guestsModel.js';
import * as childrenModel from '#models/childrenModel.js';
import _ from 'lodash';

export async function findBookingById(id) {
  const booking = await bookingModel.findBookingById(id);
  return booking || null;
}

export async function getBookingByUser(userId) {
  const bookings = await bookingModel.findBookingsByUser(userId);
  return bookings || [];
}

export async function findBookingsByUser(userId) {
  const bookings = await bookingModel.findBookingsByUser(userId);
  return bookings || [];
}

export async function createBooking(bookingData) {
  return await  bookingModel.createBooking(bookingData);
}

export async function updateBooking(data) {
  const { id, ...payload } = data;
  return await bookingModel.updateBooking(id, payload);
}

export async function getBookingComplete(id) {
  return await bookingModel.getBookingComplete(id);
}

export async function getParticipants(bookingId) {
  const dependents = await dependentsModel.getDependentsByBooking(bookingId);
  const guests = await guestsModel.getGuestsByBooking(bookingId);
  const children = await childrenModel.getChildrenByBooking(bookingId);

  return { dependents, guests, children };
}

export async function deleteBooking(id) {
  return await bookingModel.deleteBooking(id);
}

export async function getAllBookings(userType, page, limit) {
  if (userType === 'admin') {
    const newPage = parseInt(page) || 1;
    const newLimit = parseInt(limit) || 10;

    const offset = (page - 1) * limit;

    const bookings = await bookingModel.getAllBookings(newLimit, offset);
    const [{ count }] = await bookingModel.bookingCount();
    return {
      data: bookings,
      pagination:{
        total: parseInt(count),
        page: newPage,
        limit: newLimit,
        total_pages: Math.ceil(count / newLimit)
      }
    }
  } else {
    throw new Error('Não autorizado');
  }
}
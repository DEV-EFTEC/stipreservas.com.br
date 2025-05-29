import * as bookingModel from '../models/bookingModel.js';
import * as dependentsModel from '#models/dependentsModel.js';
import * as guestsModel from '#models/guestsModel.js';
import * as childrenModel from '#models/childrenModel.js';
import * as holderModel from '#models/holderModel.js';
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
  return await bookingModel.createBooking(bookingData);
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
      pagination: {
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

export async function createParticipantsBooking(children, guests, dependents, holders) {
  const tasks = [];

  if (children.length > 0) {
    tasks.push(childrenModel.createChildByBooking(children));
  }

  if (guests.length > 0) {
    tasks.push(guestsModel.createGuestByBooking(guests));
  }

  if (dependents.length > 0) {
    tasks.push(dependentsModel.createDependentByBooking(dependents));
  }

  if (holders.length > 0) {
    tasks.push(holderModel.createHolderByBooking(holders));
  }

  return await Promise.all(tasks);
}

export async function updateParticipantsBooking(booking_id, children, guests, dependents, holders) {
  const tasks = [];

  if (children.length > 0) {
    const childrenUpdates = children.map(child =>
      childrenModel.updateChildByBooking({
        child_id: child.id,
        check_in: child.check_in,
        check_out: child.check_out,
        room_id: child.room_id,
        booking_id
      })
    );
    tasks.push(...childrenUpdates);
  }

  if (guests.length > 0) {
    const guestsUpdates = guests.map(guest =>
      guestsModel.updateGuestsByBooking({
        guest_id: guest.id,
        check_in: guest.check_in,
        check_out: guest.check_out,
        room_id: guest.room_id,
        booking_id
      })
    );
    tasks.push(...guestsUpdates);
  }

  if (dependents.length > 0) {
    const dependentsUpdates = dependents.map(dep =>
      dependentsModel.updateDependentsByBooking({
        dependent_id: dep.id,
        check_in: dep.check_in,
        check_out: dep.check_out,
        room_id: dep.room_id,
        booking_id
      })
    );
    tasks.push(...dependentsUpdates);
  }

  if (holders.length > 0) {
    const holdersUpdates = holders.map(hol =>
      holderModel.updateHoldersByBooking({
        holder_id: hol.id,
        check_in: hol.check_in,
        check_out: hol.check_out,
        room_id: hol.room_id,
        booking_id
      })
    );
    tasks.push(...holdersUpdates);
  }

  // Executa todas as atualizações em paralelo
  return await Promise.all(tasks);
}

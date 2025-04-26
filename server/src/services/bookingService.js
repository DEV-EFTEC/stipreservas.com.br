import * as bookingModel from '../models/bookingModel.js';
import * as dependentsModel from '#models/dependentsModel.js';
import * as guestsModel from '#models/guestsModel.js';
import * as childrenModel from '#models/childrenModel.js';
import _ from 'lodash';

export async function getBooking(id) {
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

export async function createParticipants(data) {
  const {
    dependents_quantity,
    guests_quantity,
    children_age_max_quantity,
    created_by,
    booking_id
  } = data;

  const dependents = await Promise.all(
    Array.from({ length: dependents_quantity }).map(() =>
      dependentsModel.createDependent({ created_by })
    )
  );

  const guests = await Promise.all(
    Array.from({ length: guests_quantity }).map(() =>
      guestsModel.createGuest({ created_by })
    )
  );

  const children = await Promise.all(
    Array.from({ length: children_age_max_quantity }).map(() =>
      childrenModel.createChild({ created_by })
    )
  );

  await Promise.all([
    ...dependents.map((d) =>
      dependentsModel.createDependentByBooking({
        dependent_id: d.id,
        booking_id,
      })
    ),
    ...guests.map((g) =>
      guestsModel.createGuestByBooking({
        guest_id: g.id,
        booking_id
      })
    ),
    ...children.map((c) =>
      childrenModel.createChildByBooking({
        child_id: c.id,
        booking_id,
      })
    ),
  ]);

  return {
    dependents,
    guests,
    children,
  };
}

export async function updateEntityList(entityList, modelUpdateFn) {
  return Promise.all(
    entityList.map((entity) => {
      const { id, ...payload } = entity;
      return modelUpdateFn(id, payload);
    })
  );
}

export async function updateParticipants(data) {
  const { dependents, guests, children } = data;

  const [updatedDependents, updatedGuests, updatedChildren] = await Promise.all([
    updateEntityList(dependents, dependentsModel.updateDependent),
    updateEntityList(guests, guestsModel.updateGuest),
    updateEntityList(children, childrenModel.updateChild),
  ]);

  return {
    dependents: updatedDependents,
    guests: updatedGuests,
    children: updatedChildren,
  };
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
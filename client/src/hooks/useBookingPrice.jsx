function getDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Calcula o preço total da reserva.
 * @param {Object} booking Objeto booking com arrays rooms, dependents, guests, children e o titular (holder).
 * Cada pessoa deve ter room_id, check_in e check_out.
 * Cada room deve ter id, price (diária do quarto) e guest_price (diária do convidado).
 * @returns {number} totalPrice
 */
function calculateTotalPrice(booking) {
  if (!booking || !booking.rooms?.length) return 0;

  let total = 0;
  const roomOccupancy = {};
  const associate_role = booking.holders[0].associate_role;

  booking.rooms.forEach((room) => {
    roomOccupancy[room.id] = new Set();
  });

  function addPersonToRoom(person) {
    const roomId = person.room_id;
    const room = booking.rooms.find(r => r.id === roomId);
    if (!room || !person.check_in || !person.check_out) return;

    const range = getDateRange(new Date(person.check_in), new Date(person.check_out));
    range.forEach(date => roomOccupancy[roomId].add(date));
  }

  if (associate_role === 'partner' && booking.partner_presence) {
    addPersonToRoom(booking.holders[0]);
  } else if (associate_role === 'contributor') {
    addPersonToRoom(booking.holders[0]);
  }

  booking.dependents?.forEach(dep => addPersonToRoom(dep));

  booking.guests?.forEach(guest => addPersonToRoom(guest));

  booking.stepchildren?.forEach(sc => addPersonToRoom(sc));

  Object.entries(roomOccupancy).forEach(([roomId, dates]) => {
    const room = booking.rooms.find(r => r.id === roomId);
    total += dates.size * Number(associate_role == 'partner' ? room.partner_booking_fee_per_day : room.contributor_booking_fee_per_day);
  });

  booking.guests?.forEach((guest) => {
    const room = booking.rooms.find(r => r.id === guest.room_id);
    if (!room || !guest.check_in || !guest.check_out) return;

    const range = getDateRange(new Date(guest.check_in), new Date(guest.check_out));
    total += range.length * Number(associate_role == 'partner' ? room.partner_guest_fee_per_day : room.contributor_guest_fee_per_day);
  });

  booking.stepchildren?.forEach((stepchild) => {
    const room = booking.rooms.find(r => r.id === stepchild.room_id);
    if (!room || !stepchild.check_in || !stepchild.check_out) return;

    const range = getDateRange(new Date(stepchild.check_in), new Date(stepchild.check_out));
    total += range.length * Number(associate_role == 'partner' ? room.partner_stepchild_fee_per_day : room.contributor_stepchild_fee_per_day);
  });

  return {
    formatted: Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total),
    brute: total
  };
}

import { useMemo } from "react";

function useBookingPrice(booking) {
  return useMemo(() => calculateTotalPrice(booking), [booking]);
}

export { calculateTotalPrice, useBookingPrice };

function getDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  while (current < endDate) {
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

  // Inicializa o mapa de ocupação dos quartos
  booking.rooms.forEach((room) => {
    roomOccupancy[room.id] = new Set();
  });

  // Marca ocupação do quarto baseado na estadia da pessoa
  function addPersonToRoom(person) {
    const roomId = person.room_id;
    const room = booking.rooms.find(r => r.id === roomId);
    if (!room || !person.check_in || !person.check_out) return;

    const range = getDateRange(new Date(person.check_in), new Date(person.check_out));
    range.forEach(date => roomOccupancy[roomId].add(date));
  }

  // Titular ocupa quarto
  if (booking.holder) {
    addPersonToRoom(booking.holder);
  }

  // Dependentes ocupam quarto
  booking.dependents?.forEach(dep => addPersonToRoom(dep));

  // Convidados ocupam quarto (mas pagam à parte)
  booking.guests?.forEach(guest => addPersonToRoom(guest));

  // Crianças não ocupam nem pagam (mudar se necessário)
  // booking.children?.forEach(child => addPersonToRoom(child));

  // Calcula diária dos quartos baseados em dias únicos ocupados
  Object.entries(roomOccupancy).forEach(([roomId, dates]) => {
    const room = booking.rooms.find(r => r.id === roomId);
    total += dates.size * Number(room.partner_booking_fee_per_day);
  });

  // Calcula valor dos convidados por dia
  booking.guests?.forEach((guest) => {
    const room = booking.rooms.find(r => r.id === guest.room_id);
    if (!room || !guest.check_in || !guest.check_out) return;

    const range = getDateRange(new Date(guest.check_in), new Date(guest.check_out));
    total += range.length * Number(room.partner_guest_fee_per_day);
  });

  return total;
}

// Exemplo de hook React que usa a função pura
import { useMemo } from "react";

function useBookingPrice(booking) {
  return useMemo(() => calculateTotalPrice(booking), [booking]);
}

export { calculateTotalPrice, useBookingPrice };

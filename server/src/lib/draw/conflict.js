function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function hasConflict(existingAllocations, newStart, newEnd) {
  for (const { check_in, check_out } of existingAllocations) {
    const existingStart = new Date(check_in);
    const existingEnd = new Date(check_out);

    const maintenanceBuffer = 1;
    const adjustedExistingStart = addDays(existingStart, -maintenanceBuffer);
    const adjustedExistingEnd = addDays(existingEnd, maintenanceBuffer);

    if (newStart <= adjustedExistingEnd && newEnd >= adjustedExistingStart) {
      return true;
    }
  }
  return false;
}

export function checkConflictsInsideDrawRooms(draw_rooms) {
  const roomsMap = new Map();

  for (const allocation of draw_rooms) {
    if (!roomsMap.has(allocation.room_id)) {
      roomsMap.set(allocation.room_id, []);
    }
    roomsMap.get(allocation.room_id).push(allocation);
  }

  let conflictsFound = false;

  for (const [roomId, allocations] of roomsMap.entries()) {
    allocations.sort((a, b) => new Date(a.check_in) - new Date(b.check_in));

    for (let i = 0; i < allocations.length; i++) {
      for (let j = i + 1; j < allocations.length; j++) {
        const a = allocations[i];
        const b = allocations[j];

        const startA = new Date(a.check_in);
        const endA = new Date(a.check_out);
        const startB = new Date(b.check_in);
        const endB = new Date(b.check_out);

        const maintenanceBuffer = 1;
        const adjustedEndA = addDays(endA, maintenanceBuffer);
        const adjustedStartB = addDays(startB, -maintenanceBuffer);

        if (!(adjustedStartB > adjustedEndA || endB < startA)) {
          conflictsFound = true;
          console.log(`⚠️ Conflito no quarto ${roomId}:`);
          console.log(`  - Alocação ${a.id} (${a.check_in} a ${a.check_out})`);
          console.log(`  - Alocação ${b.id} (${b.check_in} a ${b.check_out})`);
        }
      }
    }
  }

  if (!conflictsFound) {
    console.log("✅ Nenhum conflito interno encontrado entre as alocações.");
  }
}

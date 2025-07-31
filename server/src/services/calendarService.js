import * as calendarModel from '../models/calendarModel.js';

export async function findAllOccupations() {
  return calendarModel.findAllOccupations();
}

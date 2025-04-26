import * as paymentModel from '../models/paymentModel.js';

export async function createPayment(data) {
  return paymentModel.createPayment(data);
}

export async function updatePaymentStatus(id, status) {
  return paymentModel.updatePaymentStatus(id, status);
}

export async function findPaymentById(id) {
  return paymentModel.findPaymentById(id);
}

export async function findPaymentsByUser(id) {
  return paymentModel.findPaymentsByUser(id);
}

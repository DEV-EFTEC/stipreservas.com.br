import * as paymentModel from "#models/paymentModel.js";
import * as bookingModel from "#models/bookingModel.js";
import * as userModel from "#models/userModel.js";
import { apiAsaas } from "#lib/asaas.js";
import logger from "#core/logger.js";

export async function createCustomer(user) {
  const { id, name, cpf, email, mobile_phone } = user;
  const customer = await apiAsaas("/customers", {
    method: "POST",
    body: JSON.stringify({
      name,
      cpfCnpj: cpf,
      email,
      mobilePhone: mobile_phone,
      notificationDisabled: true,
    }),
  });

  return userModel.updateUser(id, { asaas_customer_id: customer.id });
}

async function createPaymentLink(
  customer_id,
  value,
  due_date,
  booking_id,
  user_id
) {
  try {
    const { id } = await apiAsaas("/lean/payments", {
      method: "POST",
      body: JSON.stringify({
        customer: customer_id,
        billingType: "PIX",
        value,
        dueDate: due_date,
      }),
    });

    paymentModel.createPayment({
      asaas_customer_id: customer_id,
      price: value,
      booking_id,
      user_id,
      asaas_payment_id: id,
      link: "",
    });

    return id;
  } catch (err) {
    logger.error(err);
    throw err; // ou return { error: true, message: err.message }
  }
}

async function findPaymentById(id) {
  return apiAsaas(`/payments/${id}/pixQrCode`, {
    method: "GET",
  });
}

export async function createPayment(booking_id, user_id, value, due_date) {
  const user = await paymentModel.findCustomerIdByUser(user_id);

  try {
    if (user.asaas_customer_id.length > 0) {
      const payment_id = await createPaymentLink(
        user.asaas_customer_id,
        value,
        due_date.split("T")[0],
        booking_id,
        user_id
      );
      const payment = await findPaymentById(payment_id);

      return payment;
    } else {
      const { asaas_customer_id } = await createCustomer(user);
      const payment_id = await createPaymentLink(
        asaas_customer_id,
        value,
        due_date,
        booking_id,
        user_id
      );
      const payment = await findPaymentById(payment_id);

      return payment;
    }
  } catch (err) {
    return logger.error(err);
  }
}

export async function updatePaymentStatus(id, status) {
  return paymentModel.updatePaymentStatus(id, status);
}

export async function findPaymentsByUser(id) {
  return paymentModel.findPaymentsByUser(id);
}

export async function findPaymentByBooking(id) {
  const payment = await paymentModel.findPaymentByBooking(id);

  return findPaymentById(payment.asaas_payment_id);
}

export async function getCustomerIdByUser(id) {
  return paymentModel.findCustomerIdByUser(id);
}

export async function updatePaymentByAsaasPaymentId(id, status) {
  return paymentModel.updatePaymentByAsaasPaymentId(id, status);
}

export async function refundPayment(booking_id) {
  try {
    const { asaas_payment_id, user_id } =
      await paymentModel.findPaymentByBooking(booking_id);

    const refund = await apiAsaas(`/payments/${asaas_payment_id}/refund`, {
      method: "POST",
    });

    paymentModel.updatePaymentByAsaasPaymentId(asaas_payment_id, { status_role: "refund_solicitation" });
    bookingModel.updateBooking(booking_id, { status: "refund_solicitation" });

    return { ...refund, user_id };
  } catch (err) {
    return logger.error(err);
  }
}

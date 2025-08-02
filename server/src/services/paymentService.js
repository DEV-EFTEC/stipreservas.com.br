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
  action_id,
  user_id,
  table
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

    const mock =
      table === "payments"
        ? {
            asaas_customer_id: customer_id,
            price: value,
            booking_id: action_id,
            user_id,
            asaas_payment_id: id,
            link: "",
          }
        : {
            asaas_customer_id: customer_id,
            price: value,
            draw_id: action_id,
            user_id,
            asaas_payment_id: id,
            link: "",
          };

    paymentModel.createPayment(table, mock);

    return id;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

async function findPaymentById(id) {
  return apiAsaas(`/payments/${id}/pixQrCode`, {
    method: "GET",
  });
}

export async function createPayment(table, mock) {
  const { booking_id, user_id, value, due_date } = mock;
  const user = await paymentModel.findCustomerIdByUser(user_id);

  console.log("===========")
  console.log(user)

  try {
    if (user.asaas_customer_id && user.asaas_customer_id.trim() !== "") {
      const payment_id = await createPaymentLink(
        user.asaas_customer_id,
        value,
        due_date.split("T")[0],
        booking_id,
        user_id,
        table
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
        user_id,
        table
      );
      const payment = await findPaymentById(payment_id);

      return payment;
    }
  } catch (err) {
    return logger.error(err);
  }
}

export async function updatePaymentStatus(id, table, status) {
  return paymentModel.updatePaymentStatus(id, table, status);
}

export async function findPaymentsByUser(id, table) {
  return paymentModel.findPaymentsByUser(id, table);
}

export async function findPaymentByBooking(id) {
  const payment = await paymentModel.findPaymentByBooking(id);

  return findPaymentById(payment.asaas_payment_id);
}

export async function findPaymentByDraw(id) {
  const payment = await paymentModel.findPaymentByDraw(id);

  return findPaymentById(payment.asaas_payment_id);
}

export async function getCustomerIdByUser(id) {
  return paymentModel.findCustomerIdByUser(id);
}

export async function updatePaymentByAsaasPaymentId(id, table, status) {
  return paymentModel.updatePaymentByAsaasPaymentId(id, table, status);
}

export async function refundPayment(id, table) {
  try {
    const { asaas_payment_id } =
      await paymentModel.findPaymentByBooking(id);

    paymentModel.updatePaymentByAsaasPaymentId(asaas_payment_id, table, {
      status_role: "refund_solicitation",
    });

    bookingModel.updateBooking(id, { status: "refund_solicitation" });

    const asaas = await apiAsaas(`/payments/${asaas_payment_id}/refund`, {
      method: "POST",
    });

    return { booking_id: id, status: 'refund_solicitation', asaas };
  } catch (err) {
    return logger.error(err);
  }
}

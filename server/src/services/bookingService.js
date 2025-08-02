import { Resend } from "resend";
import * as userModel from "../models/userModel.js";
import * as bookingModel from "../models/bookingModel.js";
import * as dependentsModel from "#models/dependentsModel.js";
import * as guestsModel from "#models/guestsModel.js";
import * as childrenModel from "#models/childrenModel.js";
import * as holderModel from "#models/holderModel.js";
import * as paymentService from "#services/paymentService.js";
import _ from "lodash";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API);

export async function findBookingById(id) {
  const booking = await bookingModel.findBookingById(id);
  return booking || null;
}

export async function getBookingByUser(userId) {
  const bookings = await bookingModel.findBookingsByUser(userId);
  return bookings || [];
}

export async function findBookingsByUser(userId, page, limit) {
  const newPage = parseInt(page) || 1;
  const newLimit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const bookings = await bookingModel.findBookingsByUser(
    userId,
    newLimit,
    offset
  );
  const [{ count }] = await bookingModel.bookingCountByUser(userId);
  return {
    data: bookings,
    pagination: {
      total: parseInt(count),
      page: newPage,
      limit: newLimit,
      total_pages: Math.ceil(count / newLimit),
    },
  };
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
  if (userType === "admin") {
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
        total_pages: Math.ceil(count / newLimit),
      },
    };
  } else {
    throw new Error("Não autorizado");
  }
}

export async function createParticipantsBooking(
  children,
  guests,
  dependents,
  holders
) {
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

export async function updateParticipantsBooking(
  booking_id,
  children,
  guests,
  dependents,
  holders
) {
  const tasks = [];

  if (children.length > 0) {
    const childrenUpdates = children.map((child) =>
      childrenModel.updateChildByBooking({
        child_id: child.id,
        check_in: child.check_in,
        check_out: child.check_out,
        room_id: child.room_id,
        booking_id,
      })
    );
    tasks.push(...childrenUpdates);
  }

  if (guests.length > 0) {
    const guestsUpdates = guests.map((guest) =>
      guestsModel.updateGuestsByBooking({
        guest_id: guest.id,
        check_in: guest.check_in,
        check_out: guest.check_out,
        room_id: guest.room_id,
        booking_id,
      })
    );
    tasks.push(...guestsUpdates);
  }

  if (dependents.length > 0) {
    const dependentsUpdates = dependents.map((dep) =>
      dependentsModel.updateDependentsByBooking({
        dependent_id: dep.id,
        check_in: dep.check_in,
        check_out: dep.check_out,
        room_id: dep.room_id,
        booking_id,
      })
    );
    tasks.push(...dependentsUpdates);
  }

  if (holders.length > 0) {
    const holdersUpdates = holders.map((hol) =>
      holderModel.updateHoldersByBooking({
        holder_id: hol.id,
        check_in: hol.check_in,
        check_out: hol.check_out,
        room_id: hol.room_id,
        booking_id,
      })
    );
    tasks.push(...holdersUpdates);
  }

  return await Promise.all(tasks);
}

export async function approveBooking(id, user_id, value) {
  const booking = await bookingModel.findBookingById(id);
  const user = await userModel.findUserById(user_id);
  const { data, error } = await resend.emails.send({
    from: "STIP reservas <info@stip-reservas.com.br>",
    to: [user.email],
    subject: "Sua solicitação de reserva foi aprovada!",
    html: `<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Reserva Aprovada</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #00598a;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header img {
        height: 50px;
      }
      h1 {
        font-size: 24px;
        color: #fff;
        text-align: center;
      }
      p {
        font-size: 14px;
        color: #ffffff;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        margin: 20px 0;
        background-color: #00bcff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        font-size: 14px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #ffffff50;
        text-align: center;
      }
      a {
          color: #00bcff;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://firebasestorage.googleapis.com/v0/b/stip-reservas.firebasestorage.app/o/documents%2Femail-items%2Fstip-reservas-logo.png?alt=media&token=022056f8-a52b-4e41-bf07-8391264d5463" alt="Logo Sindicato" />
      </div>

      <h1>Sua reserva foi aprovada!</h1>

      <p>Olá <strong>${user.name}</strong>,</p>

      <p>
        A sua solicitação de reserva <strong>#${booking.id.slice(0, 8)}</strong> foi
        <strong>aprovada</strong> com sucesso. Você já pode se preparar para aproveitar sua estadia em nossa sede!
      </p>

      <p>
        Você pode visualizar os detalhes da sua reserva acessando a área do associado:
      </p>

      <p style="text-align: center">
        <a href="${process.env.CLIENT_URL}/associado/home" class="button">Ver minha reserva</a>
      </p>

      <p>
        Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:<br />
        <a href="${process.env.CLIENT_URL}/associado/home">${process.env.CLIENT_URL}/associado/home</a>
      </p>

      <div class="footer">
        Esta é uma mensagem automática. Por favor, não responda este e-mail.
      </div>
    </div>
  </body>
</html>
`,
  });

  if (data) {
    const booking = await bookingModel.approveBooking(id);
    const payment = await paymentService.createPayment("payments", {
      booking_id: id,
      user_id: user_id,
      value: 5.0,
      due_date: booking.expires_at.toISOString().split("T")[0],
    });

    return { booking, payment };
  } else {
    return error;
  }
}

export async function refuseBooking(id, user_id, justification) {
  const booking = await bookingModel.findBookingById(id);
  const user = await userModel.findUserById(user_id);
  const { data, error } = await resend.emails.send({
    from: "STIP reservas <info@stip-reservas.com.br>",
    to: [user.email],
    subject: "Sua solicitação de reserva foi recusada",
    html: `<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Reserva recusada</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #00598a;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header img {
        height: 50px;
      }
      h1 {
        font-size: 24px;
        color: #fff;
        text-align: center;
      }
      p {
        font-size: 14px;
        color: #ffffff;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        margin: 20px 0;
        background-color: #00bcff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        font-size: 14px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #ffffff50;
        text-align: center;
      }
      a {
          color: #00bcff;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://firebasestorage.googleapis.com/v0/b/stip-reservas.firebasestorage.app/o/documents%2Femail-items%2Fstip-reservas-logo.png?alt=media&token=022056f8-a52b-4e41-bf07-8391264d5463" alt="Logo Sindicato" />
      </div>

      <h1>Infelizmente sua solicitação não foi aprovada.</h1>

      <p>Olá <strong>${user.name}</strong>,</p>

      <p>
        A sua solicitação de reserva <strong>#${booking.id.slice(0, 8)}</strong> foi
        <strong>recusada</strong>. Deixamos uma justificativa para que você possa realizar a alteração para que sua reserva seja aprovada.
      </p>

      <p>
        Você tem 24 horas após o envio dessa mensagem para realizar as alterações necessárias, após esse período sua solicitação será cancelada automaticamente e você terá de iniciar uma nova solicitação.
      </p>

      <p>
        Você pode visualizar os detalhes da sua reserva acessando a área do associado:
      </p>

      <p style="text-align: center">
        <a href="${process.env.CLIENT_URL}/associado/home" class="button">Ver minha reserva</a>
      </p>

      <p>
        Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:<br />
        <a href="${process.env.CLIENT_URL}/associado/home">${process.env.CLIENT_URL}/associado/home</a>
      </p>

      <div class="footer">
        Esta é uma mensagem automática. Por favor, não responda este e-mail.
      </div>
    </div>
  </body>
</html>
`,
  });

  if (data) {
    const booking = await bookingModel.refuseBooking(id);

    await bookingModel.updateBooking(id, { justification });

    return { booking };
  } else {
    return error;
  }
}

export async function updateParticipants(
  booking_id,
  children,
  guests,
  dependents,
  word_card_file_status,
  receipt_picture_status
) {
  const tasks = [];

  if (children.length > 0) {
    const childrenUpdates = children.map((child) =>
      childrenModel.updateChild(child.id, {
        document_picture_status: child.document_picture_status,
        medical_report_status: child.medical_report_status,
      })
    );
    tasks.push(...childrenUpdates);
  }

  if (guests.length > 0) {
    const guestsUpdates = guests.map((guest) =>
      guestsModel.updateGuest(guest.id, {
        document_picture_status: guest.document_picture_status,
        medical_report_status: guest.medical_report_status,
      })
    );
    tasks.push(...guestsUpdates);
  }

  if (dependents.length > 0) {
    const dependentsUpdates = dependents.map((dep) =>
      dependentsModel.updateDependent(dep.id, {
        document_picture_status: dep.document_picture_status,
        medical_report_status: dep.medical_report_status,
      })
    );
    tasks.push(...dependentsUpdates);
  }

  await bookingModel.updateBooking(booking_id, {
    word_card_file_status: word_card_file_status,
    receipt_picture_status: receipt_picture_status,
  });

  return await Promise.all(tasks);
}

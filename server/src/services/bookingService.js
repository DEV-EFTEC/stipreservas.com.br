import { Resend } from "resend";
import * as userModel from "../models/userModel.js";
import * as bookingModel from "../models/bookingModel.js";
import * as dependentsModel from "#models/dependentsModel.js";
import * as guestsModel from "#models/guestsModel.js";
import * as childrenModel from "#models/childrenModel.js";
import * as holderModel from "#models/holderModel.js";
import * as paymentService from "#services/paymentService.js";
import _ from "lodash";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API);

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
    from: "STIP reservas <contato@eftecnologia.com>",
    to: [user.email],
    subject: "Sua solicitação de reserva foi aprovada!",
    html: `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="pt">
      <head>
        <link
          rel="preload"
          as="image"
          href="https://react-email-demo-8xz019qmh-resend.vercel.app/static/vercel-logo.png" />
        <link
          rel="preload"
          as="image"
          href="https://react-email-demo-8xz019qmh-resend.vercel.app/static/vercel-user.png" />
        <link
          rel="preload"
          as="image"
          href="https://react-email-demo-8xz019qmh-resend.vercel.app/static/vercel-arrow.png" />
        <link
          rel="preload"
          as="image"
          href="https://react-email-demo-8xz019qmh-resend.vercel.app/static/vercel-team.png" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
        <!--$-->
      </head>
      <body
        style='margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);padding-left:0.5rem;padding-right:0.5rem;font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'>
        <div
          style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0"
          data-skip-in-text="true">
          Join Alan on Vercel
          <div>

          </div>
        </div>
        <table
          align="center"
          width="100%"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;max-width:465px;border-radius:0.25rem;border-width:1px;border-color:rgb(234,234,234);border-style:solid;padding:20px">
          <tbody>
            <tr style="width:100%">
              <td>
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="margin-top:32px">
                  <tbody>
                    <tr>
                      <td>
                        <img
                          alt="Vercel Logo"
                          height="37"
                          src="https://react-email-demo-8xz019qmh-resend.vercel.app/static/vercel-logo.png"
                          style="margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px;display:block;outline:none;border:none;text-decoration:none"
                          width="40" />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h1
                  style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-weight:400;font-size:24px;color:rgb(0,0,0)">
                  Sua reserva foi aprovada!
                </h1>
                <p
                  style="font-size:14px;color:rgb(0,0,0);line-height:24px;margin-top:16px;margin-bottom:16px">
                  Hello
                  <!-- -->${user.name}<!-- -->,
                </p>
                <p
                  style="font-size:14px;color:rgb(0,0,0);line-height:24px;margin-top:16px;margin-bottom:16px">
                  <strong>${user.name.split(" ")[0]}</strong> (<a
                    href="mailto:${user.email}"
                    style="color:rgb(37,99,235);text-decoration-line:none"
                    target="_blank"
                    >${user.email}</a
                  >) sua solicitação de reserva <strong>#${booking.id.slice(0, 8)}</strong> foi aprovada!<!-- -->
                  <strong>Vercel</strong>.
                </p>
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation">
                  <tbody>
                    <tr>
                      <td>
                        <table
                          align="center"
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation">
                          <tbody style="width:100%">
                            <tr style="width:100%">
                              <td align="right" data-id="__react-email-column">
                                <img
                                  alt="alanturing&#x27;s profile picture"
                                  height="64"
                                  src="https://react-email-demo-8xz019qmh-resend.vercel.app/static/vercel-user.png"
                                  style="border-radius:9999px;display:block;outline:none;border:none;text-decoration:none"
                                  width="64" />
                              </td>
                              <td align="center" data-id="__react-email-column">
                                <img
                                  alt="Arrow indicating invitation"
                                  height="9"
                                  src="https://react-email-demo-8xz019qmh-resend.vercel.app/static/vercel-arrow.png"
                                  style="display:block;outline:none;border:none;text-decoration:none"
                                  width="12" />
                              </td>
                              <td align="left" data-id="__react-email-column">
                                <img
                                  alt="Enigma team logo"
                                  height="64"
                                  src="https://react-email-demo-8xz019qmh-resend.vercel.app/static/vercel-team.png"
                                  style="border-radius:9999px;display:block;outline:none;border:none;text-decoration:none"
                                  width="64" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="margin-top:32px;margin-bottom:32px;text-align:center">
                  <tbody>
                    <tr>
                      <td>
                        <a
                          href="https://vercel.com"
                          style="border-radius:0.25rem;background-color:rgb(0,0,0);padding-left:1.25rem;padding-right:1.25rem;padding-top:0.75rem;padding-bottom:0.75rem;text-align:center;font-weight:600;font-size:12px;color:rgb(255,255,255);text-decoration-line:none;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:12px 20px 12px 20px"
                          target="_blank"
                          ><span
                            ><!--[if mso]><i style="mso-font-width:500%;mso-text-raise:18" hidden>&#8202;&#8202;</i><![endif]--></span
                          ><span
                            style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px"
                            >Join the team</span
                          ><span
                            ><!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span
                          ></a
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p
                  style="font-size:14px;color:rgb(0,0,0);line-height:24px;margin-top:16px;margin-bottom:16px">
                  ou copie e cole essa URL no seu navegador:<!-- -->
                  <a
                    href=${process.env.CLIENT_URL + "/associado/home"}
                    style="color:rgb(37,99,235);text-decoration-line:none"
                    target="_blank"
                    >${process.env.CLIENT_URL}</a
                  >
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <!--/$-->
      </body>
    </html>
    `,
  });

  if (data) {
    const booking = await bookingModel.approveBooking(id);
    const payment = await paymentService.createPayment(
      id,
      user_id,
      value,
      booking.expires_at.toISOString().split('T')[0]
    );

    return { booking, payment };
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

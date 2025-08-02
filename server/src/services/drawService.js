import { Resend } from "resend";
import * as drawModel from "#models/drawModel.js";
import * as roomModel from "#models/roomModel.js";
import * as childrenModel from "#models/childrenModel.js";
import * as guestsModel from "#models/guestsModel.js";
import * as dependentsModel from "#models/dependentsModel.js";
import * as holderModel from "#models/holderModel.js";
import * as userModel from "#models/userModel.js";
import {
  hasConflict,
  checkConflictsInsideDrawRooms,
} from "#lib/draw/conflict.js";
import _ from "lodash";
import dotenv from "dotenv";
import { format } from "date-fns";

dotenv.config();
const resend = new Resend(process.env.RESEND_API);

export async function getDrawById(id) {
  const booking = await drawModel.getDrawById(id);
  return booking || null;
}

export async function createDraw(drawData) {
  return await drawModel.createDraw(drawData);
}

export async function updateDraw(id, data) {
  return await drawModel.updateDraw(id, data);
}

export async function updateDrawApply(id, data) {
  return await drawModel.updateDrawApply(id, data);
}

export async function deleteDraw(id) {
  return await drawModel.deleteDraw(id);
}

export async function findDrawsByUser(userId, page, limit) {
  const newPage = parseInt(page) || 1;
  const newLimit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const draws = await drawModel.findDrawsByUser(userId, newLimit, offset);
  const [{ count }] = await drawModel.drawCountByUser(userId);
  return {
    data: draws,
    pagination: {
      total: parseInt(count),
      page: newPage,
      limit: newLimit,
      total_pages: Math.ceil(count / newLimit),
    },
  };
}

export async function getAllDraws(page, limit) {
  const newPage = parseInt(page) || 1;
  const newLimit = parseInt(limit) || 10;

  const offset = (page - 1) * limit;

  const draws = await drawModel.getAllDraws(newLimit, offset);
  const [{ count }] = await drawModel.drawCount();
  return {
    data: draws,
    pagination: {
      total: parseInt(count),
      page: newPage,
      limit: newLimit,
      total_pages: Math.ceil(count / newLimit),
    },
  };
}

export async function getDrawParticipants(page, limit, id) {
  const newPage = parseInt(page) || 1;
  const newLimit = parseInt(limit) || 10;

  const offset = (page - 1) * limit;

  const drawsApplies = await drawModel.getDrawParticipants(
    newLimit,
    offset,
    id
  );
  const [{ count }] = await drawModel.drawAppliesCount(id);
  return {
    data: drawsApplies,
    pagination: {
      total: parseInt(count),
      page: newPage,
      limit: newLimit,
      total_pages: Math.ceil(count / newLimit),
    },
  };
}

export async function getDrawByDate(start_date, end_date) {
  return await drawModel.getDrawByDate(start_date, end_date);
}

export async function run(draw_id) {
  const draw = await drawModel.getDrawById(draw_id);
  const draw_applications = await drawModel.findDrawApplicationsById(draw_id);
  const draw_applies_scrambled = _.shuffle(draw_applications);
  const draw_rooms = await drawModel.findDrawRooms(
    draw.start_period_date,
    draw.end_period_date
  );
  const selectedRooms = await roomModel.findRoomsForDraw();
  const allocated = [];
  const notAllocated = [];

  selectedRooms.sort((a, b) => a.capacity - b.capacity);

  for (const application of draw_applies_scrambled) {
    const newStart = new Date(application.check_in);
    const newEnd = new Date(application.check_out);

    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
      console.warn(`⚠️ Data inválida para aplicação ${application.id}`);
      continue;
    }

    let wasAllocated = false;
    const totalPeople =
      (application.guests || 0) +
      (application.dependents || 0) +
      (application.children || 0) +
      1;

    for (const room of selectedRooms) {
      if (totalPeople > room.capacity) continue;

      if (totalPeople > 4 && room.capacity < 6) continue;

      const allocations = draw_rooms.filter((dr) => dr.room_id === room.id);

      if (!hasConflict(allocations, newStart, newEnd)) {
        const data = {
          room_id: room.id,
          draw_apply_id: application.id,
          check_in: application.check_in,
          check_out: application.check_out,
        };
        const createdDrawRoom = await drawModel.createDrawRoom(data);
        draw_rooms.push({
          id: createdDrawRoom.id,
          ...data,
        });
        const { name, email } = await userModel.findUserById(
          application.created_by
        );
        allocated.push({
          ...application,
          user_name: name,
          user_email: email,
          room,
        });
        wasAllocated = true;
        break;
      }
    }

    if (!wasAllocated) {
      const { name, email } = await userModel.findUserById(
        application.created_by
      );
      notAllocated.push({
        ...application,
        user_name: name,
        user_email: email,
      });
    }
  }

  checkConflictsInsideDrawRooms(draw_rooms);

  for (const drawn of allocated) {
    await drawModel.updateDrawApply(drawn.id, { status: "drawn" });

    await resend.emails.send({
      from: "STIP reservas <info@stip-reservas.com.br>",
      to: "dev@eftecnologia.com",
      subject: "🎉 Você foi contemplado no sorteio!",
      html: `
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Sorteio Contemplado</title>
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

      <h1>Resultado do sorteio</h1>

      <p>Olá <strong>${drawn.user_name}</strong>,</p>

      <p>
        Sua inscrição para o sorteio foi <strong>contemplada</strong>!<br />
        Você foi alocado no quarto <strong>${drawn.room.number}</strong> para o período de
        <strong>${format(drawn.check_in, "dd/MM/yyyy")}</strong> até <strong>${format(drawn.check_out, "dd/MM/yyyy")}</strong>.
      </p>

      <p>
        Você tem 48 horas após a realização do sorteio para realizar o pagamento. Lembrando que não haverá reembolso no cancelamento após a confirmação de pagamento. Acesse a área do associado para ver os detalhes completos da sua estadia:
      </p>

      <p style="text-align: center">
        <a href="${process.env.CLIENT_URL}/associado/home" class="button">Ver detalhes</a>
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
  }

  for (const not_drawn of notAllocated) {
    await drawModel.updateDrawApply(not_drawn.id, { status: "not_drawn" });
    await resend.emails.send({
      from: "STIP reservas <info@stip-reservas.com.br>",
      to: "dev@eftecnologia.com",
      subject: "Resultado do sorteio",
      html: `
      <!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Sorteio Contemplado</title>
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

      <h1>Resultado do sorteio</h1>

      <p>Olá <strong>${not_drawn.user_name}</strong>,</p>

      <p>
        Infelizmente sua inscrição para o sorteio não foi contemplada.
        Fique atento aos próximos sorteios para garantir sua inscrição!
      </p>

      <div class="footer">
        Esta é uma mensagem automática. Por favor, não responda este e-mail.
      </div>
    </div>
  </body>
</html>
      `,
    });
  }

  await drawModel.updateDraw(draw_id, { status: 'concluded' });

  return {
    success: true,
    total_applications: draw_applications.length,
    total_allocated: allocated.length,
    total_not_allocated: notAllocated.length,
    allocated_applications: allocated,
    not_allocated_applications: notAllocated,
  };
}

export async function rerun(draw_id) {
  const draw = await drawModel.getDrawById(draw_id);
  const draw_applications = await drawModel.findDrawApplicationsNotDrawById(draw_id);
  const draw_applies_scrambled = _.shuffle(draw_applications);
  const draw_rooms = await drawModel.findDrawRooms(
    draw.start_period_date,
    draw.end_period_date
  );
  const selectedRooms = await roomModel.findRoomsForDraw();
  const allocated = [];
  const notAllocated = [];

  selectedRooms.sort((a, b) => a.capacity - b.capacity);

  for (const application of draw_applies_scrambled) {
    const newStart = new Date(application.check_in);
    const newEnd = new Date(application.check_out);

    if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
      console.warn(`⚠️ Data inválida para aplicação ${application.id}`);
      continue;
    }

    let wasAllocated = false;
    const totalPeople =
      (application.guests || 0) +
      (application.dependents || 0) +
      (application.children || 0) +
      1;

    for (const room of selectedRooms) {
      if (totalPeople > room.capacity) continue;

      if (totalPeople > 4 && room.capacity < 6) continue;

      const allocations = draw_rooms.filter((dr) => dr.room_id === room.id);

      if (!hasConflict(allocations, newStart, newEnd)) {
        const data = {
          room_id: room.id,
          draw_apply_id: application.id,
          check_in: application.check_in,
          check_out: application.check_out,
        };
        const createdDrawRoom = await drawModel.createDrawRoom(data);
        draw_rooms.push({
          id: createdDrawRoom.id,
          ...data,
        });
        const { name, email } = await userModel.findUserById(
          application.created_by
        );
        allocated.push({
          ...application,
          user_name: name,
          user_email: email,
          room,
        });
        wasAllocated = true;
        break;
      }
    }

    if (!wasAllocated) {
      const { name, email } = await userModel.findUserById(
        application.created_by
      );
      notAllocated.push({
        ...application,
        user_name: name,
        user_email: email,
      });
    }
  }

  checkConflictsInsideDrawRooms(draw_rooms);

  for (const drawn of allocated) {
    await drawModel.updateDrawApply(drawn.id, { status: "drawn" });

    await resend.emails.send({
      from: "STIP reservas <info@stip-reservas.com.br>",
      to: "dev@eftecnologia.com",
      subject: "🎉 Você foi contemplado no re-sorteio!",
      html: `
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Sorteio Contemplado</title>
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

      <h1>Resultado do re-sorteio</h1>

      <p>Olá <strong>${drawn.user_name}</strong>,</p>

      <p>
        Sua inscrição para o sorteio foi <strong>contemplada</strong> no nosso re-sorteio!<br />
        Você foi alocado no quarto <strong>${drawn.room.number}</strong> para o período de
        <strong>${format(drawn.check_in, "dd/MM/yyyy")}</strong> até <strong>${format(drawn.check_out, "dd/MM/yyyy")}</strong>.
      </p>

      <p>
        Você tem 24 horas após a realização do sorteio para realizar o pagamento. Lembrando que não haverá reembolso no cancelamento após a confirmação de pagamento. Acesse a área do associado para ver os detalhes completos da sua estadia:
      </p>

      <p style="text-align: center">
        <a href="${process.env.CLIENT_URL}/associado/home" class="button">Ver detalhes</a>
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
  }

  for (const not_drawn of notAllocated) {
    await drawModel.updateDrawApply(not_drawn.id, { status: "not_drawn" });
    await resend.emails.send({
      from: "STIP reservas <info@stip-reservas.com.br>",
      to: "dev@eftecnologia.com",
      subject: "Resultado do re-sorteio",
      html: `
      <!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Sorteio não contemplado</title>
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

      <h1>Resultado do sortieo</h1>

      <p>Olá <strong>${not_drawn.user_name}</strong>,</p>

      <p>
        Infelizmente sua inscrição para o sorteio não foi contemplada.
        Fique atento aos próximos sorteios para garantir sua inscrição!
      </p>

      <div class="footer">
        Esta é uma mensagem automática. Por favor, não responda este e-mail.
      </div>
    </div>
  </body>
</html>
      `,
    });
  }

  return {
    success: true,
    total_applications: draw_applications.length,
    total_allocated: allocated.length,
    total_not_allocated: notAllocated.length,
    allocated_applications: allocated,
    not_allocated_applications: notAllocated,
  };
}

export async function getDrawApplyComplete(id) {
  return await drawModel.getDrawApplyComplete(id);
}

export async function createParticipantsDraw(
  children,
  guests,
  dependents,
  holders
) {
  const tasks = [];

  if (children.length > 0) {
    tasks.push(childrenModel.createChildByDraw(children));
  }

  if (guests.length > 0) {
    tasks.push(guestsModel.createGuestByDraw(guests));
  }

  if (dependents.length > 0) {
    tasks.push(dependentsModel.createDependentByDraw(dependents));
  }

  if (holders.length > 0) {
    tasks.push(holderModel.createHolderByDraw(holders));
  }

  return await Promise.all(tasks);
}

export async function updateParticipantsDraw(
  draw_apply_id,
  children,
  guests,
  dependents,
  holders
) {
  const tasks = [];

  if (children.length > 0) {
    const childrenUpdates = children.map((child) =>
      childrenModel.updateChildByDraw({
        child_id: child.id,
        draw_apply_id,
      })
    );
    tasks.push(...childrenUpdates);
  }

  if (guests.length > 0) {
    const guestsUpdates = guests.map((guest) =>
      guestsModel.updateGuestsByDraw({
        guest_id: guest.id,
        draw_apply_id,
      })
    );
    tasks.push(...guestsUpdates);
  }

  if (dependents.length > 0) {
    const dependentsUpdates = dependents.map((dep) =>
      dependentsModel.updateDependentsByDraw({
        dependent_id: dep.id,
        draw_apply_id,
      })
    );
    tasks.push(...dependentsUpdates);
  }

  if (holders.length > 0) {
    const holdersUpdates = holders.map((hol) =>
      holderModel.updateHoldersByBooking({
        holder_id: hol.id,
        draw_apply_id,
      })
    );
    tasks.push(...holdersUpdates);
  }

  return await Promise.all(tasks);
}

export async function createDrawApply(applyData) {
  return await drawModel.createDrawApply(applyData);
}

export async function updateParticipants(
  draw_id,
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

  await bookingModel.updateBooking(draw_id, {
    word_card_file_status: word_card_file_status,
    receipt_picture_status: receipt_picture_status,
  });

  return await Promise.all(tasks);
}

export async function approveDraw(id, user_id) {
  const draw = await drawModel.findDrawById(id);
  const user = await userModel.findUserById(user_id);
  const { data, error } = await resend.emails.send({
    from: "STIP reservas <info@stip-reservas.com.br>",
    to: [user.email],
    subject: "Sua inscrição para o sortieo foi aprovada!",
    html: `<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Inscrição Aprovada</title>
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

      <h1>Sua inscrição foi aprovada!</h1>

      <p>Olá <strong>${user.name}</strong>,</p>

      <p>
        A sua inscrição <strong>#${draw.id.slice(0, 8)}</strong> para o sorteio foi
        <strong>aprovada</strong> com sucesso. Agora é só aguardar a data do sorteio!
      </p>

      <p>
        Você pode visualizar os detalhes da sua inscrição acessando a área do associado:
      </p>

      <p style="text-align: center">
        <a href="${process.env.CLIENT_URL}/associado/home" class="button">Ver minha inscrição</a>
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
    const draw = await drawModel.approveDraw(id);

    return { draw };
  } else {
    return error;
  }
}

export async function refuseDraw(id, user_id, justification) {
  const draw = await drawModel.findDrawById(id);
  const user = await userModel.findUserById(user_id);
  const { data, error } = await resend.emails.send({
    from: "STIP reservas <info@stip-reservas.com.br>",
    to: [user.email],
    subject: "Sua inscrição para o sorteio foi recusada.",
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

      <h1>Infelizmente sua inscrição não foi aprovada.</h1>

      <p>Olá <strong>${user.name}</strong>,</p>

      <p>
        A sua inscrição <strong>#${draw.id.slice(0, 8)}</strong> para o sorteio foi
        <strong>recusada</strong>. Deixamos uma justificativa para que você possa realizar a alteração para que sua inscrição seja aprovada.
      </p>

      <p>
        Você tem 24 horas após o envio dessa mensagem para realizar as alterações necessárias, após esse período sua inscrição será cancelada automaticamente e você terá de iniciar uma nova inscrição.
      </p>

      <p>
        Você pode visualizar os detalhes da sua inscrição acessando a área do associado:
      </p>

      <p style="text-align: center">
        <a href="${process.env.CLIENT_URL}/associado/home" class="button">Ver minha inscrição</a>
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
    const draw = await drawModel.refuseDraw(id);

    await drawModel.updateDraw(id, { justification });

    return { draw };
  } else {
    return error;
  }
}

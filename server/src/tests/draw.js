import { rooms } from "./rooms.js";
import _ from "lodash";
import fs from "fs";

// Configurações do sorteio
const startDate = new Date("2025-07-07");
const endDate = new Date("2025-07-13");
const drawId = _.uniqueId("draw_");

const draw = {
  id: drawId,
  start_period_date: startDate.toISOString().slice(0, 10),
  end_period_date: endDate.toISOString().slice(0, 10),
};

// Funções auxiliares
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateInRange(start, end) {
  const range = end.getTime() - start.getTime();
  const offset = Math.floor(Math.random() * range);
  return new Date(start.getTime() + offset);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function hasConflict(existingAllocations, newStart, newEnd) {
  for (const { check_in, check_out } of existingAllocations) {
    const existingStart = new Date(check_in);
    const existingEnd = new Date(check_out);

    // Regra de 1 dia de manutenção: check_in novo só pode acontecer 1 dia após o check_out anterior
    const maintenanceBuffer = 1;
    const adjustedExistingStart = addDays(existingStart, -maintenanceBuffer);
    const adjustedExistingEnd = addDays(existingEnd, maintenanceBuffer);

    if (newStart <= adjustedExistingEnd && newEnd >= adjustedExistingStart) {
      return true;
    }
  }
  return false;
}

// Função para verificar conflitos internos no draw_rooms
function checkConflictsInsideDrawRooms(draw_rooms) {
  // Agrupa por quarto
  const roomsMap = new Map();

  for (const allocation of draw_rooms) {
    if (!roomsMap.has(allocation.room_id)) {
      roomsMap.set(allocation.room_id, []);
    }
    roomsMap.get(allocation.room_id).push(allocation);
  }

  let conflictsFound = false;

  for (const [roomId, allocations] of roomsMap.entries()) {
    // Ordena por check_in para facilitar a comparação
    allocations.sort((a, b) => new Date(a.check_in) - new Date(b.check_in));

    for (let i = 0; i < allocations.length; i++) {
      for (let j = i + 1; j < allocations.length; j++) {
        const a = allocations[i];
        const b = allocations[j];

        const startA = new Date(a.check_in);
        const endA = new Date(a.check_out);
        const startB = new Date(b.check_in);
        const endB = new Date(b.check_out);

        // Mesma regra de manutenção: um deve respeitar 1 dia entre o check_out e próximo check_in
        const maintenanceBuffer = 1;
        const adjustedEndA = addDays(endA, maintenanceBuffer);
        const adjustedStartB = addDays(startB, -maintenanceBuffer);

        // Detecta conflito
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

// Dados base
const names = [
  "Antônio",
  "Beatriz",
  "Carlos",
  "Daniella",
  "Emanuel",
  "Fernanda",
  "Geraldo",
  "Hillary",
  "Ivan",
  "Joana",
  "Kevin",
  "Laura",
  "Manoel",
  "Natalie",
  "Osvaldo",
  "Pietra",
  "Quinn",
  "Rosanna",
  "Samuel",
  "Tatiana",
  "Ulisses",
  "Vanessa",
  "Wallace",
  "Xandra",
  "Yago",
  "Zoe",
  "Arnaldo",
  "Bruna",
  "Cedric",
  "Denise",
  "Emilio",
  "Fabiana",
  "Gilberto",
  "Heloisa",
  "Italo",
  "Jaqueline",
  "Kaua",
  "Lorena",
  "Mason",
];
const shuffledNames = _.shuffle(names);

const draw_applications = []; // pega todas as inscrições
const draw_rooms = []; // pega todas as inscrições que foram sorteadas e alocadas em um quarto
const blockedIds = [28, 37, 21]; // substitua pelos IDs reais

const eligibleRooms = rooms.filter(!blockedIds.includes(r.number));
const MAX_ROOMS = 24; // Defina quantos quartos deseja usar
const selectedRooms = _.shuffle(eligibleRooms).slice(0, MAX_ROOMS);

// Loop de inscrições e alocações
for (const created_by of names) {
  const checkIn = randomDateInRange(startDate, endDate);
  const stayLength = getRandomInt(1, 7);
  const checkOut = addDays(checkIn, stayLength);

  const validCheckOut = checkOut <= endDate;
  const application = {
    id: _.uniqueId("app_"),
    draw_id: draw.id,
    created_by,
    check_in: checkIn.toISOString().slice(0, 10),
    check_out: checkOut.toISOString().slice(0, 10),
  };

  // Só tenta alocar se o período estiver dentro do sorteio
  if (!validCheckOut) {
    console.log(
      `⚠️ ${created_by} se inscreveu com período inválido (${application.check_in} a ${application.check_out})`
    );
    continue;
  }

  // cria a inscrição
  draw_applications.push(application);

  const newStart = new Date(application.check_in); //converte para date
  const newEnd = new Date(application.check_out); //idem

  let allocated = false;
  for (const room of selectedRooms) {
    // vê se dentro dos quartos já alocados, existe dentro dos quartos elegiveis
    const allocations = draw_rooms.filter((dr) => dr.room_id === room.number);

    // verifica se dos quartos já alocados tem conflito entre datas, se não tiver conflito, aloca, se não, não aloca.
    if (!hasConflict(allocations, newStart, newEnd)) {
      draw_rooms.push({
        id: _.uniqueId("alloc_"),
        room_id: room.number,
        draw_apply_id: application.id,
        check_in: application.check_in,
        check_out: application.check_out,
        utc_created_on: new Date().toISOString(),
      });
      allocated = true;
      break;
    }
  }

  if (!allocated) {
    console.log(`❌ ${application.created_by} não conseguiu ser alocado.`);
  }
}

// Criar pasta de logs
const dir = "./logs";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Verificar conflitos internos antes de salvar
checkConflictsInsideDrawRooms(draw_rooms);

// Salvar arquivos
fs.writeFileSync(`${dir}/draw.json`, JSON.stringify(draw, null, 2));
fs.writeFileSync(
  `${dir}/draw_applications.json`,
  JSON.stringify(draw_applications, null, 2)
);
fs.writeFileSync(`${dir}/draw_rooms.json`, JSON.stringify(draw_rooms, null, 2));

// Resumo legível
let logText = `🗳️ Sorteio ID: ${draw.id} (${draw.start_period_date} a ${draw.end_period_date})\n\n`;

logText += "✅ Alocações:\n";
for (const dr of draw_rooms) {
  const app = draw_applications.find((a) => a.id === dr.draw_apply_id);
  const room = rooms.find((r) => r.number === dr.room_id);
  logText += `- ${app.created_by} alocado no quarto ${room.name || room.number} de ${app.check_in} a ${app.check_out}\n`;
}

const alocadosIds = draw_rooms.map((dr) => dr.draw_apply_id);
const naoAlocados = draw_applications.filter(
  (a) => !alocadosIds.includes(a.id)
);

logText += "\n❌ Não alocados:\n";
for (const a of naoAlocados) {
  logText += `- ${a.created_by} (período: ${a.check_in} a ${a.check_out})\n`;
}

fs.writeFileSync(`${dir}/resumo.txt`, logText);

console.log("✅ Simulação finalizada. Arquivos salvos em /logs.");

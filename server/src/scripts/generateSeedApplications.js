import "dotenv/config";
import knex from "knex";
import knexConfig from "../../knexfile.js";
const db = knex(knexConfig.development);
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

function generateCPF() {
  return faker.helpers.replaceSymbols("###.###.###-##");
}

function generateMobilePhoneNumber() {
  return faker.phone.number("national");
}

function randomAssociateRole() {
  const roles = ["partner", "contributor"];
  const index = Math.floor(Math.random() * (2 - 0) + 0);
  return roles[index];
}

async function createUsers(count) {
  const userIds = [];

  for (let i = 0; i < count; i++) {
    const [id] = await db("users")
      .insert({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        cpf: generateCPF(),
        role: "associate",
        associate_role: randomAssociateRole(),
        mobile_phone: generateMobilePhoneNumber(),
        birth_date: new Date("2005-01-03").toISOString(),
        password: bcrypt.hashSync("123456", SALT_ROUNDS),
        utc_created_on: new Date().toISOString(),
      })
      .returning("id");
    userIds.push(id);
  }

  return userIds;
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const startDate = new Date("2025-11-02");
const endDate = new Date("2025-11-28");

async function createApplications(userIds, drawId) {
  for (const userId of userIds) {
    const check_in = randomDateInRange(startDate, endDate);
    const stayLength = getRandomInt(1, 7);
    const check_out = addDays(check_in, stayLength);

    const [applicationId] = await db("draw_applications")
      .insert({
        draw_id: drawId,
        created_by: userId.id,
        utc_created_on: new Date().toISOString(),
        check_in,
        check_out,
        url_receipt_picture: "/fake/path/receipt_picture.pdf",
        url_word_card_file: "/fake/path/word_card_file.pdf",
        status: "awaiting_draw",
        presence_role: "pending",
        partner_presence: true,
        expires_at: null,
        word_card_file_status: "approved",
        receipt_picture_status: "approved",
      })
      .returning("id");

    const dependents = Math.floor(Math.random() * 3) + 4;

    for (let i = 0; i < dependents; i++) {
      const name = faker.person.fullName();
      const created_by = userId.id;
      const cpf = generateCPF();
      const birth_date = new Date("2005-03-01").toISOString();
      const disability = i % 2 === 0 ? true : null;
      const url_document_picture =
        i % 2 === 0 ? "/fake/path/document_picture.pdf" : null;
      const url_medical_report = "/fake/path/medical_report.pdf";
      const medical_report_status = "approved";
      const document_picture_status = "approved";

      const [dependentId] = await db("dependents")
        .insert({
          name,
          created_by,
          cpf,
          birth_date,
          disability,
          url_document_picture,
          url_medical_report,
          medical_report_status,
          document_picture_status,
        })
        .returning("id");

      await db("dependents_draw_applies").insert({
        dependent_id: dependentId.id,
        draw_apply_id: applicationId.id,
        utc_created_on: new Date().toISOString(),
      });
    }
  }
}

async function run() {
  const total = 150;
  const drawId = "e316ac78-00cc-45f1-b794-44dda845d4a9";

  console.log("Criando usuários...");
  const userIds = await createUsers(total);

  console.log("Criando inscrições...");
  await createApplications(userIds, drawId);

  console.log(`✅ ${total} inscrições criadas com sucesso.`);
  process.exit();
}

run().catch((err) => {
  console.error("❌ Erro ao gerar dados:", err);
  process.exit(1);
});

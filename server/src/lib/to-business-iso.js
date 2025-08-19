// utils/date-wire.ts
const PLAIN_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const toPlainDate = (v) => {
  if (v == null) return v;
  if (typeof v === "string") {
    // se já vier "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm..."
    return v.slice(0, 10);
  }
  // se vier Date ou número
  // (evite libs aqui: o contrato do wire é só data)
  const d = new Date(v);
  // garante yyyy-mm-dd
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    .toISOString()
    .slice(0, 10);
};

export const normalizeRowToPlainDate = (
  row,
  keys = ["check_in", "check_out"]
) => {
  const out = { ...row };
  for (const k of keys) if (k in out) out[k] = toPlainDate(out[k]);
  return out;
};

export const normalizeArrToPlainDate = (
  arr,
  keys = ["check_in", "check_out"]
) => arr.map((r) => normalizeRowToPlainDate(r, keys));

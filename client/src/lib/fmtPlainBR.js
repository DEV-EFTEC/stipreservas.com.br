import { parse, format, isDate } from "date-fns";
import { ptBR } from "date-fns/locale";

export const fmtPlainBR = (s) =>
  format(parse(s, "yyyy-MM-dd", new Date()), "d 'de' MMMM (eee)", {
    locale: ptBR,
  });

export const fmtPlainDateBR = (s) =>
  format(
    parse(s.includes("T") ? s.split("T")[0] : s, "yyyy-MM-dd", new Date()),
    "dd/MM/yyyy",
    { locale: ptBR }
  );

export const fmtPlainNameDateBR = (s) => {
  let date;

  if (!s) return "";

  if (isDate(s)) {
    date = s;
  } else if (typeof s === "string") {
    date = parseISO(s);
  } else {
    throw new Error("fmtPlainNameDateBR recebeu tipo inesperado: " + typeof s);
  }

  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

import { parse, format } from "date-fns";
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

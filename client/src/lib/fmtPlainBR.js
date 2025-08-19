import { parse, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const fmtPlainBR = (s) =>
  format(
    parse(s, "yyyy-MM-dd", new Date()), // <-- parse como DATA local (sem UTC)
    "d 'de' MMMM (eee)", // use "eee" p/ sex, sáb, dom...
    { locale: ptBR }
  );

export const fmtPlainDateBR = (s) =>
  format(
    parse(s, "yyyy-MM-dd", new Date()), // <-- parse como DATA local (sem UTC)
    "dd/MM/yyyy", // use "eee" p/ sex, sáb, dom...
    { locale: ptBR }
  );

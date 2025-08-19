import { fmtPlainDateBR } from "@/lib/fmtPlainBR";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { enumStatus } from "@/lib/enumStatus";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function BookingCardMobile({ check_in, check_out, expires_at, utc_created_on, id, status }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg border bg-white shadow-sm p-4 mb-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-gray-500">#{id.slice(0, 8)}</span>
        <Badge variant={status}>{enumStatus[status]}</Badge>
      </div>

      <div className="mt-2 space-y-1 text-sm">
        <p><strong>Entrada:</strong> {fmtPlainDateBR(check_in)}</p>
        <p><strong>Saída:</strong> {fmtPlainDateBR(check_out)}</p>
        <p><strong>Criada em:</strong> {format(utc_created_on, "dd/MM/yyyy 'às' HH:mm")}</p>
      </div>

      <div className="mt-3">
        <Button className={'w-full'} variant="outline" onClick={() => navigate(`/associado/solicitacao/${id.slice(0, 8)}?booking_id=${id}`)}>
          {
            status === "incomplete"
            ?
            "Continuar de onde parou"
            :
            "Ver detalhes"
          }
        </Button>
      </div>
    </div>

  )
}
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import LexicalViewer from "@/components/lexical-viewer";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { apiRequest } from "@/lib/api";
import { BadgeHelp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import LexicalEditor from "@/components/editor";

export default function RefusePage() {
  const { booking } = useBooking();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const booking_id = queryParams.get("booking_id");
  const navigate = useNavigate();
  const [justification, setJustification] = useState('');

  async function handleSubmit() {
    const response = await apiRequest(`/bookings/refuse-booking`, {
      method: 'POST',
      body: JSON.stringify({
        booking_id: booking.id,
        user_id: booking.created_by,
        justification
      })
    });

    if (response) {
      navigate("/admin/home");
    } else {
      toast.error("Algo deu errado");
    }
  }

  return (
    <section className="flex w-full p-20 justify-between">
      <section className="w-full h-full">
        <GlobalBreadcrumb />
        <div className="flex items-center justify-center flex-col h-full">
          <BadgeHelp size={164} className={"text-red-500"} />
          <p className={'text-3xl font-bold'}>Recusar soliciação?</p>
          <p className={'text-lg mb-8'}>Escreva aqui a sua justificativa para a recusa. Essa justificativa ficará visível para o associado.</p>
          <LexicalEditor setContent={setJustification} />
          <p className={'text-muted-foreground text-md mt-4 text-center'}>Assim que for recusada, será enviado um e-mail de confirmação<br />para {booking.holders[0].name}{' '}({booking.holders[0].email})</p>
          <Button variant={'destructive'} className={'mt-8'} onClick={handleSubmit} disabled={
            !justification ||
            !justification.root ||
            justification.root.children.length === 0 ||
            justification.root.children.every(
              (child) =>
                !child.children || child.children.every((c) => !c.text || c.text.trim() === "")
            )
          }>Confirmar recusa</Button>
        </div>
      </section>
    </section>
  )
}
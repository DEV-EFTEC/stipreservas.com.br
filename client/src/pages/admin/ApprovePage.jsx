import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { BadgeHelp } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function ApprovePage() {
  const { booking } = useBooking();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const booking_id = queryParams.get("booking_id");

  return (
    <section className="flex w-full p-20 justify-between">
      <section className="w-full h-full">
        <GlobalBreadcrumb />
        <div className="flex items-center justify-center flex-col h-full">
          <BadgeHelp size={164} className={"text-yellow-400"}/>
          <p className={'text-3xl font-bold'}>Aprovar soliciação?</p>
          <p className={'text-muted-foreground text-md mt-4 text-center'}>Assim que for aprovada, será enviado um e-mail de confirmação<br/>para {booking.holders[0].name}{' '}({booking.holders[0].email})</p>
          <Button variant={'positive'} className={'mt-8'}>Confirmar solicitação</Button>
        </div>
      </section>
    </section>
  )
}
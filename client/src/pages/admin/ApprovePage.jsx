import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { calculateTotalPrice } from "@/hooks/useBookingPrice";
import { apiRequest } from "@/lib/api";
import { BadgeHelp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ApprovePage() {
  const { booking } = useBooking();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const booking_id = queryParams.get("booking_id");
  const navigate = useNavigate();

  async function handleSubmit() {
    const response = await apiRequest(`/bookings/approve-booking`, {
      method: 'POST',
      body: JSON.stringify({
        booking_id: booking.id,
        user_id: booking.created_by,
        value: calculateTotalPrice(booking).brute
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
          <BadgeHelp size={164} className={"text-yellow-400"} />
          <p className={'text-3xl font-bold'}>Aprovar soliciação?</p>
          <p className={'text-muted-foreground text-md mt-4 text-center'}>Assim que for aprovada, será enviado um e-mail de confirmação<br />para {booking.holders[0].name}{' '}({booking.holders[0].email})</p>
          <Button variant={'positive'} className={'mt-8'} onClick={handleSubmit}>Confirmar solicitação</Button>
        </div>
      </section>
    </section>
  )
}
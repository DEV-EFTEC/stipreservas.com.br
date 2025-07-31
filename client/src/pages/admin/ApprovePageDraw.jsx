import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { calculateTotalPrice } from "@/hooks/useBookingPrice";
import { apiRequest } from "@/lib/api";
import { BadgeHelp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Loader from "@/components/loader";

export default function ApprovePageDraw() {
  const { booking } = useBooking();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const booking_id = queryParams.get("booking_id");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);

    const response = await apiRequest(`/draws/approve-draw`, {
      method: 'POST',
      body: JSON.stringify({
        booking_id: booking.id,
        user_id: booking.created_by,
      })
    });

    if (response) {
      setIsLoading(false);
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
          <p className={'text-3xl font-bold'}>Aprovar inscrição?</p>
          <p className={'text-muted-foreground text-md mt-4 text-center'}>Assim que for aprovada, será enviado um e-mail de confirmação<br />para {booking.holders[0].name}{' '}({booking.holders[0].email})</p>
          {
            isLoading ?
              <Loader />
              :
              <Button variant={'positive'} className={'mt-8'} onClick={handleSubmit}>Confirmar inscrição</Button>
          }
        </div>
      </section>
    </section>
  )
}
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useBooking } from "@/hooks/useBooking";
import { useEffect, useState } from "react";
import { AlertCircleIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { booking, removeBooking } = useBooking();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [bookings, setBookings] = useState([]);
  const [paginationData, setPaginationData] = useState();

  useEffect(() => {
    if (loading) return;

    async function fetchBookings() {
      try {
        const result = await apiRequest(`/bookings/get-bookings?user_id=${user.id}&page=${page}&limit=${limit}`, {
          method: "GET"
        });
        setBookings(result.data);
        setPaginationData(result.pagination);
      } catch (err) {
        console.error("Erro ao buscar reservas:", err.message);
      }
    }

    fetchBookings();
  }, [loading, page]);

  function handleCancel() {
    apiRequest(`/bookings/delete-booking/${booking.id}`, {
      method: "DELETE"
    });

    removeBooking();
    toast.success("Sua reserva foi cancelada!")
  }

  async function handleContinue() {
    const result = await apiRequest(`/bookings/get-participants?booking_id=${booking.id}`, {
      method: "GET"
    });

    if (result) {
      navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/enviar-documentos`, {
        state: { participants: result }
      });
    }
  }

  return (
    <section className="w-full p-20">
      <GlobalBreadcrumb />
      <div className="flex w-full justify-between items-center mb-10">
        <Text heading={'h1'}>Suas solicitações recentes</Text>
        <Button variant="positive" onClick={() => navigate("/associado/criar-reserva")}><PlusIcon /> Criar uma nova solicitação</Button>
      </div>
      {
        booking
        &&
        <Alert className="w-fit h-fit">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Oi! Parece que você deixou uma reserva pendente.</AlertTitle>
          <AlertDescription>
            Quer continuar preenchendo ou prefere cancelar?
            <div className="flex justify-between w-full mt-1">
              <Button variant={"positive"} onClick={handleContinue}>Continuar preenchendo</Button>
              <Button variant={"destructive"} onClick={handleCancel}>Cancelar</Button>
            </div>
          </AlertDescription>
        </Alert>
      }
      <DataTable
        columns={columns}
        data={bookings}
        nextPage={() => setPage(prevState => prevState + 1)}
        previousPage={
          () => setPage(prevState => {
            if (prevState > 1) {
              return prevState - 1
            } else {
              return 1
            }
          })
        }
        pagination={paginationData}
      />
    </section>
  )
}
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useSocket } from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function Home() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [bookings, setBookings] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("new-booking-response", (data) => {
      setBookings(prevState => [data, ...prevState]);
      toast.info(`Nova solicitação do usuário: ${data.created_by_name}`);
    });

    socket.on("admin:payment:confirmed", (data) => {
      console.log({home: data})
      setBookings(prevState => {
        const newBookings = prevState.map(ps => {
          if (ps.id === data.booking.id) {
            return {
              ...ps,
              status: data.booking.status
            }
          }

          return ps;
        });

        return newBookings;
      });
    });

    socket.on("cancelled-response", (data) => {
      setBookings(prevState => {
        const newBookings = prevState.map(ps => {
          if (ps.id === data) {
            return {
              ...ps,
              status: "cancelled"
            }
          }

          return ps;
        });

        return newBookings;
      });
      toast.error(`A solicitação ${data.slice(0, 8)} foi cancelada!`)
    })

    return () => {
      socket.off("new-booking-response");
      socket.off("cancelled-response");
      socket.off("admin:payment:confirmed");
      socket.off("admin:payment:refused");
    };
  }, [socket]);

  useEffect(() => {
    (async () => {
      const result = await apiRequest(`/bookings/get-all-bookings?page=${page}&limit=${limit}&user_type=${user.role}`, { method: 'GET' });
      setBookings(result.data);
      setPaginationData(result.pagination);
    })();
  }, [page]);

  return (
    <section className="w-full p-20">
      <GlobalBreadcrumb />
      <div className="flex w-full justify-between items-center mb-10">
        <Text heading={'h1'}>Últimas solicitações</Text>
      </div>
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
    </section >
  )
}
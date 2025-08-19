import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import LexicalViewerCard from "@/components/lexical-viewer-card";
import GradientBox from "@/components/gradient-box";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSocket } from "@/hooks/useSocket";

export function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [bookings, setBookings] = useState([]);
  const [invites, setInvites] = useState([]);
  const [paginationData, setPaginationData] = useState();
  const [draw, setDraw] = useState();
  const [draws, setDraws] = useState();
  const [option, setOption] = useState("bookings");
  const today = new Date().toISOString().slice(0, 10);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("payment:confirmed", (data) => {
      setBookings(prevState => {
        const newBookings = prevState.map(ps => {
          if (ps.id === data.booking.id) {
            return {
              ...ps,
              status: data.status
            }
          }

          return ps;
        });

        return newBookings;
      });
    });

    socket.on("booking:approved", (data) => {
      setBookings(prevState => {
        const newBookings = prevState.map(ps => {
          if (ps.id === data.booking_id) {
            return {
              ...ps,
              status: "payment_pending"
            }
          }

          return ps;
        });

        return newBookings;
      });
    });

    socket.on("booking:refused", (data) => {
      setBookings(prevState => {
        const newBookings = prevState.map(ps => {
          if (ps.id === data.booking_id) {
            return {
              ...ps,
              status: data.status
            }
          }

          return ps;
        });

        return newBookings;
      });
    });

    return () => {
      socket.off("payment:confirmed");
      socket.off("booking:approved");
      socket.off("booking:refused");
    };
  }, [socket]);

  useEffect(() => {
    if (loading) return;

    async function fetchBookings() {
      try {
        if (option === "bookings") {
          const result = await apiRequest(`/bookings/get-bookings?page=${page}&limit=${limit}`, {
            method: "GET"
          });
          setBookings(result.data);
          setPaginationData(result.pagination);
        } else if (option === "draw_applies") {
          const result = await apiRequest(`/draws/get-draws-applications?user_id=${user.id}&page=${page}&limit=${limit}`, {
            method: "GET"
          });
          setDraws(result.data);
          setPaginationData(result.pagination);
        } else {
          const result = await apiRequest(`/bookings/get-invites?page=${page}&limit=${limit}`, {
            method: "GET"
          });
          setInvites(result.data);
          setPaginationData(result.pagination);
        }
      } catch (err) {
        console.error("Erro ao buscar reservas:", err.message);
      }
    }

    fetchBookings();
  }, [loading, page, option]);

  useEffect(() => {
    (async () => {
      const draw = await apiRequest(`/draws/get-draws?start_date=${today}&end_date=${today}`, {
        method: 'GET'
      });
      setDraw(draw);
    })();
  }, [today])

  return (
    <section className="w-full xl:p-20 pr-2 overflow-y-auto">
      <GlobalBreadcrumb />
      <div className="flex xl:flex-row flex-col w-full justify-between items-center mb-10">
        <Text heading={'h1'}>Suas solicitações recentes</Text>
        <Button variant="positive" onClick={() => navigate("/associado/criar-reserva")} className={"w-[100%] mt-4 xl:w-fit xl:mt-0"}><PlusIcon /> Criar uma nova solicitação</Button>
      </div>
      {
        draw &&
        <GradientBox colorEnd={draw.color_2} colorStart={draw.color} >
          <section className="flex xl:flex-row flex-col">
            <div className="w-[100%] xl:w-[80%]">
              <Badge className={"rounded-2xl mb-2 bg-white border-none font-semibold"} style={{ color: draw.color }}>NOVIDADE!</Badge>
              <h1 className="font-bold text-2xl">{draw.title}!</h1>
              <LexicalViewerCard jsonContent={draw.description} />
              <div className="flex flex-col space-y-2 w-full xl:flex-row mt-4 space-x-9 text-md mb-4 xl:mb-0 xl:text-lg font-bold">
                <p>Período de inscrição: {format(draw.start_date, 'dd/MM/yyyy')} à {format(draw.end_date, 'dd/MM/yyyy')}</p>
                <p>Data do sorteio: {format(draw.draw_date, 'dd/MM/yyyy')}</p>
              </div>
            </div>
            <div className="w-[100%] xl:w-[20%] flex flex-col justify-between space-y-4 xl:space-y-0">
              <Button className={"w-full border-none bg-white/40 text-white hover:bg-white/55"}>Ver detalhes</Button>
              <Button className={"w-full border-none bg-white/40 text-white hover:bg-white/55"}>Regras do sorteio</Button>
              <Button className={"w-full border-none hover:opacity-85"} style={{ backgroundColor: draw.color }} onClick={() => navigate(`/associado/sorteio/${draw.id.slice(0, 8)}/participar?draw_id=${draw.id}`)}>Quero participar!</Button>
            </div>
          </section>
        </GradientBox>
      }
      <Tabs defaultValue={option} onValueChange={(e) => setOption(e)}>
        <TabsList className={'w-full'}>
          <TabsTrigger value="bookings">Reservas</TabsTrigger>
          <TabsTrigger value="draw_applies">Sorteios</TabsTrigger>
          <TabsTrigger value="invites">Convites</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <div className="none xl:block">
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
          </div>
          {/* <div>
            {
              bookings
            }
          </div> */}
        </TabsContent>
        <TabsContent value="draw_applies">
          {
            draws &&
            <DataTable
              columns={columns}
              data={draws}
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
          }
        </TabsContent>
        <TabsContent value="invites">
          {
            invites &&
            <DataTable
              columns={columns}
              data={invites}
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
          }
        </TabsContent>
      </Tabs>

    </section>
  )
}
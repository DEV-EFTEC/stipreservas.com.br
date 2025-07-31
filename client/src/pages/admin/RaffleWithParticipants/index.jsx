import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "./data-table";
import { columns } from "./columns";

export function RaffleWithParticipants() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [draws, setDraws] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [drawId, setDrawId] = useState(null);
  const [paginationData, setPaginationData] = useState();

  useEffect(() => {
    (async () => {
      const result = await apiRequest(`/draws/get-all?page=1&limit=20`, {
        method: "GET",
      })
      setDraws(result.data);
      setPaginationData(result.pagination);
    })()
  }, []);

  useEffect(() => {
    if (!drawId) return;
    (async () => {
      const result = await apiRequest(`/draws/${drawId}/participants?page=${page}&limit=${limit}`, {
        method: "GET",
      })
      setParticipants(result.data);
      setPaginationData(result.pagination);
    })()
  }, [drawId, page, limit]);

  return (
    <section className="flex w-full p-20 justify-between overflow-y-auto overflow-x-hidden">
      <section className="w-full">
        <GlobalBreadcrumb />
        <div className="flex gap-12 items-end mb-8">
          <Text heading={'h1'}>Inscrições por sorteio</Text>
        </div>
        <section>
          <div className="flex justify-end mb-2">
            <Select onValueChange={(e) => setDrawId(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o sorteio" />
              </SelectTrigger>
              <SelectContent>
                {
                  draws && draws.map(draw => (
                    <SelectItem value={draw.id}>{draw.title}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <DataTable
            columns={columns}
            data={participants}
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
      </section>
    </section>
  )
}
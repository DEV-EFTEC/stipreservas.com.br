import RangeCalendar from "@/components/admin/range-calendar";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton"
import { addDays, format } from "date-fns";
import Calendar05 from "@/components/calendar-05";

export default function Settings() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 30),
  });
  const [description, setDescription] = useState('');
  const [seasons, setSeasons] = useState(null);
  const [seasonLoading, setSeasonLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await apiRequest(`/periods/get-periods`, {
        method: 'GET'
      });
      if (result) {
        setSeasons(result);
        setSeasonLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    setSeasonLoading(true);
    const result = await apiRequest(`/periods`, {
      method: 'POST',
      body: JSON.stringify({
        description,
        start_date: dateRange.from,
        end_date: dateRange.to
      })
    })

    if (result) {
      console.log(result)
      setSeasons(prevState => [result, ...prevState]);
      toast.success("Período adicionado com sucesso");
      setSeasonLoading(false);
    }
  }

  return (
    <section className="w-full p-20">
      <GlobalBreadcrumb />
      <div className="flex w-full justify-between mb-10 flex-col">
        <Text heading={'h1'}>Configurações</Text>
        <div className="flex justify-between space-x-40">
          <div className="mt-10 flex flex-col space-y-2 mb-10 w-fit">
            <Text heading={'h2'}>Adicionar data de alta temporada</Text>
            <strong>Selecione o período</strong>
            <RangeCalendar dateRange={dateRange} setDateRange={setDateRange} />
            <strong className="mt-5">Adicione uma descrição (opcional)</strong>
            <Input className={'mb-10'} placeholder="Alguma descrição..." onChange={e => setDescription(e.target.value)} />
            <Button onClick={handleSave}>Salvar novo período</Button>
          </div>
          {
            seasonLoading
            &&
            <Skeleton className="h-[60] w-full rounded-lg" />
          }
          {
            !seasonLoading
            &&
            <div className="h-[60] w-full rounded-lg border p-10 flex flex-col gap-10">
              {
                seasons
                  &&
                  seasons.length > 0
                  ?
                  seasons.map(s => (
                    <div>
                      <Text heading={'h3'}>De {format(s.start_date, 'dd/MM/yyyy')} até {format(s.end_date, 'dd/MM/yyyy')}</Text>
                      {
                        s.description
                        ?
                        <p>{s.description}</p>
                        :
                        <p>Sem descrição</p>
                      }
                    </div>
                  ))
                  :
                  <p>Nenhum período de alta temporada foi encontrado.
                  </p>
              }
            </div>
          }
        </div>
      </div>
    </section>
  )
}
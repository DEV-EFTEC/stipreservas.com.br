import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { useSocket } from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Eye } from "lucide-react";
import StatusCard from "@/components/status-card";
import LexicalEditor from "@/components/editor";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Calendar } from "@/components/ui/calendar";
import { InputCalendar } from "@/components/input-calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import LexicalViewer from "@/components/lexical-viewer";
import StipLogo from "@/assets/StipLogo";
import { format } from "date-fns";

export function DrawSettings() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [draws, setDraws] = useState([]);
  const [paginationData, setPaginationData] = useState([]);
  const [color, setColor] = useState("#aabbcc");
  const [color2, setColor2] = useState("#cccccc");
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [openStartDate, setOpenStartDate] = useState(false);
  const [startDate, setStartDate] = useState(undefined);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [endDate, setEndDate] = useState(undefined);
  const [openDrawDate, setOpenDrawDate] = useState(false);
  const [drawDate, setDrawDate] = useState(undefined);
  const [openEndDatePeriod, setOpenEndDatePeriod] = useState(false);
  const [endDatePeriod, setEndDatePeriod] = useState(undefined);
  const [openStartDatePeriod, setOpenStartDatePeriod] = useState(false);
  const [startDatePeriod, setStartDatePeriod] = useState(undefined);

  useEffect(() => {
    (async () => {
      const result = await apiRequest(`/draws/get-all?page=${page}&limit=${limit}`, {
        method: "GET",
      })
      setDraws(result.data);
      setPaginationData(result.pagination);
    })()
  }, [page]);

  async function handleSave() {
    try {
      const result = await apiRequest(`/draws`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          color,
          color_2: color2,
          start_date: startDate,
          end_date: endDate,
          start_period_date: startDatePeriod,
          end_period_date: endDatePeriod,
          draw_date: drawDate,
          created_by: user.id
        })
      });

      if (result) setDraws(prevState => [result, ...prevState]);

      toast.success('Sorteio adicionado com sucesso!')
    } catch (err) {
      toast.error(err)
    }
  }

  return (
    <section className="flex w-full p-20 justify-between overflow-y-auto overflow-x-hidden">
      <section className="w-full">
        <GlobalBreadcrumb />
        <div className="flex gap-12 items-end mb-8">
          <Text heading={'h1'}>Sorteios</Text>
        </div>
        <section className="flex flex-column max-w-[100%] space-x-16">
          <div className="max-w-[55%] flex-column space-y-4 w-full rounded-xl">
            <section>
              <div className="mb-4">
                <Text heading={"h3"} className="font-medium">Título</Text>
              </div>
              <Input onChange={(e) => setTitle(e.target.value)} />
            </section>
            <section>
              <div className="mb-4">
                <Text heading={"h3"} className="font-medium">Descrição</Text>
                <Text heading={"small"} className="font-medium">Adicione um texto informativo sobre o sorteio. Aqui você pode adicionar as regras para a participação no sorteio e outras informações que serão úteis no futuro.</Text>
              </div>
              <LexicalEditor setContent={setDescription} />
            </section>
            <section className="flex w-full">
              <section className="w-full">
                <div className="mb-4">
                  <Text heading={"h3"} className="font-medium">Cor</Text>
                  <Text heading={"small"} className="font-medium">Escolha a cor base de fundo para o banner do sorteio.</Text>
                </div>
                <div className="flex space-x-8 min-w-full">
                  <div className="min-w-[48%]">
                    <p className="text-sm font-bold mb-1">Cor 1</p>
                    <HexColorPicker color={color} onChange={setColor} />
                  </div>
                  <div className="min-w-[48%]">
                    <p className="text-sm font-bold mb-1">Cor 2</p>
                    <HexColorPicker color={color2} onChange={setColor2} />
                  </div>
                </div>
              </section>
            </section>
            <section>
              <Text heading={"h3"} className="font-medium">Datas</Text>
              <Text heading={"small"} className="font-medium">Aqui é onde as datas referentes ao sorteio são configuradas. Configure aqui a data de início e fim das inscrições e a data em que o sorteio serpa realizado.</Text>
              <section className="flex justify-between mt-2 flex-wrap space-y-4">
                <InputCalendar
                  label={"Data inicial"}
                  date={startDate}
                  open={openStartDate}
                  setDate={setStartDate}
                  setOpen={setOpenStartDate}
                />
                <InputCalendar
                  label={"Data final"}
                  date={endDate}
                  open={openEndDate}
                  setDate={setEndDate}
                  setOpen={setOpenEndDate}
                />
                <InputCalendar
                  label={"Data do sorteio"}
                  date={drawDate}
                  open={openDrawDate}
                  setDate={setDrawDate}
                  setOpen={setOpenDrawDate}
                />
                <InputCalendar
                  label={"Data inicial disponível para estadia"}
                  date={startDatePeriod}
                  open={openStartDatePeriod}
                  setDate={setStartDatePeriod}
                  setOpen={setOpenStartDatePeriod}
                />
                <InputCalendar
                  label={"Data final para estadia"}
                  date={endDatePeriod}
                  open={openEndDatePeriod}
                  setDate={setEndDatePeriod}
                  setOpen={setOpenEndDatePeriod}
                />
              </section>
            </section>
            <section className="flex justify-start mt-16 gap-4 flex-row-reverse">
              <Button variant={'positive'} onClick={handleSave}>
                <Check />
                Salvar sorteio
              </Button>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button>
                    <Eye />
                    Ver prévia
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Visualizar prévia</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Fechar</AlertDialogCancel>
                  </AlertDialogFooter>
                  <section className="p-8 rounded-lg" style={{ background: `linear-gradient(135deg, ${color}, ${color2})` }}>
                    <div className="flex justify-center mb-6">
                      <StipLogo />
                    </div>
                    <h1 className="text-3xl font-bold text-white text-center">{title}</h1>
                    <LexicalViewer jsonContent={description} />
                    <section className="text-white">
                      <ul>
                        <li>Data de início das inscrições: {startDate && format(startDate, 'dd/MM/yyyy')}</li>
                        <li>Data final das inscrições: {endDate && format(endDate, 'dd/MM/yyyy')}</li>
                        <li>Data do sorteio: {drawDate && format(drawDate, 'dd/MM/yyyy')}</li>
                        <li>Período disponível para estadia: {startDatePeriod && format(startDatePeriod, 'dd/MM/yyyy')} à {endDatePeriod && format(endDatePeriod, 'dd/MM/yyyy')}</li>
                      </ul>
                    </section>
                  </section>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          </div>
          <div className="max-w-[45%] min-w-[45%] flex-column space-y-8">
            {
              draws.length > 0
                ?
                draws.map(d => (
                  <StatusCard draw={d} setDraws={setDraws}/>
                ))
                :
                <p className="text-primary/80 text-center">Não foram encontrados sorteios cadastrados.</p>
            }
          </div>
        </section>
      </section>
    </section >
  )
}
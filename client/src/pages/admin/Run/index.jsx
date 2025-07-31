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
import { AlertCircle, Dices, MessageCircleQuestion, PartyPopper, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingGif from "@/assets/loading.gif";
import SuccessGif from "@/assets/success.gif";

export function Run() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [draws, setDraws] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [drawId, setDrawId] = useState(null);
  const [paginationData, setPaginationData] = useState();
  const [messageAlert, setMessageAlert] = useState("Selecione um sorteio no canto superior direito para liberar.");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [alertVariant, setAlertVariant] = useState('default');
  const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

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

  useEffect(() => {
    if (!drawId) {
      setButtonIsDisabled(true);
    } else {
      setButtonIsDisabled(false);
    }
  }, [drawId])

  async function handleSubmit(drawId) {
    setIsLoading(true);
    setButtonIsDisabled(true);
    setAlertVariant('warning');
    setMessageAlert("Iniciando sorteio. O sorteio pode demorar alguns instantes. Por favor, aguarde...");
    try {
      const result = await apiRequest(`/draws/run`, {
        method: 'POST',
        body: JSON.stringify({
          draw_id: drawId
        })
      });

      if (result) {
        setMessageAlert("Sorteio realizado com sucesso! Vá até Solicitações > Agenda ou Sorteios > Ver inscrições para ver os contemplados.");
        setAlertVariant('success');
        setHasResult(true);
        setButtonIsDisabled(false);
      }
    } catch (error) {
      setAlertVariant('destructive');
      setHasError(true);
      setMessageAlert("Infelizmente algo deu errado ao realizar o sorteio. Tente novamente mais tarde ou contate o desenvolvedor.");
      setButtonIsDisabled(false);
    }
  }

  async function handleSubmitReRun(drawId) {
    setIsLoading(true);
    setButtonIsDisabled(true);
    setAlertVariant('warning');
    setMessageAlert("Iniciando re-sorteio. O re-sorteio pode demorar alguns instantes. Por favor, aguarde...");
    try {
      const result = await apiRequest(`/draws/rerun`, {
        method: 'POST',
        body: JSON.stringify({
          draw_id: drawId
        })
      });

      if (result) {
        setMessageAlert("Re-sorteio realizado com sucesso! Vá até Solicitações > Agenda ou Sorteios > Ver inscrições para ver os contemplados.");
        setAlertVariant('success');
        setHasResult(true);
        setButtonIsDisabled(false);
      }
    } catch (error) {
      setAlertVariant('destructive');
      setHasError(true);
      setMessageAlert("Infelizmente algo deu errado ao realizar o sorteio. Tente novamente mais tarde ou contate o desenvolvedor.");
      setButtonIsDisabled(false);
    }
  }

  return (
    <section className="flex w-full p-20 justify-between overflow-y-auto overflow-x-hidden">
      <section className="w-full">
        <GlobalBreadcrumb />
        <div className="flex gap-12 items-end mb-8">
          <Text heading={'h1'}>Realizar sorteio</Text>
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
          <div className="w-full flex flex-col items-center justify-center h-[60vh]">
            {
              !hasResult && !isLoading && <Dices size={"150px"} className="text-yellow-500" />
            }
            {
              isLoading && <img src={LoadingGif} alt="GIF de carregando" />
            }
            {
              hasResult && <img src={SuccessGif} alt="GIF de sucesso" />
            }
            {
              hasError && <XCircle size={"150px"} className="text-red-500" />
            }

            <Alert className={"w-fit mb-8 mt-8"} variant={alertVariant}>
              <AlertCircle />
              <AlertDescription>
                {messageAlert}
              </AlertDescription>
            </Alert>
            <Button variant="positive" onClick={() => handleSubmit(drawId)} disabled={buttonIsDisabled}><PartyPopper />Sortear!</Button>
            <Alert className={"w-fit mb-8 mt-8"}>
              <MessageCircleQuestion />
              <AlertDescription>
                Houve muitas desistências ou não obteve respostas de confirmação dos associados?
              </AlertDescription>
            </Alert>
            <Button variant="positive" onClick={() => handleSubmitReRun(drawId)} disabled={buttonIsDisabled}><PartyPopper />Re-sortear!</Button>
          </div>

        </section>
      </section>
    </section>
  )
}
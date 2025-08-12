import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Text from "@/components/Text";
import { FileUploadBlock } from "@/components/FileUploadBlock";
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SendDocumentsInvited() {
  const { user } = useAuth();
  const [invite, setInvite] = useState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  console.log(queryParams)
  const invite_id = queryParams.get("invite_id");
  console.log(location)
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const result = await apiRequest(`/bookings/get-invite?id=${invite_id}`, {
        method: "GET",
      });
      setInvite(result)
    })();
  }, [invite_id])

  async function handleSubmit() {
    try {
      await apiRequest(`/bookings/${invite_id}/update-invite`, {
        method: "PATCH",
        body: JSON.stringify({
          url_receipt_picture: invite.url_receipt_picture,
          url_word_card_file: invite.url_word_card_file
        })
      });

      navigate('/associado/home');
    } catch (err) {
      console.error(err)
      toast.error("Houve um erro inesperado. Tente novamente em alguns instantes.")
    }
  }

  return (
    <>
      <section className="w-full xl:flex xl:justify-between 2xl:space-x-24 xl:space-x-8 xl:p-20 pr-2 overflow-y-auto">
        <section className="w-fit">
          <GlobalBreadcrumb />
          <div className="flex space-x-12 items-end mb-8 flex-wrap 2xl:flex-nowrap">
            <Text heading="h1">Envio de Documentos</Text>
            <div className="flex items-center gap-2">
              <Label>Convite</Label>
              <Badge variant="">#{invite && invite.id.slice(0, 8)}</Badge>
            </div>
          </div>
          <Text heading="h2">Documentos do associado convidado</Text>
          <Card className="w-full mb-7 mt-5">
            <CardContent className="flex w-full flex-wrap space-y-4 lg:flex-nowrap lg:space-y-0 lg:space-x-4">
              <FileUploadBlock
                label="Holerite recente"
                id="holerite"
                tooltip="Holerites emitidos há mais de 30 dias serão rejeitados na fase de aprovação."
                associationId={user.id}
                documentType={'holerite'}
                documentsAssociation={'holder'}
                userId={user.id}
                key={'holerite_sender'}
                setFile={(url) => setInvite(prevState => {
                  const newURL = url; return {
                    ...prevState,
                    url_receipt_picture: newURL
                  }
                })}
                value={invite ? invite.url_receipt_picture : ""}
              />
              <FileUploadBlock
                label="Carteira de Trabalho Digital"
                id="clt-digital"
                tooltip="CLTs não digitais serão rejeitadas na fase de aprovação. CLTs digitais nos ajudam a evitar fraudes."
                associationId={user.id}
                documentType={'clt_digital'}
                documentsAssociation={'holder'}
                userId={user.id}
                setFile={(url) => setInvite(prevState => {
                  const newURL = url; return {
                    ...prevState,
                    url_word_card_file: newURL
                  }
                })}
                value={invite ? invite.url_word_card_file : ""}
              />
            </CardContent>
          </Card>
          <Button onClick={handleSubmit}>Concluir e enviar documentação</Button>
        </section>
      </section>
    </>
  );
}

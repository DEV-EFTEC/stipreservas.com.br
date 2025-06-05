import LabeledInput from "@/components/LabeledInput";
import Text from "@/components/Text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { FileUploadBlock } from "@/components/admin/FileUploadBlock";
import { Label } from "@/components/ui/label";
import DatePickerBirth from "@/components/DatePickerBirth";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth";
import maskCPF from "@/lib/maskCPF";
import validarCpf from "validar-cpf";
import { toast } from "sonner";

export default function Guests({ setGuests, setSelectedGuests, guestsParcial, selectedGuests, guests, updateGuest, saveEntity, deleteEntity }) {
  const { user } = useAuth();

  return (
    <>
      <>
        <hr className="my-14" />
        <div className="w-full flex items-center justify-between">
          <Text heading="h2">Documentos dos convidados</Text>
        </div>
      </>
      {
        guests.length > 0
        &&
        <>
          <div className="flex flex-col gap-8 mt-4">
            {guests.map((gue, index) => (
              <Card className="w-fit">
                <CardContent>
                  <header className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-2 mb-4">
                      <UserRound strokeWidth={3} className="text-blue-500" width={20} />
                      <Text heading={'h3'}>{gue.name ? gue.name : `Convidado ${index + 1}`}</Text>
                      <Badge variant="">#{gue.id?.slice(0, 8)}</Badge>
                    </div>
                  </header>
                  <div className="flex flex-col gap-8 mb-8">
                    <div className="flex gap-15">
                      <LabeledInput
                        label={"Nome"}
                        onChange={(e) => updateGuest(index, "name", e.target.value)}
                        value={gue.name}
                        id={"gue_name" + index}
                        key={"gue_name" + index} />
                      <LabeledInput
                        label={"CPF"}
                        onChange={(e) => {
                          const value = maskCPF(e.target.value);
                          updateGuest(index, "cpf", value);
                          return value;
                        }}
                        value={gue.cpf}
                        id={"gue_cpf" + index}
                        key={"gue_cpf" + index} />
                    </div>
                    <div className="flex gap-15">
                      <div className="flex flex-col w-80 gap-2">
                        <Label>Data de Nascimento</Label>
                        <DatePickerBirth
                          date={new Date(gue.birth_date || '2000-01-01')}
                          setDate={(newDate) => updateGuest(index, "birth_date", newDate)}
                        />
                      </div>
                      <FileUploadBlock
                        label="Documento com foto"
                        id={"gue_picture" + index}
                        associationId={user.id}
                        documentType={'documento_com_foto'}
                        documentsAssociation={'guests'}
                        userId={user.id}
                        setFile={(url) => updateGuest(index, "url_document_picture", url)}
                        value={gue ? gue.url_document_picture : ""}
                        setStatus={(status) => updateGuest(index, "document_picture_status", status)}
                        status={gue ? gue.document_picture_status : "neutral"}
                      />
                    </div>
                  </div>
                  {
                    gue.disability == true ?
                      <div className="mb-8">
                        <FileUploadBlock
                          label="Documento comprobatório"
                          id={"gue_url_medical_report" + index}
                          associationId={user.id}
                          documentType={'doc_comprobatorio'}
                          documentsAssociation={'guests'}
                          userId={user.id}
                          setFile={(url) => updateGuest(index, "url_medical_report", url)}
                          value={gue ? gue.url_medical_report : ""}
                          setStatus={(status) => updateGuest(index, "medical_report_status", status)}
                          status={gue ? gue.medical_report_status : "neutral"}
                        />
                      </div>
                      :
                      <></>
                  }
                  <div className="items-top flex space-x-2">
                    <Checkbox id="gue_disability" onCheckedChange={(checked) => { updateGuest(index, "disability", checked) }} checked={gue.disability} />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="gue_disability"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Possui dificuldade de locomoção ou laudo médico
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Marque esta opção caso tenha documento comprobatório.
                      </p>
                    </div>
                  </div>
                  {
                    !gue.is_saved
                    &&
                    <div className="flex items-center justify-end w-full space-x-8">
                      <Button variant={'secondary'} onClick={() => deleteEntity('g', gue)}>Cancelar</Button>
                      <Button variant={'default'} onClick={async () => {
                        if (validarCpf(gue.cpf)) {
                          await saveEntity('g', gue);
                        } else {
                          toast.error(`CPF Inválido para convidado(a) ${gue.name}`)
                        }
                      }}>Salvar</Button>
                    </div>
                  }
                </CardContent>
              </Card>
            ))
            }
          </div>
        </>
      }
    </>
  )
}
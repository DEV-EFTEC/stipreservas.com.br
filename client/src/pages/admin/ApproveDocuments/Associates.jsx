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

export default function Associates({ associates, updateAssociate }) {
  const { user } = useAuth();

  return (
    <>
      <>
        <hr className="my-14" />
        <div className="w-full flex items-center justify-between">
          <Text heading="h2">Documentos dos associados convidados</Text>
        </div>
      </>
      {
        associates.length > 0
        &&
        <>
          <div className="flex flex-col gap-8 mt-4">
            {associates.map((associate, index) => (
              <Card className="w-fit">
                <CardContent>
                  <header className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-2 mb-4">
                      <UserRound strokeWidth={3} className="text-blue-500" width={20} />
                      <Text heading={'h3'}>{associate.name ? associate.name : `Associado ${index + 1}`}</Text>
                      <Badge variant="">#{associate.id?.slice(0, 8)}</Badge>
                    </div>
                  </header>
                  <div className="flex flex-col gap-8 mb-8">
                    <div className="flex gap-15">
                      <LabeledInput
                        label={"Nome"}
                        onChange={(e) => updateAssociate(index, "name", e.target.value)}
                        value={associate.name}
                        id={"associate_name" + index}
                        key={"associate_name" + index}
                        disabled />
                      <LabeledInput
                        label={"CPF"}
                        onChange={(e) => {
                          const value = maskCPF(e.target.value);
                          updateAssociate(index, "cpf", value);
                          return value;
                        }}
                        value={associate.cpf}
                        id={"associate_cpf" + index}
                        key={"associate_cpf" + index}
                        disabled />
                    </div>
                    <div className="flex gap-15">
                      <div className="flex flex-col w-80 gap-2">
                        <Label>Data de Nascimento</Label>
                        <DatePickerBirth
                          date={new Date(associate.birth_date || '2000-01-01')}
                          setDate={(newDate) => updateAssociate(index, "birth_date", newDate)}
                          isChild={true}
                          isDisabled
                        />
                      </div>
                      <FileUploadBlock
                        label="Documento com foto"
                        id={"associate_picture" + index}
                        associationId={user.id}
                        documentType={'documento_com_foto'}
                        documentsAssociation={'associates'}
                        userId={user.id}
                        setFile={(url) => updateAssociate(index, "url_document_picture", url)}
                        value={associate ? associate.url_document_picture : ""}
                        setStatus={(status) => updateAssociate(index, "document_picture_status", status)}
                        status={associate ? associate.document_picture_status : "neutral"}
                      />
                    </div>
                    <div className="flex gap-15">
                      <FileUploadBlock
                        label="Holerite recente"
                        id={"holerite" + index}
                        associationId={user.id}
                        documentType={'holerite'}
                        documentsAssociation={'associates'}
                        userId={user.id}
                        setFile={(url) => updateAssociate(index, "url_receipt_picture", url)}
                        value={associate ? associate.url_receipt_picture : ""}
                        setStatus={(status) => updateAssociate(index, "receipt_picture_status", status)}
                        status={associate ? associate.receipt_picture_status : "neutral"}
                      />
                      <FileUploadBlock
                        label="Carteira de Trabalho Digital"
                        id={"clt-digital" + index}
                        associationId={user.id}
                        documentType={'clt-digital'}
                        documentsAssociation={'associates'}
                        userId={user.id}
                        setFile={(url) => updateAssociate(index, "url_word_card_file", url)}
                        value={associate ? associate.url_word_card_file : ""}
                        setStatus={(status) => updateAssociate(index, "word_card_file_status", status)}
                        status={associate ? associate.word_card_file_status : "neutral"}
                      />
                    </div>
                  </div>
                  {
                    associate.disability == true ?
                      <div className="mb-8">
                        <FileUploadBlock
                          label="Documento comprobatório"
                          id={"associate_url_medical_report" + index}
                          associationId={user.id}
                          documentType={'doc_comprobatorio'}
                          documentsAssociation={'associates'}
                          userId={user.id}
                          setFile={(url) => updateAssociate(index, "url_medical_report", url)}
                          value={associate ? associate.url_medical_report : ""}
                          setStatus={(status) => updateAssociate(index, "medical_report_status", status)}
                          status={associate ? associate.medical_report_status : "neutral"}
                        />
                      </div>
                      :
                      <></>
                  }
                  <div className="items-top flex space-x-2 mb-4">
                    <Checkbox id="associate_disability" onCheckedChange={(checked) => { updateAssociate(index, "disability", checked) }} checked={associate.disability} disabled />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="associate_disability"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Possui dificuldade de locomoção ou laudo médico
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Marque esta opção caso tenha documento comprobatório.
                      </p>
                    </div>
                  </div>
                  <div className="items-top flex space-x-2">
                    <Checkbox id="associate_has_not_cpf" onCheckedChange={(checked) => { updateAssociate(index, "has_not_cpf", checked) }} checked={associate.has_not_cpf} disabled />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="associate_has_not_cpf"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Não possui CPF
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Marque esta opção caso a criança não tenha CPF.
                      </p>
                    </div>
                  </div>
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
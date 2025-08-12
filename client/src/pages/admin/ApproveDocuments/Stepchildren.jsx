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

export default function StepChildren({stepchildren, updateStepchild}) {
  const { user } = useAuth();

  return (
    <>
      <>
        <hr className="my-14" />
        <div className="w-full flex items-center justify-between">
          <Text heading="h2">Documentos dos enteados</Text>
        </div>
      </>
      {
        stepchildren.length > 0
        &&
        <>
          <div className="flex flex-col gap-8 mt-4">
            {stepchildren.map((stepchi, index) => (
              <Card className="w-fit">
                <CardContent>
                  <header className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-2 mb-4">
                      <UserRound strokeWidth={3} className="text-blue-500" width={20} />
                      <Text heading={'h3'}>{stepchi.name ? stepchi.name : `Criança ${index + 1}`}</Text>
                      <Badge variant="">#{stepchi.id?.slice(0, 8)}</Badge>
                    </div>
                  </header>
                  <div className="flex flex-col gap-8 mb-8">
                    <div className="flex gap-15">
                      <LabeledInput
                        label={"Nome"}
                        onChange={(e) => updateStepchild(index, "name", e.target.value)}
                        value={stepchi.name}
                        id={"stepchi_name" + index}
                        key={"stepchi_name" + index}
                        disabled />
                      <LabeledInput
                        label={"CPF"}
                        onChange={(e) => {
                          const value = maskCPF(e.target.value);
                          updateStepchild(index, "cpf", value);
                          return value;
                        }}
                        value={stepchi.cpf}
                        id={"stepchi_cpf" + index}
                        key={"stepchi_cpf" + index}
                        disabled />
                    </div>
                    <div className="flex gap-15">
                      <div className="flex flex-col w-80 gap-2">
                        <Label>Data de Nascimento</Label>
                        <DatePickerBirth
                          date={new Date(stepchi.birth_date || '2000-01-01')}
                          setDate={(newDate) => updateStepchild(index, "birth_date", newDate)}
                          isChild={true}
                          isDisabled
                        />
                      </div>
                      <FileUploadBlock
                        label="Documento com foto"
                        id={"stepchi_picture" + index}
                        associationId={user.id}
                        documentType={'documento_com_foto'}
                        documentsAssociation={'stepchildren'}
                        userId={user.id}
                        setFile={(url) => updateStepchild(index, "url_document_picture", url)}
                        value={stepchi ? stepchi.url_document_picture : ""}
                        setStatus={(status) => updateStepchild(index, "document_picture_status", status)}
                        status={stepchi ? stepchi.document_picture_status : "neutral"}
                      />
                    </div>
                  </div>
                  {
                    stepchi.disability == true ?
                      <div className="mb-8">
                        <FileUploadBlock
                          label="Documento comprobatório"
                          id={"stepchi_url_medical_report" + index}
                          associationId={user.id}
                          documentType={'doc_comprobatorio'}
                          documentsAssociation={'stepchildren'}
                          userId={user.id}
                          setFile={(url) => updateStepchild(index, "url_medical_report", url)}
                          value={stepchi ? stepchi.url_medical_report : ""}
                          setStatus={(status) => updateStepchild(index, "medical_report_status", status)}
                          status={stepchi ? stepchi.medical_report_status : "neutral"}
                        />
                      </div>
                      :
                      <></>
                  }
                  <div className="items-top flex space-x-2 mb-4">
                    <Checkbox id="stepchi_disability" onCheckedChange={(checked) => { updateStepchild(index, "disability", checked) }} checked={stepchi.disability} disabled />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="stepchi_disability"
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
                    <Checkbox id="stepchi_has_not_cpf" onCheckedChange={(checked) => { updateStepchild(index, "has_not_cpf", checked) }} checked={stepchi.has_not_cpf} disabled />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="stepchi_has_not_cpf"
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
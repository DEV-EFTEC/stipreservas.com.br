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

export default function Dependents({ setDependents, setSelectedDependents, dependentsParcial, selectedDependents, dependents, updateDependent, saveEntity, deleteEntity }) {
  const { user } = useAuth();

  return (
    <>
      <>
        <hr className="my-14" />
        <div className="w-full flex items-center justify-between">
          <Text heading="h2">Documentos dos dependentes</Text>
        </div>
      </>
      {
        dependents.length > 0
        &&
        <>
          <div className="flex flex-col gap-8 mt-4">
            {dependents.map((dep, index) => (
              <Card className="w-fit">
                <CardContent>
                  <header className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-2 mb-4">
                      <UserRound strokeWidth={3} className="text-blue-500" width={20} />
                      <Text heading={'h3'}>{dep.name ? dep.name : `Dependente ${index + 1}`}</Text>
                      <Badge>#{dep.id?.slice(0, 8)}</Badge>
                    </div>
                  </header>
                  <div className="flex flex-col gap-8 mb-8">
                    <div className="flex gap-15">
                      <LabeledInput
                        label={"Nome"}
                        onChange={(e) => updateDependent(index, "name", e.target.value)}
                        value={dep.name}
                        id={"dep_name" + index}
                        key={"dep_name" + index}
                        disabled />
                      <LabeledInput
                        label={"CPF"}
                        onChange={(e) => {
                          const value = maskCPF(e.target.value);
                          updateDependent(index, "cpf", value);
                          return value;
                        }}
                        value={dep.cpf}
                        id={"dep_cpf" + index}
                        key={"dep_cpf" + index}
                        disabled />
                    </div>
                    <div className="flex gap-15">
                      <div className="flex flex-col w-80 gap-2">
                        <Label>Data de Nascimento</Label>
                        <DatePickerBirth
                          date={new Date(dep.birth_date || '2000-01-01')}
                          setDate={(newDate) => updateDependent(index, "birth_date", newDate)}
                          isDisabled
                        />
                      </div>
                      <FileUploadBlock
                        label="Documento com foto"
                        id={"dep_picture" + index}
                        associationId={user.id}
                        documentType={'documento_com_foto'}
                        documentsAssociation={'dependents'}
                        userId={user.id}
                        setFile={(url) => updateDependent(index, "url_document_picture", url)}
                        value={dep ? dep.url_document_picture : ""}
                        setStatus={(status) => updateDependent(index, "document_picture_status", status)}
                        status={dep ? dep.document_picture_status : "neutral"}
                      />
                    </div>
                  </div>
                  {
                    dep.disability == true ?
                      <div className="mb-8">
                        <FileUploadBlock
                          label="Documento comprobatório"
                          id={"dep_url_medical_report" + index}
                          associationId={user.id}
                          documentType={'doc_comprobatorio'}
                          documentsAssociation={'dependents'}
                          userId={user.id}
                          setFile={(url) => updateDependent(index, "url_medical_report", url)}
                          value={dep ? dep.url_medical_report : ""}
                          setStatus={(status) => updateDependent(index, "medical_report_status", status)}
                          status={dep ? dep.medical_report_status : "neutral"}
                        />
                      </div>
                      :
                      <></>
                  }
                  <div className="items-top flex space-x-2">
                    <Checkbox id="dep_disability" onCheckedChange={(checked) => { updateDependent(index, "disability", checked) }} checked={dep.disability} disabled />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="dep_disability"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Possui dificuldade de locomoção ou laudo médico
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Marque esta opção caso tenha documento comprobatório.
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
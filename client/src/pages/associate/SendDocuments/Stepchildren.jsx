import LabeledInput from "@/components/LabeledInput";
import Text from "@/components/Text";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stepchildModel } from "@/models/stepchildModel";
import { UserRound } from "lucide-react";
import { columns } from "@/components/associate/ParcialName/columns";
import { FileUploadBlock } from "@/components/FileUploadBlock";
import { Label } from "@/components/ui/label";
import DatePickerBirth from "@/components/DatePickerBirth";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { DataTable } from "@/components/associate/ParcialName/data-table";
import { useAuth } from "@/hooks/useAuth";
import maskCPF from "@/lib/maskCPF";
import validarCpf from "validar-cpf";
import { toast } from "sonner";
import MonthYearCalendar from "@/components/month-year-calendar";

export default function Stepchildren({ setStepChild, setSelectedStepChildren, stepChildrenParcial, selectedStepChildren, stepchildren, updateStepChild, saveEntity, deleteEntity }) {
  const { user } = useAuth();

  return (
    <>
      <>
        <hr className="my-14" />
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap">
          <Text heading="h2">Documentos de enteados</Text>
          <div className="flex gap-2">
            <Button onClick={() => setStepChild(prevState => [...prevState, stepchildModel])}>Criar acompanhante</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary">Importar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Importar acompanhante</AlertDialogTitle>
                  <AlertDialogDescription>
                    Caso você já tenha feito reservas pela plataforma, salvamos o acompanhante informado nas reservas anteriores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <DataTable
                  columns={columns}
                  data={stepChildrenParcial}
                  onSelectionChange={(data) => setSelectedStepChildren(data.map(item => ({ ...item, is_saved: true })))}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    setStepChild(prevState => [...prevState, ...selectedStepChildren])
                  }}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </>
      {
        stepchildren.length > 0
        &&
        <>
          <div className="flex flex-col gap-8 mt-4">
            {stepchildren.map((ste, index) => (
              <Card className="w-fit">
                <CardContent>
                  <header className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-2 mb-4">
                      <UserRound strokeWidth={3} className="text-blue-500" width={20} />
                      <Text heading={'h3'}>{ste.name ? ste.name : `Enteado ${index + 1}`}</Text>
                      <Badge variant="">#{ste.id?.slice(0, 8)}</Badge>
                    </div>
                  </header>
                  <div className="flex flex-col gap-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-15">
                      <LabeledInput
                        label={"Nome"}
                        onChange={(e) => updateStepChild(index, "name", e.target.value)}
                        value={ste.name}
                        id={"ste_name" + index}
                        key={"ste_name" + index} />
                      <LabeledInput
                        label={"CPF"}
                        onChange={(e) => {
                          const value = maskCPF(e.target.value);
                          updateStepChild(index, "cpf", value);
                          return value;
                        }}
                        value={ste.cpf}
                        id={"ste_cpf" + index}
                        key={"ste_cpf" + index} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-15">
                      <div className="flex flex-col w-80 gap-2">
                        <Label>Data de Nascimento</Label>
                        <MonthYearCalendar date={new Date(ste.birth_date) || '2000-01-01'} setDate={(newDate) => updateStepChild(index, "birth_date", newDate)} />
                      </div>
                      <FileUploadBlock
                        label="Documento com foto"
                        id={"ste_picture" + index}
                        associationId={user.id}
                        documentType={'documento_com_foto'}
                        documentsAssociation={'stepchildren'}
                        userId={user.id}
                        setFile={(url) => updateStepChild(index, "url_document_picture", url)}
                        value={ste ? ste.url_document_picture : ""}
                      />
                    </div>
                  </div>
                  {
                    ste.disability == true ?
                      <div className="mb-8">
                        <FileUploadBlock
                          label="Documento comprobatório"
                          id={"ste_url_medical_report" + index}
                          associationId={user.id}
                          documentType={'doc_comprobatorio'}
                          documentsAssociation={'stepchildren'}
                          userId={user.id}
                          setFile={(url) => updateStepChild(index, "url_medical_report", url)}
                          value={ste ? ste.url_medical_report : ""}
                        />
                      </div>
                      :
                      <></>
                  }
                  <div className="items-top flex space-x-2 mb-4">
                    <Checkbox id="ste_disability" onCheckedChange={(checked) => { updateStepChild(index, "disability", checked) }} checked={ste.disability} />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="ste_disability"
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
                    <Checkbox id="ste_has_not_cpf" onCheckedChange={(checked) => { updateStepChild(index, "has_not_cpf", checked) }} checked={ste.has_not_cpf} />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="ste_has_not_cpf"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Não possui CPF
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Marque esta opção caso a criança não tenha CPF.
                      </p>
                    </div>
                  </div>
                  {
                    !ste.is_saved
                    &&
                    <div className="flex items-center mt-4 md:mt-0 md:justify-end w-full space-x-8">
                      <Button variant={'secondary'} onClick={() => deleteEntity('s', ste)}>Cancelar</Button>
                      <Button variant="default" onClick={async () => {
                        const cpf = ste?.cpf || "";
                        const hasNotCpf = !!ste?.has_not_cpf;

                        if (validarCpf(cpf) && !hasNotCpf) {
                          await saveEntity('s', ste);
                        } else if (cpf.trim().length === 0 && hasNotCpf) {
                          await saveEntity('s', ste);
                        } else {
                          toast.error(`CPF inválido para enteado(a) ${ste?.name || ''}`);
                        }
                      }}>
                        Salvar
                      </Button>
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
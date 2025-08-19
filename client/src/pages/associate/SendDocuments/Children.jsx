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
import { childModel } from "@/models/childModel";
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

export default function Children({ setChildren, setSelectedChildren, childrenParcial, selectedChildren, children, updateChild, saveEntity, deleteEntity }) {
  const { user } = useAuth();

  return (
    <>
      <>
        <hr className="my-4" />
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap">
          <Text heading="h2">Menores de 5 anos</Text>
          <div className="flex gap-2">
            <Button onClick={() => setChildren(prevState => [...prevState, childModel])}>Criar acompanhante</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Importar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Importar crianças</AlertDialogTitle>
                  <AlertDialogDescription>
                    Caso você já tenha feito reservas pela plataforma, salvamos as crianças informadas nas reservas anteriores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <DataTable
                  columns={columns}
                  data={childrenParcial}
                  onSelectionChange={(data) => setSelectedChildren(data.map(item => ({ ...item, is_saved: true })))}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    setChildren(prevState => [...prevState, ...selectedChildren])
                  }}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </>
      {
        children.length > 0
        &&
        <>
          <div className="flex flex-col gap-8 mt-4">
            {children.map((chi, index) => (
              <Card className="w-fit">
                <CardContent>
                  <header className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-2 mb-4">
                      <UserRound strokeWidth={3} className="text-blue-500" width={20} />
                      <Text heading={'h3'}>{chi.name ? chi.name : `Criança ${index + 1}`}</Text>
                      <Badge variant="">#{chi.id?.slice(0, 8)}</Badge>
                    </div>
                  </header>
                  <div className="flex flex-col gap-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-15">
                      <LabeledInput
                        label={"Nome"}
                        onChange={(e) => updateChild(index, "name", e.target.value)}
                        value={chi.name}
                        id={"chi_name" + index}
                        key={"chi_name" + index} />
                      <LabeledInput
                        label={"CPF"}
                        onChange={(e) => {
                          const value = maskCPF(e.target.value);
                          updateChild(index, "cpf", value);
                          return value;
                        }}
                        value={chi.cpf}
                        id={"chi_cpf" + index}
                        key={"chi_cpf" + index} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-15">
                      <div className="flex flex-col w-80 gap-2">
                        <Label>Data de Nascimento</Label>
                        <MonthYearCalendar
                          date={new Date(chi.birth_date || '2000-01-01')}
                          setDate={(newDate) => updateChild(index, "birth_date", newDate)}
                          isChild={true}
                        />
                      </div>
                      <FileUploadBlock
                        label="Documento com foto"
                        id={"chi_picture" + index}
                        associationId={user.id}
                        documentType={'documento_com_foto'}
                        documentsAssociation={'children'}
                        userId={user.id}
                        setFile={(url) => updateChild(index, "url_document_picture", url)}
                        value={chi ? chi.url_document_picture : ""}
                      />
                    </div>
                  </div>
                  {
                    chi.disability == true ?
                      <div className="mb-8">
                        <FileUploadBlock
                          label="Documento comprobatório"
                          id={"chi_url_medical_report" + index}
                          associationId={user.id}
                          documentType={'doc_comprobatorio'}
                          documentsAssociation={'children'}
                          userId={user.id}
                          setFile={(url) => updateChild(index, "url_medical_report", url)}
                          value={chi ? chi.url_medical_report : ""}
                        />
                      </div>
                      :
                      <></>
                  }
                  <div className="items-top flex space-x-2 mb-4">
                    <Checkbox id="chi_disability" onCheckedChange={(checked) => { updateChild(index, "disability", checked) }} checked={chi.disability} />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="chi_disability"
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
                    <Checkbox id="chi_has_not_cpf" onCheckedChange={(checked) => { updateChild(index, "has_not_cpf", checked) }} checked={chi.has_not_cpf} />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="chi_has_not_cpf"
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
                    !chi.is_saved
                    &&
                    <div className="flex items-center justify-end w-full space-x-8">
                      <Button variant={'secondary'} onClick={() => deleteEntity('c', chi)}>Cancelar</Button>
                      <Button variant="default" onClick={async () => {
                        const cpf = chi?.cpf || "";
                        const hasNotCpf = !!chi?.has_not_cpf;

                        if (validarCpf(cpf) && !hasNotCpf) {
                          await saveEntity('c', chi);
                        } else if (cpf.trim().length === 0 && hasNotCpf) {
                          await saveEntity('c', chi);
                        } else {
                          toast.error(`CPF inválido para criança ${chi?.name || ''}`);
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
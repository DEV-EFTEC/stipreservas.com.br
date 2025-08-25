import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { differenceInDays, format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { FileUploadBlock } from "@/components/FileUploadBlock";
import { UserRound } from "lucide-react";
import LabeledInput from "@/components/LabeledInput";
import { Label } from "@/components/ui/label";
import DatePickerBirth from "@/components/DatePickerBirth";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import validarCpf from "validar-cpf";
import { useDynamicList } from "@/hooks/useDynamicList";
import { toast } from "sonner";
import MonthYearCalendar from "@/components/month-year-calendar";

export default function ListChildren() {
  const { user } = useAuth();

  const {
    list: children,
    updateItem: updateChild,
    resetList: setChildren
  } = useDynamicList([]);

  useEffect(() => {
    (async () => {
      const result = await apiRequest(`/children/get-children`, {
        method: 'GET'
      });
      setChildren(result)
    })()
  }, []);

  async function handleUpdateChild(chi) {
    const { id, name, cpf, birth_date, disability, url_document_picture, url_medical_report } = chi;
    try {
      const result = await apiRequest(`/children/update-child/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          id, name, cpf, birth_date, disability, url_document_picture, url_medical_report
        })
      })

      if (result) {
        toast.success("Edição feita com sucesso");
      }

    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <section className="w-full xl:p-20 pr-2 overflow-y-auto">
      {
        children
        &&
        <section className="w-full pr-2 overflow-y-auto">
          <GlobalBreadcrumb />
          <div className="flex gap-12 items-end mb-8 flex-wrap">
            <Text heading="h1">Atualizar crianças</Text>
          </div>

          <section className="flex flex-column w-full justify-between flex-wrap lg:space-x-16">
            <section className="w-full md:w-[90%] lg:w-[80%] xl:w-[100%] flex-column space-y-8">
              {
                children.map((chi, index) => (
                  <Card className="w-fit">
                    <CardContent>
                      <header className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-2 mb-4">
                          <UserRound strokeWidth={3} className="text-blue-500" width={20} />
                          <Text heading={'h3'}>{chi.name ? chi.name : `Convidado ${index + 1}`}</Text>
                          <Badge variant="">#{chi.id?.slice(0, 8)}</Badge>
                        </div>
                      </header>
                      <div className="flex flex-col gap-8 mb-8">
                        <div className="flex gap-10 lg:gap-15 flex-wrap flex-col lg:flex-row">
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
                        <div className="flex gap-10 lg:gap-15 flex-wrap flex-col lg:flex-row">
                          <div className="flex flex-col w-80 gap-2">
                            <Label>Data de Nascimento</Label>
                            <MonthYearCalendar
                              date={new Date(chi.birth_date || '2000-01-01')}
                              setDate={(newDate) => updateChild(index, "birth_date", newDate)}
                            />
                          </div>
                          <FileUploadBlock
                            label="Documento com foto"
                            id={"chi_picture" + index}
                            associationId={user.id}
                            documentType={'documento_com_foto'}
                            documentsAssociation={'dependents'}
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
                              documentsAssociation={'dependents'}
                              userId={user.id}
                              setFile={(url) => updateChild(index, "url_medical_report", url)}
                              value={chi ? chi.url_medical_report : ""}
                            />
                          </div>
                          :
                          <></>
                      }
                      <div className="items-top flex space-x-2">
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
                      <div className="flex items-center justify-end w-full space-x-8">
                        <Button variant={'default'} onClick={async () => {
                          if (validarCpf(chi.cpf)) {
                            await handleUpdateChild(chi);
                          } else {
                            toast.error(`CPF Inválido para dependente ${chi.name}`)
                          }
                        }}>Salvar</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
            </section>
          </section>
        </section>
      }
    </section>
  )
}
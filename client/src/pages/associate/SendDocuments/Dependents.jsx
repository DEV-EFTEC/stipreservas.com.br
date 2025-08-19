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
import { dependentModel } from "@/models/dependentModel";
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
import { useEffect, useState } from "react";

export default function Dependents({ setDependents, setSelectedDependents, dependentsParcial, selectedDependents, dependents, updateDependent, saveEntity, deleteEntity }) {
  const { user } = useAuth();

  const [localSelected, setLocalSelected] = useState(new Set());

  useEffect(() => {
    const byId = new Set(selectedDependents?.map(d => d.id));
    setLocalSelected(new Set(byId));
  }, [selectedDependents]);

  const toggleSelect = (id) => {
    setLocalSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleContinueImport = () => {
    const selected = dependentsParcial.filter(d => localSelected.has(d.id))
      .map(item => ({ ...item, is_saved: true }));

    // evita duplicados por id
    setDependents(prev => {
      const idsExist = new Set(prev.map(p => p.id));
      const merged = [
        ...prev,
        ...selected.filter(s => !idsExist.has(s.id))
      ];
      return merged;
    });

    // se você quiser refletir para o estado externo:
    setSelectedDependents?.(selected);
  };

  return (
    <>
      <>
        <hr className="my-4" />
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between flex-wrap">
          <Text heading="h2">Dependentes</Text>
          <div className="flex gap-2">
            <Button onClick={() => setDependents(prevState => [...prevState, dependentModel])}>Criar acompanhante</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Importar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[calc(100%-24px)] max-w-[640px] p-0">
                <AlertDialogHeader>
                  <AlertDialogTitle className="w-[calc(100%-24px)] max-w-[640px] p-0">Importar dependentes</AlertDialogTitle>
                  <AlertDialogDescription className="w-[calc(100%-24px)] max-w-[640px] p-0">
                    Caso você já tenha feito reservas pela plataforma, salvamos os dependentes informados nas reservas anteriores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="hidden md:block">
                  <DataTable
                    columns={columns}
                    data={dependentsParcial}
                    onSelectionChange={(data) => setSelectedDependents(data.map(item => ({ ...item, is_saved: true })))}
                  />
                </div>
                <div className="max-h-[60vh] overflow-y-auto px-5 pb-5 block md:hidden">
                  {/* Cabeçalho estilo tabela só no >= sm */}
                  <div className="hidden sm:grid grid-cols-[32px_1fr_1fr_1fr] gap-3 px-2 py-2 text-xs font-medium text-slate-500">
                    <div />
                    <div>Nome</div>
                    <div>CPF</div>
                    <div>Data de nascimento</div>
                  </div>

                  {/* Lista responsiva */}
                  <ul className="space-y-2">
                    {dependentsParcial?.map((d) => {
                      const checked = localSelected.has(d.id);
                      const checkboxId = `dep-check-${d.id}`;
                      return (
                        <li
                          key={d.id}
                          className="rounded-lg border border-slate-200 bg-white p-3 sm:grid sm:grid-cols-[32px_1fr_1fr_1fr] sm:items-center sm:gap-3"
                        >
                          {/* checkbox */}
                          <div className="flex items-start sm:items-center">
                            <input
                              id={checkboxId}
                              type="checkbox"
                              className="h-5 w-5 mt-0.5 sm:mt-0"
                              checked={checked}
                              onChange={() => toggleSelect(d.id)}
                            />
                          </div>

                          {/* Nome */}
                          <div className="mt-2 sm:mt-0">
                            <label
                              htmlFor={checkboxId}
                              className="text-sm font-medium text-slate-900"
                            >
                              {d.name}
                            </label>

                            {/* No mobile, mostramos os rótulos internos */}
                            <div className="sm:hidden mt-1 text-xs text-slate-600 space-y-0.5">
                              <div><span className="font-medium">CPF:</span> {d.cpf}</div>
                              <div><span className="font-medium">Nascimento:</span> {d.birth_date || d.birth}</div>
                            </div>
                          </div>

                          {/* Colunas extras só no >= sm */}
                          <div className="hidden sm:block text-sm text-slate-700">{d.cpf}</div>
                          <div className="hidden sm:block text-sm text-slate-700">{d.birth_date || d.birth}</div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <AlertDialogFooter className="w-[calc(100%-24px)] max-w-[640px] p-0 hidden md:block">
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    setDependents(prevState => [...prevState, ...selectedDependents])
                  }}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
                <AlertDialogFooter className="w-[calc(100%-24px)] max-w-[640px] p-0 block md:hidden">
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={!localSelected.size}
                    onClick={handleContinueImport}
                  >
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
                      <Badge variant="">#{dep.id?.slice(0, 8)}</Badge>
                    </div>
                  </header>
                  <div className="flex flex-col gap-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-15">
                      <LabeledInput
                        label={"Nome"}
                        onChange={(e) => updateDependent(index, "name", e.target.value)}
                        value={dep.name}
                        id={"dep_name" + index}
                        key={"dep_name" + index} />
                      <LabeledInput
                        label={"CPF"}
                        onChange={(e) => {
                          const value = maskCPF(e.target.value);
                          updateDependent(index, "cpf", value);
                          return value;
                        }}
                        value={dep.cpf}
                        id={"dep_cpf" + index}
                        key={"dep_cpf" + index} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-15">
                      <div className="flex flex-col w-80 gap-2">
                        <Label>Data de Nascimento</Label>
                        <MonthYearCalendar
                          date={new Date(dep.birth_date || '2000-01-01')}
                          setDate={(newDate) => updateDependent(index, "birth_date", newDate)}
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
                        />
                      </div>
                      :
                      <></>
                  }
                  <div className="items-top flex space-x-2">
                    <Checkbox id="dep_disability" onCheckedChange={(checked) => { updateDependent(index, "disability", checked) }} checked={dep.disability} />
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
                  {
                    !dep.is_saved
                    &&
                    <div className="flex items-center mt-4 md:mt-0 md:justify-end w-full space-x-8">
                      <Button variant={'secondary'} onClick={() => deleteEntity('d', dep)}>Cancelar</Button>
                      <Button variant={'default'} onClick={async () => {
                        if (validarCpf(dep.cpf)) {
                          await saveEntity('d', dep);
                        } else {
                          toast.error(`CPF Inválido para dependente ${dep.name}`)
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
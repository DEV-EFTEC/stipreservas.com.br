import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Text from "@/components/Text";
import { FileUploadBlock } from "@/components/FileUploadBlock";
import { Baby, HelpCircle, UserRound, UsersRound } from "lucide-react";
import { useDynamicList } from "@/hooks/useDynamicList";
import DatePickerBirth from "@/components/DatePickerBirth";
import LabeledInput from "@/components/LabeledInput";
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import Aside from "@/components/Aside";
import { useBooking } from "@/hooks/useBooking";
import { apiRequest } from "@/lib/api";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { DataTable } from "@/components/associate/ParcialName/data-table";
import { columns } from "@/components/associate/ParcialName/columns";
import { dependentModel } from "@/models/dependentModel";

export default function SendDocuments() {
  const { user } = useAuth();
  const { booking, loadingBooking, saveBooking, setBooking } = useBooking();
  const navigate = useNavigate();
  const [dependentsParcial, setDependentsParcial] = useState([]);
  const [guestsParcial, setGuestsParcial] = useState([]);
  const [childrenParcial, setChildrenParcial] = useState([]);
  const [selectedDependents, setSelectedDependents] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);

  const {
    list: dependents,
    updateItem: updateDependent,
    resetList: setDependents
  } = useDynamicList([]);

  const {
    list: guests,
    updateItem: updateGuest,
    resetList: setGuests
  } = useDynamicList([]);

  const {
    list: children,
    updateItem: updateChild,
    resetList: setChildren
  } = useDynamicList([]);

  const enumEntityUpdateRoute = {
    'd': '/dependents/update-dependent',
    'g': '/guests/update-guest',
    'c': '/children/update-child'
  }

  const enumEntityDeleteRoute = {
    'd': '/dependents/delete-dependent',
    'g': '/guests/delete-guest',
    'c': '/children/delete-child'
  }

  useEffect(() => {
    if (loadingBooking) return;

    async function fetchData() {
      const response = await apiRequest(`/bookings/get-booking-complete?booking_id=${booking.id}`);

      if (response) {
        setDependents(response.dependents);

        setGuests(response.guests);

        setChildren(response.children);
      }
    }

    if (booking) {
      fetchData();
    }
  }, [booking]);

  useEffect(() => {
    (async () => {
      const response_dep = await apiRequest(`/dependents/get-dependents?id=${user.id}`, {
        method: "GET"
      });
      const response_gue = await apiRequest(`/guests/get-guests?id=${user.id}`, {
        method: "GET"
      });
      const response_chi = await apiRequest(`/children/get-children?id=${user.id}`, {
        method: "GET"
      });
      setDependentsParcial(response_dep);
      setGuestsParcial(response_gue);
      setChildrenParcial(response_chi);
    })();
  }, []);

  async function handleSubmit() {
    await apiRequest("/bookings/update-participants", {
      method: "POST",
      body: JSON.stringify({
        dependents,
        guests,
        children
      })
    });

    const result = await apiRequest("/bookings/update-booking", {
      method: "POST",
      body: JSON.stringify({
        id: booking.id,
        url_receipt_picture: booking.url_receipt_picture,
        url_word_card_file: booking.url_word_card_file
      })
    })

    saveBooking(result);
    navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/escolher-quarto`);
  }

  async function createEntity(key) {
    const result = await apiRequest(`/${key}/`, {
      method: 'POST',
      body: JSON.stringify({
        created_by: user.id
      })
    });

    if (result) {
      setDependents(prevState => [...prevState, result]);
    }
  }

  async function saveEntity(entity) {
    const result = await apiRequest(`/${key}/`, {
      method: 'POST',
      body: JSON.stringify({
        ...entity,
        created_by: user.id
      })
    });

    if (result) {
      setDependents(prevState => {
        const filtered = prevState.filter(d => d.cpf === result.cpf);
        return [...filtered, result];
      });
    };
  }

  async function updateEntity(key, entity, index) {
    const { is_saved, ...newEntity } = entity;
    await apiRequest(`${enumEntityUpdateRoute[key]}/${entity.id}`, {
      method: "PATCH",
      body: JSON.stringify(newEntity)
    });
    await apiRequest(`/dependents/create-dependent-booking`, {
      method: "POST",
      body: JSON.stringify({
        dependent_id: entity.id,
        booking_id: booking.id
      })
    });
    updateDependent(index, "is_saved", true);
  }

  function deleteEntity(key, entity) {
    apiRequest(`${enumEntityDeleteRoute[key]}/${entity.id}`, {
      method: "DELETE"
    });

    setDependents(prevState => {
      const newState = prevState.filter(e => e.id !== entity.id);
      return newState;
    });
  }

  return (
    <>
      <section className="flex w-full p-20 justify-between">
        <section className="w-fit">
          <GlobalBreadcrumb />
          <div className="flex gap-12 items-end mb-8">
            <Text heading="h1">Envio de Documentos</Text>
            <div className="flex items-center gap-2">
              <Label>Solicitação</Label>
              <Badge variant="">#{booking && booking.id.slice(0, 8)}</Badge>
            </div>
          </div>
          <Text heading="h2">Documentos do titular</Text>
          <Card className="w-fit mb-7 mt-5">
            <CardContent className="flex gap-15 w-fit">
              <FileUploadBlock
                label="Holerite recente"
                id="holerite"
                tooltip="Holerites emitidos há mais de 30 dias serão rejeitados na fase de aprovação."
                associationId={user.id}
                documentType={'holerite'}
                documentsAssociation={'holder'}
                userId={user.id}
                key={'holerite_sender'}
                setFile={(url) => setBooking(prevState => {
                  const newURL = url; return {
                    ...prevState,
                    url_receipt_picture: newURL
                  }
                })}
                value={booking ? booking.url_receipt_picture : ""}
              />
              <FileUploadBlock
                label="Carteira de Trabalho Digital"
                id="clt-digital"
                tooltip="CLTs não digitais serão rejeitadas na fase de aprovação. CLTs digitais nos ajudam a evitar fraudes."
                associationId={user.id}
                documentType={'clt_digital'}
                documentsAssociation={'holder'}
                userId={user.id}
                setFile={(url) => setBooking(prevState => {
                  const newURL = url; return {
                    ...prevState,
                    url_word_card_file: newURL
                  }
                })}
                value={booking ? booking.url_word_card_file : ""}
              />
            </CardContent>
          </Card>
          {
            dependents.length > 0
              ?
              <>
                <hr className="my-14" />
                <div className="w-full flex items-center justify-between">
                  <Text heading="h2">Documentos dos dependentes</Text>
                </div>
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
                          <div className="flex gap-15">
                            <LabeledInput
                              label={"Nome"}
                              onChange={(e) => updateDependent(index, "name", e.target.value)}
                              value={dep.name}
                              id={"dep_name" + index}
                              key={"dep_name" + index} />
                            <LabeledInput
                              label={"CPF"}
                              onChange={(e) => updateDependent(index, "cpf", e.target.value)}
                              value={dep.cpf}
                              id={"dep_cpf" + index}
                              key={"dep_cpf" + index} />
                          </div>
                          <div className="flex gap-15">
                            <div className="flex flex-col w-80 gap-2">
                              <Label>Data de Nascimento</Label>
                              <DatePickerBirth
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
                          <Checkbox id="dep_disability" onClick={(e) => { updateDependent(index, "disability", e.currentTarget.ariaChecked == 'true' ? false : true) }} />
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
                          <div className="flex items-center justify-end w-full space-x-8">
                            <Button variant={'secondary'}>Cancelar</Button>
                            <Button variant={'default'} onClick={() => updateEntity('d', dep, index)}>Salvar</Button>
                          </div>
                        }
                      </CardContent>
                    </Card>
                  ))
                  }
                </div>
              </>
              :
              <>
                <hr className="my-14" />
                <div className="w-full flex items-center justify-between">
                  <Text heading="h2">Documentos dos dependentes</Text>
                </div>
              </>
          }
          <Button onClick={() => setDependents(prevState => [...prevState, dependentModel])}>Criar dependente</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">Importar dependentes</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Importar dependentes</AlertDialogTitle>
                <AlertDialogDescription>
                  Caso você já tenha feito reservas pela plataforma, salvamos os dependentes informados nas reservas anteriores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <DataTable
                columns={columns}
                data={dependentsParcial}
                onSelectionChange={(data) => setSelectedDependents(data)}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  console.log("Dependentes selecionados:", selectedDependents);
                  setDependents(prevState => [...prevState, ...selectedDependents])
                }}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {
            guests.length > 0
            &&
            <>
              <hr className="my-14" />
              <div className="w-full flex items-center justify-between">
                <Text heading="h2">Documentos dos convidados</Text>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary">Importar convidados</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Importar convidados</AlertDialogTitle>
                      <AlertDialogDescription>
                        Caso você já tenha feito reservas pela plataforma, salvamos os dependentes informados nas reservas anteriores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <DataTable
                      columns={columns}
                      data={guestsParcial}
                      onSelectionChange={(data) => setSelectedGuests(data)}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        setGuests(selectedGuests);
                      }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex flex-col gap-8 mt-4">
                {guests.map((gue, index) => (
                  <Card className="w-fit">
                    <CardContent>
                      <header className="flex items-center gap-2 mb-4">
                        <UsersRound strokeWidth={3} className="text-pink-500" width={20} />
                        <Text heading={'h3'}>{gue.name ? gue.name : `Convidado ${index + 1}`}</Text>
                        <Badge variant="">#{gue.id?.slice(0, 8)}</Badge>
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
                            onChange={(e) => updateGuest(index, "cpf", e.target.value)}
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
                            documentsAssociation={'dependents'}
                            userId={user.id}
                            setFile={(url) => updateGuest(index, "url_document_picture", url)}
                            value={gue ? gue.url_document_picture : ""}
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
                              documentsAssociation={'dependents'}
                              userId={user.id}
                              setFile={(url) => updateGuest(index, "url_medical_report", url)}
                              value={gue ? gue.url_medical_report : ""}
                            />
                          </div>
                          :
                          <></>
                      }
                      <div className="items-top flex space-x-2">
                        <Checkbox id="gue_disability" onClick={(e) => { updateGuest(index, "disability", e.currentTarget.ariaChecked == 'true' ? false : true) }} />
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
                    </CardContent>
                  </Card>
                ))
                }
              </div>
            </>
          }
          {
            children.length > 0
            &&
            <>
              <hr className="my-14" />
              <div className="w-full flex items-center justify-between">
                <Text heading="h2">Documentos de crianças menores de 5 anos</Text>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary">Importar crianças</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Importar crianças</AlertDialogTitle>
                      <AlertDialogDescription>
                        Caso você já tenha feito reservas pela plataforma, salvamos os dependentes informados nas reservas anteriores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <DataTable
                      columns={columns}
                      data={childrenParcial}
                      onSelectionChange={(data) => setSelectedChildren(data)}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        setChildren(selectedChildren);
                      }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex flex-col gap-8 mt-4">
                {children.map((chi, index) => (
                  <Card className="w-fit">
                    <CardContent>
                      <header className="flex items-center gap-2 mb-4">
                        <Baby strokeWidth={3} className="text-orange-500" width={20} />
                        <Text heading={'h3'}>{chi.name ? chi.name : `Criança ${index + 1}`}</Text>
                        <Badge variant="">#{chi.id?.slice(0, 8)}</Badge>
                      </header>
                      <div className="flex flex-col gap-8 mb-8">
                        <div className="flex gap-15">
                          <LabeledInput
                            label={"Nome"}
                            onChange={(e) => updateChild(index, "name", e.target.value)}
                            value={chi.name}
                            id={"chi_name" + index}
                            key={"chi_name" + index} />
                          <LabeledInput
                            label={"CPF"}
                            onChange={(e) => updateChild(index, "cpf", e.target.value)}
                            value={chi.cpf}
                            id={"chi_cpf" + index}
                            key={"chi_cpf" + index} />
                        </div>
                        <div className="flex gap-15">
                          <div className="flex flex-col w-80 gap-2">
                            <Label>Data de Nascimento</Label>
                            <DatePickerBirth
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
                        <Checkbox id="chi_disability" onClick={(e) => { updateChild(index, "disability", e.currentTarget.ariaChecked == 'true' ? false : true) }} />
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
                    </CardContent>
                  </Card>
                ))
                }
              </div>
            </>
          }
        </section>
        <Aside action={handleSubmit} />
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Text from "@/components/Text";
import { FileUploadBlock } from "@/components/FileUploadBlock";
import { useDynamicList } from "@/hooks/useDynamicList";
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth";
import Aside from "@/components/Aside";
import { useBooking } from "@/hooks/useBooking";
import { apiRequest } from "@/lib/api";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { useNavigate } from "react-router-dom";
import Dependents from "./Dependents";
import Guests from "./Guests";
import Children from "./Children";
import LabeledInput from "@/components/LabeledInput";
import { UserRound } from "lucide-react";
import DatePickerBirth from "@/components/DatePickerBirth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [selectedAssociates, setSelectedAssociates] = useState([]);
  const [cpf, setCpf] = useState();

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

  useEffect(() => {
    if (!booking || loadingBooking) return;

    const fetchData = async () => {
      const response = await apiRequest(`/bookings/get-booking-complete?booking_id=${booking.id}`);
      if (response) {
        setDependents(response.dependents);
        setGuests(response.guests);
        setChildren(response.children);
      }
    };

    fetchData();
  }, []);

  async function searchUser() {
    try {
      const result = await apiRequest("/users/find-user-by-cpf", {
        method: "POST",
        body: JSON.stringify({
          cpf: cpf
        })
      });

      if (result) {
        setSelectedAssociates(prevState => [result, ...prevState]);
      }
    } catch (err) {
      toast.error(err.error)
      console.error(err)
    }
  }

  useEffect(() => {
    (async () => {
      const response_dep = await apiRequest(`/dependents/get-dependents`, {
        method: "GET"
      });
      const response_gue = await apiRequest(`/guests/get-guests`, {
        method: "GET"
      });
      const response_chi = await apiRequest(`/children/get-children`, {
        method: "GET"
      });
      setDependentsParcial(response_dep);
      setGuestsParcial(response_gue);
      setChildrenParcial(response_chi);
    })();
  }, []);

  useEffect(() => {
    if (!booking) return;
    saveBooking({
      ...booking,
      dependents_quantity: dependents.length,
      guests_quantity: guests.length,
      children_age_max_quantity: children.length,
    });
  }, [dependents.length, guests.length, children.length]);

  async function handleSubmit() {
    await apiRequest("/bookings/create-participants-booking", {
      method: "POST",
      body: JSON.stringify({
        dependents: dependents.map(({ id }) => ({ dependent_id: id, booking_id: booking.id, check_in: booking.check_in, check_out: booking.check_out })),
        guests: guests.map(({ id }) => ({ guest_id: id, booking_id: booking.id, check_in: booking.check_in, check_out: booking.check_out })),
        children: children.map(({ id }) => ({ child_id: id, booking_id: booking.id, check_in: booking.check_in, check_out: booking.check_out })),
        associates: selectedAssociates.map(({ id }) => ({
          associate_booking: {
            associate_id: id, booking_id: booking.id, check_in: booking.check_in, check_out: booking.check_out
          },
          associate_booking_invite: {
            booking_id: booking.id,
            associate_invited_id: id,
            created_by: user.id,
            status: 'pending'
          }
        })),
        holders: []
      })
    });

    const result = await apiRequest("/bookings/update-booking", {
      method: "POST",
      body: JSON.stringify({
        id: booking.id,
        url_receipt_picture: booking.url_receipt_picture,
        url_word_card_file: booking.url_word_card_file,
        dependents_quantity: dependents.length,
        guests_quantity: guests.length,
        children_age_max_quantity: children.length
      })
    });

    saveBooking({ ...booking, ...result, associates_quantity: selectedAssociates.length });
    navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/escolher-quarto`);
  }

  const enumSaveEntity = {
    'd': '/dependents',
    'g': '/guests',
    'c': '/children'
  }

  const entitySetters = {
    d: setDependents,
    g: setGuests,
    c: setChildren,
  };

  const enumSetSaveEntity = (key, result) => {
    const setter = entitySetters[key];
    if (!setter) return;

    setter(prevState => {
      const exists = prevState.some(item => item.cpf === result.cpf);
      if (exists) {
        return prevState.map(item =>
          item.cpf === result.cpf ? { ...result, is_saved: true } : item
        );
      } else {
        return [...prevState, { ...result, is_saved: true }];
      }
    });
  };

  async function saveEntity(key, entity) {
    const { is_saved, id, ...newEntity } = entity;
    const result = await apiRequest(enumSaveEntity[key], {
      method: 'POST',
      body: JSON.stringify({
        ...newEntity,
        created_by: user.id
      })
    });

    if (result) {
      enumSetSaveEntity(key, result);
    };
  }

  function deleteEntity(key, entity) {
    setDependents(prevState => {
      const newState = prevState.filter(e => e.id !== entity.id);
      return newState;
    });
  }

  return (
    <>
      <section className="w-full xl:flex xl:justify-between 2xl:space-x-24 xl:space-x-8 xl:p-20 pr-2 overflow-y-auto">
        <section className="w-fit">
          <GlobalBreadcrumb />
          <div className="flex space-x-12 items-end mb-8 flex-wrap 2xl:flex-nowrap">
            <Text heading="h1">Envio de Documentos</Text>
            <div className="flex items-center gap-2">
              <Label>Solicitação</Label>
              <Badge variant="">#{booking && booking.id.slice(0, 8)}</Badge>
            </div>
          </div>
          <Text heading="h2">Documentos do titular</Text>
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
            booking &&
            booking.url_word_card_file &&
            booking.url_receipt_picture &&
            <>
              <Dependents
                setDependents={setDependents}
                setSelectedDependents={setSelectedDependents}
                dependentsParcial={dependentsParcial}
                selectedDependents={selectedDependents}
                dependents={dependents}
                updateDependent={updateDependent}
                saveEntity={saveEntity}
                deleteEntity={deleteEntity}
              />
              <Guests
                setGuests={setGuests}
                setSelectedGuests={setSelectedGuests}
                guestsParcial={guestsParcial}
                selectedGuests={selectedGuests}
                guests={guests}
                updateGuest={updateGuest}
                saveEntity={saveEntity}
                deleteEntity={deleteEntity}
              />
              <Children
                setChildren={setChildren}
                setSelectedChildren={setSelectedChildren}
                childrenParcial={childrenParcial}
                selectedChildren={selectedChildren}
                children={children}
                updateChild={updateChild}
                saveEntity={saveEntity}
                deleteEntity={deleteEntity}
              />
              <hr className="my-14" />
              <div className="w-full flex justify-between flex-col">
                <Text heading="h2">Outros associados</Text>
                <div className="flex w-fit space-x-4">
                  <Input onChange={(e) => setCpf(e.target.value)} placeholder="Digite o CPF do associado" />
                  <Button onClick={searchUser}>Procurar</Button>
                </div>
                {
                  selectedAssociates.length > 0
                  &&
                  <>
                    <div className="flex flex-col gap-8 mt-4">
                      {selectedAssociates.map((asc, index) => (
                        <Card className="w-fit">
                          <CardContent>
                            <header className="flex w-full justify-between items-center">
                              <div className="flex items-center gap-2 mb-4">
                                <UserRound strokeWidth={3} className="text-blue-500" width={20} />
                                <Text heading={'h3'}>{asc.name ? asc.name : `Criança ${index + 1}`}</Text>
                                <Badge variant="">#{asc.id?.slice(0, 8)}</Badge>
                              </div>
                            </header>
                            <div className="flex flex-col gap-8 mb-8">
                              <div className="flex gap-15">
                                <LabeledInput
                                  label={"Nome"}
                                  onChange={(e) => updateChild(index, "name", e.target.value)}
                                  value={asc.name}
                                  disabled
                                  id={"asc_name" + index}
                                  key={"asc_name" + index} />
                                <LabeledInput
                                  label={"CPF"}
                                  disabled
                                  onChange={(e) => {
                                    const value = maskCPF(e.target.value);
                                    updateChild(index, "cpf", value);
                                    return value;
                                  }}
                                  value={asc.cpf}
                                  id={"asc_cpf" + index}
                                  key={"asc_cpf" + index} />
                              </div>
                              <div className="flex gap-15">
                                <div className="flex flex-col w-80 gap-2">
                                  <Label>Data de Nascimento</Label>
                                  <DatePickerBirth
                                    date={new Date(asc.birth_date || '2000-01-01')}
                                    setDate={(newDate) => updateChild(index, "birth_date", newDate)}
                                    isChild={true}
                                  />
                                </div>
                                <FileUploadBlock
                                  label="Documento com foto"
                                  id={"asc_picture" + index}
                                  associationId={user.id}
                                  documentType={'documento_com_foto'}
                                  documentsAssociation={'children'}
                                  userId={user.id}
                                  allowEdit={false}
                                  setFile={(url) => updateChild(index, "url_document_picture", url)}
                                  value={asc ? asc.url_document_picture : ""}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                      }
                    </div>
                  </>
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

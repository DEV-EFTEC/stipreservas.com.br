import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Text from "@/components/Text";
import { FileUploadBlock } from "@/components/admin/FileUploadBlock";
import { useDynamicList } from "@/hooks/useDynamicList";
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth";
import Aside from "@/components/admin/Aside";
import { useBooking } from "@/hooks/useBooking";
import { apiRequest } from "@/lib/api";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { useNavigate } from "react-router-dom";
import Dependents from "./Dependents";
import Guests from "./Guests";
import Children from "./Children";
import { checkBookingStatus } from "@/lib/checkBookingStatus";
import { toast } from "sonner";

export default function ApproveDocuments() {
  const { user } = useAuth();
  const { booking, loadingBooking, saveBooking, setBooking } = useBooking();
  const navigate = useNavigate();
  const [dependentsParcial, setDependentsParcial] = useState([]);
  const [guestsParcial, setGuestsParcial] = useState([]);
  const [childrenParcial, setChildrenParcial] = useState([]);
  const [selectedDependents, setSelectedDependents] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [bookingStatus, setBookingStatus] = useState();

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

  useEffect(() => {
    if (!booking) return;
    saveBooking({
      ...booking,
      dependents_quantity: dependents.length,
      guests_quantity: guests.length,
      children_age_max_quantity: children.length,
    });
  }, [dependents.length, guests.length, children.length]);

  useEffect(() => {
    const status = checkBookingStatus(booking);
    setBookingStatus(status.status);
    if (status.status === 'neutral') {
      toast.info(status.message, {
        description: (
          <div>
            {status.details.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        )
      });
    } else if (status.status === 'approved') {
      toast.success(status.message, {
        description: "Está permitido o procedimento de aprovação da reserva."
      });
    } else if (status.status === 'refused') {
      toast.error(status.message, {
        description: "Está permitido o procedimento de recusa da reserva."
      });
    }
  }, [booking, dependents, guests, children]);

  async function handleSubmit() {
    await apiRequest("/bookings/create-participants-booking", {
      method: "POST",
      body: JSON.stringify({
        dependents: dependents.map(({ id }) => ({ dependent_id: id, booking_id: booking.id, check_in: booking.check_in, check_out: booking.check_out })),
        guests: guests.map(({ id }) => ({ guest_id: id, booking_id: booking.id, check_in: booking.check_in, check_out: booking.check_out })),
        children: children.map(({ id }) => ({ child_id: id, booking_id: booking.id, check_in: booking.check_in, check_out: booking.check_out })),
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

    saveBooking(result);
    navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/escolher-quarto`);
  }

  const enumSaveEntity = {
    'd': '/dependents/update-dependent',
    'g': '/guests/update-guest',
    'c': '/children/update-child'
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
    const { is_saved, id, medical_report_status, document_picture_status, ...newEntity } = entity;
    const result = await apiRequest(`${enumSaveEntity[key]}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        medical_report_status,
        document_picture_status,
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
                setStatus={(status) => setBooking(prevState => {
                  const newReceiptStatus = status;
                  return {
                    ...prevState,
                    receipt_picture_status: newReceiptStatus
                  }
                })}
                value={booking ? booking.url_receipt_picture : ""}
                status={booking ? booking.receipt_picture_status : "neutral"}
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
                setStatus={(status) => setBooking(prevState => (
                  {
                    ...prevState,
                    word_card_file_status: status
                  }
                ))}
                value={booking ? booking.url_word_card_file : ""}
                status={booking ? booking.word_card_file_status : "neutral"}
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
            </>
          }
        </section>
        <Aside action={handleSubmit} status={bookingStatus} />
      </section>
    </>
  );
}

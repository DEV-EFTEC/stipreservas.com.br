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
import Associates from "./Associates";
import StepChildren from "./Stepchildren";

export default function ApproveDocuments() {
  const { user } = useAuth();
  const { booking, loadingBooking, saveBooking, setBooking } = useBooking();
  const navigate = useNavigate();
  const [bookingStatus, setBookingStatus] = useState();
  const [finalPath, setFinalPath] = useState('');

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

  const {
    list: stepchildren,
    updateItem: updateStepchild,
    resetList: setStepchildren
  } = useDynamicList([]);

  const {
    list: associates,
    updateItem: updateAssociate,
    resetList: setAssociates
  } = useDynamicList([]);

  const {
    list: holders,
    updateItem: updateHolder,
    resetList: setHolders
  } = useDynamicList([]);

  useEffect(() => {
    if (!booking || loadingBooking) return;

    const fetchData = async () => {
      const response = await apiRequest(`/bookings/get-booking-complete?booking_id=${booking.id}`);
      if (response) {
        setDependents(response.dependents);
        setGuests(response.guests);
        setChildren(response.children);
        setAssociates(response.associates);
        setStepchildren(response.stepchildren);
        setHolders(response.holders);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!booking) return;
    saveBooking({
      ...booking,
      dependents_quantity: dependents.length,
      guests_quantity: guests.length,
      children_age_max_quantity: children.length,
    });
  }, [dependents.length, guests.length, children.length, associates.length, stepchildren.length]);

  useEffect(() => {
    if (!booking) return;

    const status = checkBookingStatus(booking, dependents, guests, children, associates, stepchildren);
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
      setFinalPath(`/admin/enviar-aprovacao/${booking.id}`);
    } else if (status.status === 'refused') {
      toast.error(status.message, {
        description: "Está permitido o procedimento de recusa da reserva."
      });
      setFinalPath(`/admin/enviar-recusa/${booking.id}`);
    }

  }, [booking, dependents, guests, children, associates, stepchildren, holders]);

  async function handleSubmit() {
    await apiRequest(`/bookings/update-participants/${booking.id}`, {
      method: "PUT",
      body: JSON.stringify({
        dependents: dependents.map(({ id, medical_report_status, document_picture_status }) => ({ id, medical_report_status, document_picture_status })),
        guests: guests.map(({ id, medical_report_status, document_picture_status }) => ({ id, medical_report_status, document_picture_status })),
        children: children.map(({ id, medical_report_status, document_picture_status }) => ({ id, medical_report_status, document_picture_status })),
        stepchildren: children.map(({ id, medical_report_status, document_picture_status }) => ({ id, medical_report_status, document_picture_status })),
        associates: children.map(({ id, word_card_file_status, receipt_picture_status, document_picture_status }) => ({ id, word_card_file_status, receipt_picture_status, document_picture_status })),
        holders: holders.map(({ id, document_picture_status }) => ({ id, document_picture_status })),
        word_card_file_status: booking.word_card_file_status,
        receipt_picture_status: booking.receipt_picture_status
      })
    });

    navigate(finalPath);
  }

  return (
    <>
      <section className="flex w-full p-20 justify-between">
        <section className="w-fit">
          <GlobalBreadcrumb />
          <div className="flex gap-12 items-end mb-8">
            <Text heading="h1">Aprovação de Documentos</Text>
            <div className="flex items-center gap-2">
              <Label>Solicitação</Label>
              <Badge variant="">#{booking && booking.id.slice(0, 8)}</Badge>
            </div>
          </div>
          <Text heading="h2">Documentos do titular 1</Text>
          <Card className="w-fit mb-7 mt-5">
            <CardContent className="flex gap-15 w-fit">
              {
                holders.length > 0 &&
                <FileUploadBlock
                  label="Documento com foto"
                  id="documento_com_foto"
                  associationId={holders[0].id}
                  documentType={'documento_com_foto'}
                  documentsAssociation={'holder'}
                  userId={holders[0].id}
                  key={'document_picture'}
                  setFile={(url) => setBooking(prevState => {
                    const newURL = url; return {
                      ...prevState,
                      url_receipt_picture: newURL
                    }
                  })}
                  setStatus={(status) =>
                    setHolders(prevState => {
                      return [{ ...prevState[0], document_picture_status: status }]
                    })
                  }
                  value={booking ? holders[0].url_document_picture : ""}
                  status={booking ? holders[0].document_picture_status : "neutral"}
                />
              }
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
              {
                dependents.length > 0
                &&
                <Dependents
                  dependents={dependents}
                  updateDependent={updateDependent}
                />
              }
              {
                guests.length > 0
                &&
                <Guests
                  guests={guests}
                  updateGuest={updateGuest}
                />
              }
              {
                children.length > 0
                &&
                <Children
                  children={children}
                  updateChild={updateChild}
                />
              }
              {
                stepchildren.length > 0
                &&
                <StepChildren
                  stepchildren={stepchildren}
                  updateStepchild={updateStepchild}
                />
              }
              {
                associates.length > 0
                &&
                <Associates
                  associates={associates}
                  updateAssociate={updateAssociate}
                />
              }
            </>
          }
        </section>
        <Aside action={handleSubmit} status={bookingStatus} />
      </section>
    </>
  );
}

import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { addDays, differenceInDays, eachDayOfInterval, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";
import { useBookingPrice, calculateTotalPrice } from "@/hooks/useBookingPrice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Accessibility, Check, Users } from "lucide-react";
import { FileUploadBlock } from "@/components/FileUploadBlock";
import { enumAssociateRole } from "@/lib/enumAssociateRole";
import { enumStatus } from "@/lib/enumStatus";
import { fmtPlainBR } from "@/lib/fmtPlainBR";

export default function FinishBook() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const booking_id = queryParams.get("booking_id");
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [booking, setBooking] = useState();

  useEffect(() => {
    (async () => {
      const response = await apiRequest(`/bookings/get-booking-complete?booking_id=${booking_id}`, {
        method: "GET"
      });

      setBooking(response);
    })()
  }, []);

  async function handleSubmit() {
    const result = await apiRequest(`/bookings/update-booking`, {
      method: "POST",
      body: JSON.stringify({
        id: booking_id,
        status: booking.associates.length > 0 ? "awaiting_invites" : "pending_approval",
        expires_at: booking.associates.length > 0 ? addDays(new Date(), 1) : null
      })
    });

    if (result) {
      setBooking(result);

      socket.emit("new-booking", {
        ...result,
        created_by_name: user.name,
        created_by_associate_role: user.associate_role
      });

      localStorage.removeItem("booking");
      navigate("/associado/home");
    }
  }

  return (
    <section className="w-full xl:p-20 pr-2 overflow-y-auto">
      {
        booking
        &&
        <section className="w-full pr-2 overflow-y-auto">
          <GlobalBreadcrumb />
          <div className="flex gap-12 items-end mb-8 flex-wrap">
            <Text heading="h1">Detalhes da solicitação</Text>
            <div className="flex items-center gap-2">
              <Label>Solicitação</Label>
              <Badge variant="">#{booking && booking.id.slice(0, 8)}</Badge>
            </div>
          </div>
          <section className="flex flex-column w-full justify-between flex-wrap lg:space-x-16">
            <section className="w-full md:w-[90%] lg:w-[80%] xl:w-[100%] flex-column space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Solicitação</CardTitle>
                  <CardDescription>Aqui estão as informações básicas da solicitação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={'flex justify-between space-y-4 flex-wrap md:flex-nowrap md:space-x-4 md:space-y-0'}>
                    <div className="flex-column w-full items-center justify-center text-center">
                      <p className="text-sm text-center">Solicitação</p>
                      <Badge className={'w-full'}>#{booking && booking.id.slice(0, 8)}</Badge>
                    </div>
                    <div className="flex-column w-full items-center justify-center text-center">
                      <p className="text-sm text-center">Status</p>
                      <Badge className={'w-full'} variant={booking.status}>{enumStatus[booking.status]}</Badge>
                    </div>
                    <div className="flex-column w-full items-center justify-center text-center">
                      <p className="text-sm text-center">Criada em</p>
                      <Badge className={'w-full'} variant={'secondary'}>{format(booking.utc_created_on, "dd/MM/yyyy 'às' HH:mm")}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Estadia</CardTitle>
                </CardHeader>
                <CardContent className={''}>
                  <div className="flex flex-col w-full items-center justify-center text-center md:flex-row md:space-x-4">
                    <div className="flex-column w-full items-center justify-center text-center">
                      <p className="text-sm">Data de entrada</p>
                      <Badge variant="secondary" className={'w-full'}><Badge variant="secondary" className={'w-full'}>{fmtPlainBR(booking.check_in)}</Badge></Badge>
                    </div>
                    <div className="flex-column w-full items-center justify-center text-center">
                      <p className="text-sm text-center">Data de saída</p>
                      <Badge variant="secondary" className={'w-full'}><Badge variant="secondary" className={'w-full'}>{fmtPlainBR(booking.check_out)}</Badge></Badge>
                    </div>
                    <div className="flex-column w-full items-center justify-center text-center">
                      <p className="text-sm text-center">Diária(s)</p>
                      <Badge variant="secondary" className={'w-full'}>{eachDayOfInterval({ start: new Date(booking.check_out), end: new Date(booking.check_in) }).length} dia(s)</Badge>
                    </div>
                    <div className="flex-column w-full items-center justify-center text-center">
                      <p className="text-sm text-center">Quarto(s)</p>
                      <Badge variant="secondary" className={'w-full'}>
                        {booking.rooms.map(r => (
                          <>
                            <p>Nº {r.number}</p>
                            <div className="flex">
                              <Users size={16}></Users>{r.capacity}
                            </div>
                            {
                              r.preferential
                              &&
                              <Badge variant={"preferential"}>
                                <Accessibility size={16} />
                              </Badge>
                            }
                          </>
                        ))}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pessoas na Reserva</CardTitle>
                  <CardDescription>Informações básicas sobre quem irá comparecer nessa reserva</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-medium text-slate-500 mb-1">Títular</p>
                    <Card>
                      <CardHeader>
                        <CardTitle className={'flex items-center gap-4 flex-wrap'}>
                          {user.name}
                          <Badge variant={user.associate_role}>
                            {enumAssociateRole[user.associate_role]}
                          </Badge>
                          <Badge variant={'cpf_details'}>CPF {user.cpf}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='w-full'>
                        <FileUploadBlock
                          label="Holerite recente"
                          id="holerite"
                          associationId={user.id}
                          documentType={'holerite'}
                          documentsAssociation={'holder'}
                          userId={user.id}
                          key={'holerite_sender'}
                          value={booking ? booking.url_receipt_picture : ""}
                        />
                        <FileUploadBlock
                          label="Carteira de Trabalho Digital"
                          id="clt-digital"
                          associationId={user.id}
                          documentType={'clt_digital'}
                          documentsAssociation={'holder'}
                          userId={user.id}
                          value={booking ? booking.url_word_card_file : ""}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  {
                    booking.dependents.length > 0
                    &&
                    <div className="mt-5">
                      <p className="font-medium text-slate-500 mb-1">Dependentes ({booking.dependents.length})</p>
                      <div className="flex-col space-y-4">
                        {
                          booking.dependents.map((dep, index) => (
                            <Card>
                              <CardHeader>
                                <CardTitle className={'flex items-center gap-4'}>
                                  {dep.name}
                                  <Badge variant={'cpf_details'}>CPF {dep.cpf}</Badge>
                                  {
                                    dep.disability
                                    &&
                                    <Badge variant="preferential">
                                      Preferêncial
                                    </Badge>
                                  }
                                  <Badge variant={'secondary'}>Data de nascimento: {format(dep.birth_date, 'dd/MM/yyyy')}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className={'flex justify-between'}>
                                <FileUploadBlock
                                  label="Documento com foto"
                                  id={"dep_picture" + index}
                                  associationId={user.id}
                                  documentType={'documento_com_foto'}
                                  documentsAssociation={'dependents'}
                                  allowEdit={false}
                                  userId={user.id}
                                  value={dep ? dep.url_document_picture : ""}
                                />
                                {
                                  dep.disability
                                  &&
                                  <FileUploadBlock
                                    label="Documento comprobatório"
                                    id={"dep_url_medical_report" + index}
                                    associationId={user.id}
                                    allowEdit={false}
                                    documentType={'doc_comprobatorio'}
                                    documentsAssociation={'dependents'}
                                    userId={user.id}
                                    value={dep ? dep.url_medical_report : ""}
                                  />
                                }
                              </CardContent>
                            </Card>
                          ))
                        }
                      </div>
                    </div>
                  }
                  {
                    booking.guests.length > 0
                    &&
                    <div className="mt-5">
                      <p className="font-medium text-slate-500 mb-1">Convidados ({booking.guests.length})</p>
                      <div className="flex-col space-y-4">
                        {
                          booking.guests.map((gue, index) => (
                            <Card>
                              <CardHeader>
                                <CardTitle className={'flex items-center gap-4'}>
                                  {gue.name}
                                  <Badge variant={'cpf_details'}>CPF {gue.cpf}</Badge>
                                  {
                                    gue.disability
                                    &&
                                    <Badge variant="preferential">
                                      Preferêncial
                                    </Badge>
                                  }
                                  <Badge variant={'secondary'}>Data de nascimento: {format(gue.birth_date, 'dd/MM/yyyy')}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className={'flex justify-between'}>
                                <FileUploadBlock
                                  label="Documento com foto"
                                  id={"gue_picture" + index}
                                  associationId={user.id}
                                  documentType={'documento_com_foto'}
                                  documentsAssociation={'guests'}
                                  allowEdit={false}
                                  userId={user.id}
                                  value={gue ? gue.url_document_picture : ""}
                                />
                              </CardContent>
                              {
                                gue.disability
                                &&
                                <FileUploadBlock
                                  label="Documento comprobatório"
                                  id={"gue_url_medical_report" + index}
                                  associationId={user.id}
                                  documentType={'doc_comprobatorio'}
                                  documentsAssociation={'guests'}
                                  allowEdit={false}
                                  userId={user.id}
                                  value={gue ? gue.url_medical_report : ""}
                                />
                              }
                            </Card>
                          ))
                        }
                      </div>
                    </div>
                  }
                  {
                    booking.children.length > 0
                    &&
                    <div className="mt-5">
                      <p className="font-medium text-slate-500 mb-1">Crianças menores que 5 anos ({booking.children.length})</p>
                      <div className="flex-col space-y-4">
                        {
                          booking.children.map((chi, index) => (
                            <Card>
                              <CardHeader>
                                <CardTitle className={'flex items-center gap-4'}>
                                  {chi.name}
                                  <Badge variant={'cpf_details'}>CPF {chi.cpf}</Badge>
                                  {
                                    chi.disability
                                    &&
                                    <Badge variant="preferential">
                                      Preferêncial
                                    </Badge>
                                  }
                                  <Badge variant={'secondary'}>Data de nascimento: {format(chi.birth_date, 'dd/MM/yyyy')}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className={'flex justify-between'}>
                                <FileUploadBlock
                                  label="Documento com foto"
                                  id={"chi_picture" + index}
                                  associationId={user.id}
                                  documentType={'documento_com_foto'}
                                  allowEdit={false}
                                  documentsAssociation={'children'}
                                  userId={user.id}
                                  value={chi ? chi.url_document_picture : ""}
                                />
                                {
                                  chi.disability
                                  &&
                                  <FileUploadBlock
                                    label="Documento comprobatório"
                                    id={"chi_url_medical_report" + index}
                                    associationId={user.id}
                                    documentType={'doc_comprobatorio'}
                                    documentsAssociation={'children'}
                                    allowEdit={false}
                                    userId={user.id}
                                    value={chi ? chi.url_medical_report : ""}
                                  />
                                }
                              </CardContent>
                            </Card>
                          ))
                        }
                      </div>
                    </div>
                  }
                  {
                    booking.stepchildren.length > 0
                    &&
                    <div className="mt-5">
                      <p className="font-medium text-slate-500 mb-1">Enteados ({booking.stepchildren.length})</p>
                      <div className="flex-col space-y-4">
                        {
                          booking.stepchildren.map((stepchi, index) => (
                            <Card>
                              <CardHeader>
                                <CardTitle className={'flex items-center gap-4'}>
                                  {stepchi.name}
                                  <Badge variant={'cpf_details'}>CPF {stepchi.cpf}</Badge>
                                  {
                                    stepchi.disability
                                    &&
                                    <Badge variant="preferential">
                                      Preferêncial
                                    </Badge>
                                  }
                                  <Badge variant={'secondary'}>Data de nascimento: {format(stepchi.birth_date, 'dd/MM/yyyy')}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className={'flex justify-between'}>
                                <FileUploadBlock
                                  label="Documento com foto"
                                  id={"stepchi_picture" + index}
                                  associationId={user.id}
                                  documentType={'documento_com_foto'}
                                  allowEdit={false}
                                  documentsAssociation={'stepchildren'}
                                  userId={user.id}
                                  value={stepchi ? stepchi.url_document_picture : ""}
                                />
                                {
                                  stepchi.disability
                                  &&
                                  <FileUploadBlock
                                    label="Documento comprobatório"
                                    id={"stepchi_url_medical_report" + index}
                                    associationId={user.id}
                                    documentType={'doc_comprobatorio'}
                                    documentsAssociation={'stepchildren'}
                                    allowEdit={false}
                                    userId={user.id}
                                    value={stepchi ? stepchi.url_medical_report : ""}
                                  />
                                }
                              </CardContent>
                            </Card>
                          ))
                        }
                      </div>
                    </div>
                  }
                  {
                    booking.associates.length > 0
                    &&
                    <div className="mt-5">
                      <p className="font-medium text-slate-500 mb-1">Outros associados ({booking.associates.length})</p>
                      <div className="flex-col space-y-4">
                        {
                          booking.associates.map((asc, index) => (
                            <Card>
                              <CardHeader>
                                <CardTitle className={'flex items-center gap-4'}>
                                  {asc.name}
                                  <Badge variant={'cpf_details'}>CPF {asc.cpf}</Badge>
                                  {
                                    asc.disability
                                    &&
                                    <Badge variant="preferential">
                                      Preferêncial
                                    </Badge>
                                  }
                                  <Badge variant={'secondary'}>Data de nascimento: {format(asc.birth_date, 'dd/MM/yyyy')}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className={'flex justify-between'}>
                                <FileUploadBlock
                                  label="Documento com foto"
                                  id={"asc_picture" + index}
                                  associationId={user.id}
                                  documentType={'documento_com_foto'}
                                  documentsAssociation={'associates'}
                                  allowEdit={false}
                                  userId={user.id}
                                  value={asc ? asc.url_document_picture : ""}
                                />
                              </CardContent>
                            </Card>
                          ))
                        }
                      </div>
                    </div>
                  }
                </CardContent>
              </Card>
            </section>
            <div className="mt-6 w-full lg:relative lg:w-[30%] mb-8">
              <div className={'lg:right-10 lg:bottom-10 lg:w-fit lg:fixed w-full'}>
                <Card className={'w-full lg:w-[250px] gap-0 mb-5'}>
                  <CardHeader>
                    <CardTitle className={'text-sm text-zinc-500 mb-1'}>
                      Valor total da reserva
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-zinc-900">
                      {calculateTotalPrice(booking).formatted}
                    </p>
                  </CardContent>
                </Card>
                {
                  booking.status === 'incomplete' ||
                    booking.status === 'refused'
                    ?
                    <Button className={'mt-4 w-full'} onClick={handleSubmit} variant={'positive'}>Finalizar reserva<Check /></Button>
                    :
                    <></>
                }
              </div>
            </div>
          </section>
        </section>
      }
    </section>
  )
}
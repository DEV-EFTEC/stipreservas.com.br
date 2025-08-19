import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { enumStatus } from "@/lib/enumStatus";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Accessibility, ChevronRight, Copy, Download, Edit, Eye, Info, Mail, ScanQrCode, Send, Users, X, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FileUploadBlock } from "@/components/FileUploadBlock";
import { enumAssociateRole } from "@/lib/enumAssociateRole";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { calculateTotalPrice } from "@/hooks/useBookingPrice";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
import html2pdf from 'html2pdf.js';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LexicalViewer from "@/components/lexical-viewer";
import { fmtPlainBR, fmtPlainDateBR } from "@/lib/fmtPlainBR";

export default function BookingDetails() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const booking_id = queryParams.get("booking_id");
  const navigate = useNavigate();
  const { saveBooking } = useBooking();
  const { socket } = useSocket();

  const { user } = useAuth();

  const [booking, setBooking] = useState();
  const [payment, setPayment] = useState();
  const [isHighSeason, setIsHighSeason] = useState(true);
  const [isDisabledRefund, setIsDisabledRefund] = useState(true);
  const [hasAssociates, setHasAssociates] = useState();
  const [invitedAssociate, setInvitedAssociate] = useState();
  const [inviteStatus, setInviteStatus] = useState();
  const [hasDocuments, setHasDocuments] = useState();

  useEffect(() => {
    if (!socket) return;

    socket.on("payment:confirmed", (data) => {
      setBooking(prevState => {
        return {
          ...prevState,
          status: data.status
        }
      });
      toast.success("Pagamento confirmado com sucesso!");
    });

    socket.on("payment:refund-solicitation", (data) => {
      setBooking(prevState => (
        {
          ...prevState,
          status: data.booking_status
        }
      ));
      toast.success("O reembolso via Pix foi solicitado com sucesso.", {
        description: "O valor será devolvido diretamente à sua conta em até 3 dias úteis."
      });
    })

    return () => {
      socket.off("payment:confirmed");
      socket.off("payment:refund-solicitation");
    };
  }, [socket]);

  useEffect(() => {
    (async () => {
      const response = await apiRequest(`/bookings/get-booking-complete?booking_id=${booking_id}`, {
        method: "GET"
      });
      const invAsc = response.associates.find(
        inv => inv.associate_invited_id === user.id
      )
      console.log(invAsc)
      setBooking(response);
      setHasAssociates(response.associates.length > 0);
      setInvitedAssociate(invAsc);
      setInviteStatus(invAsc?.status);
      setHasDocuments(invAsc?.url_receipt_picture && invAsc?.url_word_card_file);
    })()
  }, [])

  useEffect(() => {
    if (!booking) return;

    (async () => {
      try {
        const { is_high_period } = await apiRequest(`/periods/is-high-season`, {
          method: "POST",
          body: JSON.stringify({
            date: booking.check_in
          })
        });

        setIsHighSeason(is_high_period);

        const now = new Date();
        const checkIn = new Date(booking.check_in);
        const diffDays = Math.ceil((checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (is_high_period) {
          setIsDisabledRefund(diffDays <= 3);
        } else {
          setIsDisabledRefund(diffDays <= 1);
        }
      } catch (err) {
        console.error("Erro ao verificar período de alta temporada:", err);
      }
    })();
  }, [booking]);

  async function handleCancel() {
    const result = await apiRequest(`/bookings/update-booking`, {
      method: "POST",
      body: JSON.stringify({
        id: booking_id,
        status: "cancelled"
      })
    })

    if (result) {
      if (socket) {
        socket.emit("cancelled", {
          booking_id
        });
        navigate(`/associado/home`);
      }
    } else {
      toast.error("Ocorreu um erro ao cancelar a solicitação.");
    }
  }

  async function handlePayBooking() {
    const response = await apiRequest(`/payments-bookings/find-payment-by-booking?id=${booking.id}`, {
      method: "GET"
    });

    setPayment(response);
  }

  async function handleUpdateToSend() {
    saveBooking(booking);
    navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/enviar-documentos`);
  }

  async function handleCopy(pixCode) {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast.success("Código PIX copiado com sucesso!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  }

  async function handleGetRefund() {
    const response = await apiRequest(`/payments-bookings/refund`, {
      method: "POST",
      body: JSON.stringify({
        booking_id: booking.id
      })
    });
    if (response) {
      toast.success("Solicitação de reembolso enviada com sucesso!")
    } else {
      toast.error("Algo deu errado. Tente novamente mais tarde.")
    }
  }

  function handleNavigateSendDocuments(invite_id) {
    navigate(`/associado/convite/enviar-documentos?invite_id=${invite_id}`);
  }

  function generateAuthorizationHTML(booking, user) {
    const formatPeriod = `${fmtPlainDateBR(booking.check_in)} à ${fmtPlainDateBR(booking.check_out)}`;
    const totalDays = eachDayOfInterval({ start: new Date(booking.check_out), end: new Date(booking.check_in) }).length;

    const renderPeopleRows = () => {
      let count = 1;

      const mapPerson = (person, tipo) => `
      <tr>
        <td style="padding: 8px 10px; border: 1px solid #ddd;">${count++}</td>
        <td style="padding: 8px 10px; border: 1px solid #ddd;">${person.name}</td>
        <td style="padding: 8px 10px; border: 1px solid #ddd;">${person.cpf === "" ? "Não possui CPF" : person.cpf}</td>
        <td style="padding: 8px 10px; border: 1px solid #ddd;">${totalDays} dias</td>
        <td style="padding: 8px 10px; border: 1px solid #ddd;">${tipo}</td>
      </tr>
    `;

      return `
      ${booking.dependents.map(dep => mapPerson(dep, 'Dependente')).join('')}
      ${booking.guests.map(gue => mapPerson(gue, 'Convidado')).join('')}
      ${booking.children.map(chi => mapPerson(chi, 'Criança')).join('')}
      ${booking.stepchildren.map(chi => mapPerson(chi, 'Enteado')).join('')}
      ${booking.associates.map(chi => mapPerson(chi, 'Outros associados')).join('')}
    `;
    };

    const roomNumbers = booking.rooms.map(r => r.number).join(', ');

    return `
    <div style="font-family: 'DM Sans', sans-serif; color: #333;">
      <h1 style="color: #00598a; font-size: 24px; font-weight:bold;">STIP Reservas - autorização #${booking.id.slice(0, 8)}</h1>
      <h2 style="color: #00598a; font-size: 18px; font-weight:bold;">Endereço Sede Praia: Rua Olinda, 76, Balneário de Shangri-lá</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><th style="text-align:left">Titular</th><td>${user.name}</td></tr>
        <tr><th style="text-align:left">Documento</th><td>${user.cpf}</td></tr>
        <tr><th style="text-align:left">Empresa</th><td>${user.enterprise.name || '-'}</td></tr>
        <tr><th style="text-align:left">Período</th><td>${formatPeriod}</td></tr>
        <tr><th style="text-align:left">Quarto(s)</th><td>${roomNumbers}</td></tr>
      </table>

      <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 16px; font-weight:bold;">Acompanhantes</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="line-height:48px;">
          <tr style="background:#00598a; color:#FFFFFF;">
            <th>#</th><th>Nome</th><th>Nº Documento</th><th>Estadia</th><th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          ${renderPeopleRows()}
        </tbody>
      </table>

      <h3 style="margin-top: 24px;">IMPORTANTE: Termos & Condições</h3>
      <ol>
        <li>A autorização terá validade das 8h do primeiro dia até as 17h do último dia informado;</li>
        <li>Não será permitida a entrada de pessoas não cadastradas na autorização;</li>
        <li>O desrespeito às normas resultará na perda do direito de uso da colônia de férias;</li>
        <li>Pulseiras de identificação são obrigatórias. Perda = R$ 3,00/unidade;</li>
        <li>É proibida a entrada com animais de estimação;</li>
        <li>Cancelamentos até 3 dias antes do check-in (baixa temporada) permitem reembolso;</li>
        <li>Cancelamentos em alta temporada não serão reembolsados por não ser possível a realocação para outro inscrito;</li>
        <li>Check-in: das 8h às 18h;</li>
        <li>Check-out: até 17h;</li>
        <li>Cancelamento somente via plataforma STIP Reservas.</li>
      </ol>

      <h3 style="margin-top: 24px;">ATENÇÃO! É necessário levar:</h3>
      <ul>
        <li>Roupa de cama e itens de higiene pessoal;</li>
        <li>Detergente, esponja e pano de prato;</li>
        <li>A limpeza do quarto é de responsabilidade do hóspede;</li>
        <li>Cuide do kit de limpeza disponibilizado.</li>
      </ul>

      <footer style="margin-top: 20px; line-height:24px; font-size: 12px; text-align: center; color:#bbb;">
        <p>Documento gerado eletronicamente via STIP Reservas em ${new Date().getFullYear()}.</p>
      </footer>
    </div>
  `;
  }

  function handleDownloadAuthorization() {
    const htmlString = generateAuthorizationHTML(booking, user);

    const opt = {
      margin: 0.5,
      filename: 'autorizacao-reserva.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 1, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(htmlString).save();
  }

  async function updateStatusInvite(status) {
    try {
      const { success } = await apiRequest(`/bookings/${booking_id}/update-status-invite`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          associate_invited_id: user.id
        })
      })

      if (success) {
        toast.success("Convite aceito com sucesso!");
        setInviteStatus('accepted');
      } else {
        toast.warning("Convite recusado com sucesso.");
        setInviteStatus('refused');
      }
    } catch (err) {
      console.error(err)
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
          </div>

          {hasAssociates && invitedAssociate && (
            <Alert className="w-fit mb-8" variant="info">
              <Mail />
              <AlertTitle>
                Convite realizado por {booking.holders[0].name}
              </AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  Olá! Você foi convidado para a solicitação #{booking.id.slice(0, 8)}.
                </p>

                {inviteStatus === "accepted" && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                      Aceito
                    </span>
                    <span className="text-sm text-green-700">
                      Você já aceitou este convite.
                    </span>
                  </div>
                )}

                {inviteStatus === "refused" && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-rose-100 text-rose-800 text-sm px-2 py-1 rounded">
                      Recusado
                    </span>
                    <span className="text-sm text-rose-700">
                      Você recusou este convite.
                    </span>
                  </div>
                )}

                {inviteStatus === "accepted" && !hasDocuments && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 p-2 rounded">

                    <p className="text-sm text-red-700">
                      Faltam documentos: por favor envie o holerite recente e a CLT Digital.
                    </p>
                  </div>
                )}

                {inviteStatus === "accepted" && hasDocuments && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 p-2 rounded">
                    <span className="text-green-500 text-lg">✅</span>
                    <p className="text-sm text-green-700">
                      Todos os documentos foram enviados.
                    </p>
                  </div>
                )}
                {
                  inviteStatus === "pending" && (
                    <div className="flex gap-2 justify-end w-full">
                      <Button variant={'positive'} onClick={() => updateStatusInvite('accepted')}>Aceitar</Button>
                      <Button variant={'destructive'} onClick={() => updateStatusInvite('refused')}>Rejeitar</Button>
                    </div>
                  )
                }
              </AlertDescription>
            </Alert>

          )}

          <section className="flex flex-column w-full justify-between flex-wrap lg:space-x-16">
            <section className="w-full md:w-[90%] lg:w-[80%] xl:w-[100%] flex-column space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Solicitação</CardTitle>
                  <CardDescription>Aqui estão as informações básicas da solicitação</CardDescription>
                </CardHeader>
                <CardContent className={'flex flex-col space-y-6'}>
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
                  {
                    booking.status === 'refused'
                    &&
                    <div className="flex-column w-full items-center justify-center text-center">
                      <p className="text-sm text-center">Justificativa da recusa</p>
                      <Badge className={'w-full'} variant={'secondary'}>
                        <LexicalViewer jsonContent={booking.justification} styles={"text-black max-w-none text-sm text-center"} />
                      </Badge>
                    </div>
                  }
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Estadia</CardTitle>
                </CardHeader>
                <CardContent className={'flex justify-between space-y-4 flex-wrap md:flex-nowrap md:space-x-4 md:space-y-0'}>
                  <div className="flex-column w-full items-center justify-center text-center">
                    <p className="text-sm">Data de entrada</p>
                    <Badge variant="secondary" className={'w-full'}>{fmtPlainBR(booking.check_in)}</Badge>
                  </div>
                  <div className="flex-column w-full items-center justify-center text-center">
                    <p className="text-sm text-center">Data de saída</p>
                    <Badge variant="secondary" className={'w-full'}>{fmtPlainBR(booking.check_out)}</Badge>
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
                          {booking.holders[0].name}
                          <Badge variant={booking.holders[0].associate_role}>
                            {enumAssociateRole[booking.holders[0].associate_role]}
                          </Badge>
                          <Badge variant={'cpf_details'}>CPF {booking.holders[0].cpf}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-between flex-wrap space-y-4 2xl:space-y-0 xl:flex-nowrap">
                        <FileUploadBlock
                          label="Holerite recente"
                          id="holerite"
                          associationId={booking.holders[0].id}
                          documentType={'holerite'}
                          documentsAssociation={'holder'}
                          userId={booking.holders[0].id}
                          key={'holerite_sender'}
                          allowEdit={false}
                          allowView={false}
                          value={booking ? booking.url_receipt_picture : ""}
                        />
                        <FileUploadBlock
                          label="Carteira de Trabalho Digital"
                          id="clt-digital"
                          associationId={booking.holders[0].id}
                          documentType={'clt_digital'}
                          documentsAssociation={'holder'}
                          userId={booking.holders[0].id}
                          allowEdit={false}
                          allowView={false}
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
                                <CardTitle className={'flex items-center gap-4 flex-wrap'}>
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
                                  userId={user.id}
                                  allowEdit={false}
                                  allowView={false}
                                  value={dep ? dep.url_document_picture : ""}
                                />
                                {
                                  dep.disability
                                  &&
                                  <FileUploadBlock
                                    label="Documento comprobatório"
                                    id={"dep_url_medical_report" + index}
                                    associationId={user.id}
                                    documentType={'doc_comprobatorio'}
                                    documentsAssociation={'dependents'}
                                    userId={user.id}
                                    allowEdit={false}
                                    allowView={false}
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
                                  userId={user.id}
                                  allowEdit={false}
                                  allowView={false}
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
                                  userId={user.id}
                                  allowEdit={false}
                                  allowView={false}
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
                                  documentsAssociation={'children'}
                                  userId={user.id}
                                  allowEdit={false}
                                  allowView={false}
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
                                    userId={user.id}
                                    allowEdit={false}
                                    allowView={false}
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
                          booking.associates.map((associate, index) => (
                            <Card>
                              <CardHeader>
                                <CardTitle className={'flex items-center gap-4'}>
                                  {associate.name}
                                  <Badge variant={'cpf_details'}>CPF {associate.cpf}</Badge>
                                  {
                                    associate.disability
                                    &&
                                    <Badge variant="preferential">
                                      Preferêncial
                                    </Badge>
                                  }
                                  <Badge variant={'secondary'}>Data de nascimento: {format(associate.birth_date, 'dd/MM/yyyy')}</Badge>
                                  {
                                    associate.status === 'accepted' &&
                                    <Badge variant={'approved'}>Convite aceito</Badge>
                                  }
                                  {
                                    associate.status === 'accepted' &&
                                    associate.url_receipt_picture === null |
                                    associate.url_word_card_file === null &&
                                    <Badge variant={'refused'}>Falta holerite e CLT Digital</Badge>
                                  }
                                  {
                                    associate.status === 'accepted' &&
                                    associate.url_receipt_picture !== null &&
                                    associate.url_word_card_file !== null &&
                                    <Badge variant={'approved'}>Todos os documentos foram enviados</Badge>
                                  }
                                  {
                                    associate.status === 'refused' &&
                                    <Badge variant={'refused'}>Convite recusado</Badge>
                                  }
                                  {
                                    associate.status === 'pending' &&
                                    <Badge variant={'pending_approval'}>Aguardando responsta</Badge>
                                  }
                                </CardTitle>
                              </CardHeader>
                              <CardContent className={'flex justify-between'}>
                                <FileUploadBlock
                                  label="Documento com foto"
                                  id={"associate_picture" + index}
                                  associationId={associate.id}
                                  documentType={'documento_com_foto'}
                                  documentsAssociation={'associate'}
                                  userId={associate.id}
                                  allowEdit={false}
                                  allowView={false}
                                  value={associate ? associate.url_document_picture : ""}
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
            <div className="mt-6 w-full lg:relative lg:w-[30%]">
              <div className={'lg:right-10 lg:bottom-10 lg:w-fit lg:fixed w-full'}>
                {
                  payment
                  &&
                  <Card className={'w-full lg:w-[250px] gap-0 mb-5'}>
                    <CardHeader>
                      <CardTitle className={'text-sm text-zinc-500 mb-1 text-center'}>
                        Leia o QR Code ou utilize a função "PIX copia e cola"
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img src={`data:image/png;base64, ${payment.encodedImage}`} className="mb-1" />
                      <Button onClick={handleCopy(payment.payload)} className={"w-full"}>PIX copia e cola <Copy /></Button>
                    </CardContent>
                  </Card>
                }
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
                  booking.status === 'incomplete'
                  &&
                  <Button className={'mt-4 w-full'} onClick={() => { navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/enviar-documentos`); saveBooking(booking); }}>Retomar solicitação de onde parou<ChevronRight /></Button>
                }
                {
                  booking.status === 'pending_approval'
                  &&
                  <Button className={'my-4 w-full'} variant={'destructive'} onClick={handleCancel}>Cancelar solicitação<X /></Button>
                }
                {
                  booking.status === 'payment_pending'
                  &&
                  <Button className={'mt-4 w-full'} variant={'payment_pending'} onClick={handlePayBooking}>Realizar pagamento<ScanQrCode /></Button>
                }
                {
                  booking.status === 'refused'
                  &&
                  <Button className={'mt-4 w-full'} variant={'refused'} onClick={handleUpdateToSend}>Realizar alterações e reenviar<Edit /></Button>
                }
                {
                  inviteStatus === "accepted" && !hasDocuments
                  &&
                  <Button className={'mt-4 w-full flex flex-col h-fit'} variant={'awaiting_documents'} onClick={() => handleNavigateSendDocuments(invitedAssociate.invite_id)}>
                    <div className="flex items-center gap-4">
                      <Send />Enviar documentos
                    </div>Convite #{invitedAssociate.invite_id.slice(0, 8)}</Button>
                }
                {
                  booking.status === 'approved'
                  &&
                  <div className="w-[250px]">
                    <Button className={'mt-4 w-full'} onClick={handleDownloadAuthorization}>Baixar autorização<Download /></Button>
                    {
                      ((new Date(booking.check_in) - new Date()) / (1000 * 60 * 60 * 24)) >= 3
                        ?
                        <Button className={'mt-4 w-full'} variant={'destructive'} onClick={handleCancel}>Cancelar solicitação<X /></Button>
                        :
                        <Button className={'mt-4 w-full'} variant={'destructive'} onClick={handleCancel} disabled>Cancelar solicitação<X /></Button>
                    }
                  </div>
                }
              </div>
            </div>
          </section>
        </section>
      }
    </section>
  )
}
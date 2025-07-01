import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { differenceInDays, format } from "date-fns";
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
import { Accessibility, ChevronRight, Copy, Download, Eye, Info, ScanQrCode, Users, X, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FileUploadBlock } from "@/components/FileUploadBlock";
import { enumAssociateRole } from "@/lib/enumAssociateRole";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/useBooking";
import { calculateTotalPrice } from "@/hooks/useBookingPrice";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
import html2pdf from 'html2pdf.js';
import { Alert } from "@/components/ui/alert";

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

  useEffect(() => {
    if (!socket) return;

    socket.on("payment:confirmed", (data) => {
      setBooking(data.booking);
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
      setBooking(response);
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
        console.log(is_high_period)

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
    const response = await apiRequest(`/payments/find-payment-by-booking?id=${booking.id}`, {
      method: "GET"
    });

    setPayment(response);
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
    const response = await apiRequest(`/payments/refund`, {
      method: "POST",
      body: JSON.stringify({
        booking_id: booking_id
      })
    });
    if (response) {
      toast.success("Solicitação de reembolso enviada com sucesso!")
    } else {
      toast.error("Algo deu errado. Tente novamente mais tarde.")
    }
  }

  function handleDownloadAuthorization() {
    const htmlString = `<div style="padding: 0; font-family: 'DM Sans', Arial, sans-serif; color: #333; background-color: #fff;page-break-inside: avoid;">
  <h1 style="font-size: 28px; color: #00598a; margin-bottom: 8px;">STIP Reservas</h1>
  <h2 style="font-size: 20px; margin-bottom: 24px; color: #111;">Autorização #A8374U</h2>

  <div>
    <h3
      style="font-size: 18px; margin-top: 32px; margin-bottom: 12px; border-bottom: 2px solid #00598a; padding-bottom: 4px; color: #222;page-break-inside: avoid;">
      Informações Gerais
    </h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;page-break-inside: avoid;">
      <tbody>
        <tr>
          <th style="text-align: left; padding: 8px 10px; border: 1px solid #ddd;">Titular</th>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">Jeremias Seles de Almeida</td>
        </tr>
        <tr>
          <th style="text-align: left; padding: 8px 10px; border: 1px solid #ddd;">Documento</th>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">79668010</td>
        </tr>
        <tr>
          <th style="text-align: left; padding: 8px 10px; border: 1px solid #ddd;">Empresa</th>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">PANI. MERC. AHU LTDA</td>
        </tr>
        <tr>
          <th style="text-align: left; padding: 8px 10px; border: 1px solid #ddd;">Período</th>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">21/06/2025 à 22/06/2025</td>
        </tr>
        <tr>
          <th style="text-align: left; padding: 8px 10px; border: 1px solid #ddd;">Quarto(s)</th>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">13</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div>
    <h3
      style="font-size: 18px; margin-top: 32px; margin-bottom: 12px; border-bottom: 2px solid #00598a; padding-bottom: 4px; color: #222;page-break-inside: avoid;">
      Acompanhantes
    </h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;page-break-inside: avoid;">
      <thead>
        <tr style="background-color: #f8f8f8; font-weight: bold;">
          <th style="padding: 8px 10px; border: 1px solid #ddd;">#</th>
          <th style="padding: 8px 10px; border: 1px solid #ddd;">Nome</th>
          <th style="padding: 8px 10px; border: 1px solid #ddd;">Nº Documento</th>
          <th style="padding: 8px 10px; border: 1px solid #ddd;">Estadia</th>
          <th style="padding: 8px 10px; border: 1px solid #ddd;">Tipo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">1</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">Clemilda dos Santos Silva</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">919104399-91</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">2 dias</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">Dependente</td>
        </tr>
        <tr>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">2</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">Gabriel Santos de Almeida</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">139626939-80</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">2 dias</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">Dependente</td>
        </tr>
        <tr>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">3</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">Laura Mariana da Silva</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">155144439-90</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">2 dias</td>
          <td style="padding: 8px 10px; border: 1px solid #ddd;">Convidado</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div>
    <h3
      style="font-size: 18px; margin-top: 32px; margin-bottom: 12px; border-bottom: 2px solid #00598a; padding-bottom: 4px; color: #222;page-break-inside: avoid;">
      IMPORTANTE: Termos & Condições
    </h3>
    <ol style="margin-bottom: 8px; padding-left: 0; text-indent: 0;list-style-type:decimal;page-break-inside: avoid;">
      <li style="margin-bottom: 8px; padding-left: 0; text-indent: 0;">1. A autorização terá validade das 8h do primeiro dia até as 17h do
        último dia informado;</li>
      <li style="margin-bottom: 8px; padding-left: 0; text-indent: 0;">2. Não será permitida a entrada de pessoas não cadastradas na
        autorização;</li>
      <li style="margin-bottom: 8px; padding-left: 0; text-indent: 0;">3. O desrespeito às normas resultará na perda do direito de uso da
        colônia de férias;</li>
      <li style="margin-bottom: 8px; padding-left: 0; text-indent: 0;">4. Pulseiras de identificação são obrigatórias. Perda = R$
        3,00/unidade;</li>
      <li style="margin-bottom: 8px; padding-left: 0; text-indent: 0;">5. É proibida a entrada com animais de estimação;</li>
      <li style="margin-bottom: 8px; padding-left: 0; text-indent: 0;">6. Cancelamentos até 1 dia antes do check-in (baixa temporada)
        permitem reembolso;</li>
      <li style="margin-bottom: 8px; padding-left: 0; text-indent: 0;">7. Cancelamentos até 3 dias antes do check-in (alta temporada)
        permitem reembolso;</li>
      <li style="margin-bottom: 8px; padding-left: 0; text-indent: 0;">8. Check-in: das 8h às 18h;</li>
      <li style="margin-bottom: 8px; padding-left: 0; text-indent: 0;">9. Check-out: até 17h;</li>
      <li style="margin-bottom: 8px; padding-left: 0; text-indent: 0;">10. Cancelamento somente via plataforma STIP Reservas.</li>
    </ol>
  </div>

  <div>
    <h3
      style="font-size: 18px; margin-top: 32px; margin-bottom: 12px; border-bottom: 2px solid #00598a; padding-bottom: 4px; color: #222;page-break-inside: avoid;">
      ATENÇÃO! É necessário levar:
    </h3>
    <ul style="margin-left: 1.5rem; margin-top: 8px; list-style-type: disc;page-break-inside: avoid;">
      <li style="margin-bottom: 8px; line-height: 1.5;page-break-inside: avoid;">Roupa de cama e itens de higiene pessoal;</li>
      <li style="margin-bottom: 8px; line-height: 1.5;">Detergente, esponja e pano de prato;</li>
      <li style="margin-bottom: 8px; line-height: 1.5;">A limpeza do quarto é de responsabilidade do hóspede;</li>
      <li style="margin-bottom: 8px; line-height: 1.5;">Cuide do kit de limpeza disponibilizado.</li>
    </ul>
  </div>

  <div>
    <footer style="margin-top: 40px; font-size: 12px; color: #666; text-align: center;page-break-inside: avoid; padding: 10px;">
      <p style="page-break-inside: avoid;">Documento gerado eletronicamente via STIP Reservas em 2025.</p>
    </footer>
  </div>
</div>`

    const opt = {
      margin: 0.5,
      filename: 'autorizacao-reserva.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 1, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(htmlString).save();
  }

  return (
    <section className="flex w-full p-20 justify-between">
      {
        booking
        &&
        <section className="w-full">
          <GlobalBreadcrumb />
          <div className="flex gap-12 items-end mb-8">
            <Text heading="h1">Detalhes da solicitação</Text>
            <div className="flex items-center gap-2">
              <Label>Solicitação</Label>
              <Badge variant="">#{booking && booking.id.slice(0, 8)}</Badge>
            </div>
          </div>

          <section className="flex flex-column w-full space-x-16 justify-between">
            <section className="w-[55%] flex-column space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Solicitação</CardTitle>
                  <CardDescription>Aqui estão as informações básicas da solicitação</CardDescription>
                </CardHeader>
                <CardContent className={'flex justify-between space-x-6'}>
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
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Estadia</CardTitle>
                </CardHeader>
                <CardContent className={'flex justify-between space-x-6'}>
                  <div className="flex-column w-full items-center justify-center text-center">
                    <p className="text-sm">Data de entrada</p>
                    <Badge variant="secondary" className={'w-full'}>{format(booking.check_in, "d 'de' MMMM (ccc)", { locale: ptBR })}</Badge>
                  </div>
                  <div className="flex-column w-full items-center justify-center text-center">
                    <p className="text-sm text-center">Data de saída</p>
                    <Badge variant="secondary" className={'w-full'}>{format(booking.check_out, "d 'de' MMMM (ccc)", { locale: ptBR })}</Badge>
                  </div>
                  <div className="flex-column w-full items-center justify-center text-center">
                    <p className="text-sm text-center">Diária(s)</p>
                    <Badge variant="secondary" className={'w-full'}>{differenceInDays(booking.check_out, booking.check_in)} dia(s)</Badge>
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
                        <CardTitle className={'flex items-center gap-4'}>
                          {user.name}
                          <Badge variant={user.associate_role}>
                            {enumAssociateRole[user.associate_role]}
                          </Badge>
                          <Badge variant={'cpf_details'}>CPF {user.cpf}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-between flex-wrap">
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
                </CardContent>
              </Card>
            </section>
            <div className="relative w-[30%]">
              <div className={'fixed bottom-10 right-20 w-fit'}>
                {
                  payment
                  &&
                  <Card className={'w-[250px] gap-0 mb-5'}>
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
                <Card className={'w-[250px] gap-0'}>
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
                  <Button className={'mt-4 w-full'} variant={'destructive'} onClick={handleCancel}>Cancelar solicitação<X /></Button>
                }
                {
                  booking.status === 'payment_pending'
                  &&
                  <Button className={'mt-4 w-full'} variant={'payment_pending'} onClick={handlePayBooking}>Realizar pagamento<ScanQrCode /></Button>
                }
                {/* {
                  isHighSeason &&
                  <Alert variant={'destructive'} className={'w-[250px]'}>
                    <Info />
                    Lembre-se: Estamos em alta temporada.<br />Não haverá reembolsos por conta da alta demanda.
                  </Alert>
                } */}
                {
                  booking.status === 'approved'
                  &&
                  <div className="w-[250px]">
                    <Button className={'mt-4 w-full'} onClick={handleDownloadAuthorization}>Baixar autorização<Download /></Button>
                    {
                      !isHighSeason
                        ?
                        <Button className={'mt-4 w-full'} variant={'destructive'} onClick={handleCancel}>Cancelar solicitação<X /></Button>
                        :
                        <Button className={'mt-4 w-full'} onClick={handleGetRefund} variant={"destructive"} disabled={isDisabledRefund}>Cancelar e solicitar reembolso<XCircle /></Button>
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
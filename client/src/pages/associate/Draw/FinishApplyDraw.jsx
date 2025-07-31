import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";
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
import { useBookingPriceWithDefault } from "@/hooks/useBookingDefaultPrice";

export default function FinishApplyDraw() {
  const location = useLocation();
  const { draw_apply_id } = location.state;
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [draw, setDraw] = useState();
  const bookingPrice = useBookingPriceWithDefault(draw);

  useEffect(() => {
    (async () => {
      const response = await apiRequest(`/draws/get-draw-complete?draw_apply_id=${draw_apply_id}`, {
        method: "GET"
      });

      setDraw(response);
    })()
  }, []);

  async function handleSubmit() {
    const result = await apiRequest(`/draws/${draw.id}/update-draw-apply`, {
      method: "PUT",
      body: JSON.stringify({
        status: "pending_approval",
        expires_at: null
      })
    });

    if (result) {
      setDraw(result);

      socket.emit("new-draw-apply", {
        ...result,
        created_by_name: user.name,
        created_by_associate_role: user.associate_role
      });

      navigate("/associado/home");
    }
  }

  return (
    <section className="flex w-full p-20 justify-between">
      {
        draw
        &&
        <section className="w-full">
          <GlobalBreadcrumb />
          <div className="flex gap-12 items-end mb-8">
            <Text heading="h1">Detalhes da solicitação</Text>
            <div className="flex items-center gap-2">
              <Label>Solicitação</Label>
              <Badge variant="">#{draw && draw.id.slice(0, 8)}</Badge>
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
                    <Badge className={'w-full'}>#{draw && draw.id.slice(0, 8)}</Badge>
                  </div>
                  <div className="flex-column w-full items-center justify-center text-center">
                    <p className="text-sm text-center">Status</p>
                    <Badge className={'w-full'} variant={draw.status}>{enumStatus[draw.status]}</Badge>
                  </div>
                  <div className="flex-column w-full items-center justify-center text-center">
                    <p className="text-sm text-center">Criada em</p>
                    <Badge className={'w-full'} variant={'secondary'}>{format(draw.utc_created_on, "dd/MM/yyyy 'às' HH:mm")}</Badge>
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
                    <Badge variant="secondary" className={'w-full'}>{format(draw.check_in, "d 'de' MMMM (ccc)", { locale: ptBR })}</Badge>
                  </div>
                  <div className="flex-column w-full items-center justify-center text-center">
                    <p className="text-sm text-center">Data de saída</p>
                    <Badge variant="secondary" className={'w-full'}>{format(draw.check_out, "d 'de' MMMM (ccc)", { locale: ptBR })}</Badge>
                  </div>
                  <div className="flex-column w-full items-center justify-center text-center">
                    <p className="text-sm text-center">Diária(s)</p>
                    <Badge variant="secondary" className={'w-full'}>{differenceInDays(draw.check_out, draw.check_in)} dia(s)</Badge>
                  </div>
                  {/* <div className="flex-column w-full items-center justify-center text-center">
                    <p className="text-sm text-center">Quarto(s)</p>
                    <Badge variant="secondary" className={'w-full'}>
                      {draw.rooms.map(r => (
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
                  </div> */}
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
                          value={draw ? draw.url_receipt_picture : ""}
                        />
                        <FileUploadBlock
                          label="Carteira de Trabalho Digital"
                          id="clt-digital"
                          associationId={user.id}
                          documentType={'clt_digital'}
                          documentsAssociation={'holder'}
                          userId={user.id}
                          value={draw ? draw.url_word_card_file : ""}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  {
                    draw.dependents.length > 0
                    &&
                    <div className="mt-5">
                      <p className="font-medium text-slate-500 mb-1">Dependentes ({draw.dependents.length})</p>
                      <div className="flex-col space-y-4">
                        {
                          draw.dependents.map((dep, index) => (
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
                    draw.guests.length > 0
                    &&
                    <div className="mt-5">
                      <p className="font-medium text-slate-500 mb-1">Convidados ({draw.guests.length})</p>
                      <div className="flex-col space-y-4">
                        {
                          draw.guests.map((gue, index) => (
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
                    draw.children.length > 0
                    &&
                    <div className="mt-5">
                      <p className="font-medium text-slate-500 mb-1">Crianças menores que 5 anos ({draw.children.length})</p>
                      <div className="flex-col space-y-4">
                        {
                          draw.children.map((chi, index) => (
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
                <Card className={'w-[250px] gap-0'}>
                  <CardHeader>
                    <CardTitle className={'text-sm text-zinc-500 mb-1'}>
                      Valor total cobrado caso sorteado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-zinc-900">
                      {bookingPrice ? bookingPrice.formatted : 'Carregando...'}
                    </p>
                  </CardContent>
                </Card>
                {
                  draw.status === 'incomplete'
                  &&
                  <Button className={'mt-4 w-full'} onClick={handleSubmit} variant={'positive'}>Finalizar inscrição<Check /></Button>
                }
              </div>
            </div>
          </section>
        </section>
      }
    </section>
  )
}
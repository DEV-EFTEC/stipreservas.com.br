import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Text from "@/components/Text";
import { FileUploadBlock } from "@/components/FileUploadBlock";
import { Baby, BabyIcon, UserRound, UsersRound } from "lucide-react";
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

export default function SendDocuments() {
  const { user } = useAuth();
  const { state } = useLocation();
  const { booking, loadingBooking, saveBooking, setBooking } = useBooking();
  const { participants } = state;

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
    if (loadingBooking) return;

    if (booking) {
      setDependents(participants.dependents);

      setGuests(participants.guests);

      setChildren(participants.children);
    }
  }, [booking]);

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
              />
            </CardContent>
          </Card>
          <hr className="my-14" />
          <Text heading="h2">Documentos dos dependentes</Text>
          <div className="flex flex-col gap-8 mt-4">
            {dependents.map((dep, index) => (
              <Card className="w-fit">
                <CardContent>
                  <header className="flex items-center gap-2 mb-4">
                    <UserRound strokeWidth={3} className="text-blue-500" width={20} />
                    <Text heading={'h3'}>{dep.name ? dep.name : `Dependente ${index + 1}`}</Text>
                    <Badge variant="">#{dep.id?.slice(0, 8)}</Badge>
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
                </CardContent>
              </Card>
            ))
            }
          </div>
          <hr className="my-14" />
          <Text heading="h2">Documentos dos convidados</Text>
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
          <hr className="my-14" />
          <Text heading="h2">Documentos de crianças menores de 5 anos</Text>
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
        </section>
        <Aside action={handleSubmit} />
      </section>
    </>
  );
}

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
import { useAssociate } from "@/hooks/useAssociate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FlameKindling, Plus, UserRound } from "lucide-react";
import { toast } from "sonner";
import maskCPF from "@/lib/maskCPF";

export default function SendDocumentsAdmin() {
  const { associate } = useAssociate();
  const user = associate;
  const { booking, loadingBooking, saveBooking, setBooking } = useBooking();
  const navigate = useNavigate();
  const [dependentsParcial, setDependentsParcial] = useState([]);
  const [guestsParcial, setGuestsParcial] = useState([]);
  const [childrenParcial, setChildrenParcial] = useState([]);
  const [selectedDependents, setSelectedDependents] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [selectedAssociates, setSelectedAssociates] = useState([]);
  const [selectedStepchildren, setSelectedStepchildren] = useState([]);
  const [associateSelect, setAssociateSelect] = useState("");
  const [associatePacks, setAssociatePacks] = useState({}); // { [associateId]: { dependents:[], guests:[], children:[] } }
  const [pickedFromAssociate, setPickedFromAssociate] = useState({}); // { [associateId]: { d:Set(ids), g:Set(ids), c:Set(ids) } }
  const [cpf, setCpf] = useState("")

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

  function mergeUniqueBy(list, items, key = "id") {
    const existing = new Set(list.map(i => i[key]));
    const toAdd = items.filter(i => !existing.has(i[key]));
    return [...list, ...toAdd];
  }


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
      const response_dep = await apiRequest(`/dependents/get-dependents`, {
        method: "POST",
        body: JSON.stringify({
          user
        })
      });
      const response_gue = await apiRequest(`/guests/get-guests`, {
        method: "POST",
        body: JSON.stringify({
          user
        })
      });
      const response_chi = await apiRequest(`/children/get-children`, {
        method: "POST",
        body: JSON.stringify({
          user
        })
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
        holders: [],
        associates: selectedAssociates.map(({ id, url_receipt_picture, url_word_card_file }) => ({
          associate_booking: {
            associate_id: id, booking_id: booking.id, check_in: booking.check_in, check_out: booking.check_out
          },
          associate_booking_invite: {
            booking_id: booking.id,
            associate_invited_id: id,
            created_by: user.id,
            url_receipt_picture,
            url_word_card_file,
            status: 'accepted'
          }
        })),
        stepchildren: [],
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

    saveBooking({ ...booking, ...result, associates_quantity: selectedAssociates.length, dependents, guests, children, selectedAssociates });
    navigate(`/admin/criar-reserva/${booking.id.slice(0, 8)}/escolher-quarto`);
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

  async function saveEntity(key, entity, ownerId) {
    const { is_saved, id, ...newEntity } = entity;
    const result = await apiRequest(enumSaveEntity[key], {
      method: 'POST',
      body: JSON.stringify({
        ...newEntity,
        created_by: ownerId || user.id
      })
    });

    if (result) {
      enumSetSaveEntity(key, result);
    };
  }

  async function saveEntityForUser(kind, entity, ownerId) {
    const enumSaveEntity = { d: '/dependents', g: '/guests', c: '/children' };
    const { is_saved, id, ...payload } = entity;

    const result = await apiRequest(enumSaveEntity[kind], {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        created_by: ownerId,     // <- AQUI vai o associado dono do registro
      })
    });

    return result;
  }

  function pushIntoAssociatePack(associateId, kind, newItem) {
    setAssociatePacks(prev => {
      const prevPack = prev[associateId] || { dependents: [], guests: [], children: [] };
      const mapKind = { d: 'dependents', g: 'guests', c: 'children' };
      const key = mapKind[kind];
      const list = prevPack[key] || [];

      // dedup por id ou cpf
      const exists = list.some(i => (newItem.id && i.id === newItem.id) || (newItem.cpf && i.cpf === newItem.cpf));
      const nextList = exists
        ? list.map(i => (i.id === newItem.id || i.cpf === newItem.cpf) ? { ...i, ...newItem } : i)
        : [...list, newItem];

      return {
        ...prev,
        [associateId]: { ...prevPack, [key]: nextList }
      };
    });
  }

  function deleteEntity(key, entity) {
    setDependents(prevState => {
      const newState = prevState.filter(e => e.id !== entity.id);
      return newState;
    });
  }

  async function searchUser() {
    try {
      const result = await apiRequest("/users/find-user-by-cpf", {
        method: "POST",
        body: JSON.stringify({ cpf })
      });

      if (!result) return;

      // Busca os acompanhantes do associado encontrado
      const [dep, gue, chi] = await Promise.all([
        apiRequest(`/dependents/get-dependents`, { method: "POST", body: JSON.stringify({ user: result }) }),
        apiRequest(`/guests/get-guests`, { method: "POST", body: JSON.stringify({ user: result }) }),
        apiRequest(`/children/get-children`, { method: "POST", body: JSON.stringify({ user: result }) }),
      ]);

      setSelectedAssociates(prev => {
        // evita duplicar o mesmo associado na lista
        if (prev.some(a => a.id === result.id)) return prev;
        return [result, ...prev];
      });

      setAssociatePacks(prev => ({
        ...prev,
        [result.id]: { dependents: dep || [], guests: gue || [], children: chi || [] }
      }));

      // inicializa conjunto de selecionados desse associado
      setPickedFromAssociate(prev => ({
        ...prev,
        [result.id]: { d: new Set(), g: new Set(), c: new Set() }
      }));
    } catch (err) {
      toast.error(err.error || "Erro ao buscar associado");
      console.error(err);
    }
  }

  function togglePick(associateId, kind, itemId) {
    // kind: 'd' | 'g' | 'c'
    setPickedFromAssociate(prev => {
      const pack = prev[associateId] || { d: new Set(), g: new Set(), c: new Set() };
      const setCopy = new Set(pack[kind]);
      if (setCopy.has(itemId)) setCopy.delete(itemId);
      else setCopy.add(itemId);
      return { ...prev, [associateId]: { ...pack, [kind]: setCopy } };
    });
  }

  function importPickedFrom(associateId) {
    const pack = associatePacks[associateId];
    const picked = pickedFromAssociate[associateId];
    if (!pack || !picked) return;

    const depToAdd = pack.dependents.filter(x => picked.d.has(x.id));
    const gueToAdd = pack.guests.filter(x => picked.g.has(x.id));
    const chiToAdd = pack.children.filter(x => picked.c.has(x.id));

    // usa seus setters principais (useDynamicList.resetList)
    setDependents(curr => mergeUniqueBy(curr, depToAdd, "id"));
    setGuests(curr => mergeUniqueBy(curr, gueToAdd, "id"));
    setChildren(curr => mergeUniqueBy(curr, chiToAdd, "id"));

    toast.success("Acompanhantes importados!");
  }


  return (
    <>
      <section className="w-full xl:flex xl:justify-between 2xl:space-x-24 xl:space-x-8 xl:p-20 pr-2 overflow-y-auto">
        <section className="w-fit mb-40">
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
                associateSelect={associateSelect}
                setAssociateSelect={setAssociateSelect}
                associates={[user, ...selectedAssociates]}
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
              <hr className="my-4" />
              <div className="w-full flex justify-between flex-col">
                <Text heading="h2">Outros associados</Text>
                <div className="flex w-fit space-x-4">
                  <Input value={cpf} onChange={(e) => {
                    const masked = maskCPF(e.target.value);
                    setCpf(masked);
                  }} placeholder="Digite o CPF do associado" />
                  <Button onClick={searchUser}><Plus />  Associado</Button>
                </div>
                {selectedAssociates.length > 0 && (
                  <div className="flex flex-col gap-8 mt-4">
                    {selectedAssociates.map((asc) => {
                      const pack = associatePacks[asc.id] || { dependents: [], guests: [], children: [] };
                      const picked = pickedFromAssociate[asc.id] || { d: new Set(), g: new Set(), c: new Set() };

                      return (
                        <Card key={asc.id} className="w-full">
                          <CardContent>
                            <header className="flex w-full justify-between items-center mb-4">
                              <div className="flex items-center gap-2">
                                <UserRound strokeWidth={3} className="text-blue-500" width={20} />
                                <Text heading="h3">{asc.name || "Associado"}</Text>
                                <Badge variant="">#{asc.id.slice(0, 8)}</Badge>
                              </div>
                              <Button onClick={() => importPickedFrom(asc.id)}>Importar selecionados</Button>
                            </header>
                            <FileUploadBlock
                              label="Holerite recente"
                              id="holerite"
                              tooltip="Holerites emitidos há mais de 30 dias serão rejeitados na fase de aprovação."
                              associationId={asc.id}
                              documentType={'holerite'}
                              documentsAssociation={'holder'}
                              userId={asc.id}
                              key={'holerite_sender'}
                              setFile={(url) => setSelectedAssociates(prevState => {
                                return prevState.map(ps => {
                                  if (ps.id === asc.id) {
                                    return {
                                      ...ps,
                                      url_receipt_picture: url
                                    }
                                  }
                                  return ps
                                })
                              })}
                              value={asc.url_receipt_picture || null}
                            />
                            <FileUploadBlock
                              label="Carteira de Trabalho Digital"
                              id="clt-digital"
                              tooltip="CLTs não digitais serão rejeitadas na fase de aprovação. CLTs digitais nos ajudam a evitar fraudes."
                              associationId={asc.id}
                              documentType={'clt_digital'}
                              documentsAssociation={'holder'}
                              userId={asc.id}
                              setFile={(url) => setSelectedAssociates(prevState => {
                                return prevState.map(ps => {
                                  if (ps.id === asc.id) {
                                    return {
                                      ...ps,
                                      url_word_card_file: url
                                    }
                                  }
                                  return ps
                                })
                              })}
                              value={asc.url_word_card_file || null}
                            />

                            {/* DEPENDENTES */}
                            <div className="mb-4">
                              <Label>Dependentes ({pack.dependents.length})</Label>
                              <div className="flex flex-col gap-2 mt-2">
                                {pack.dependents.map(dep => (
                                  <label key={dep.id} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={picked.d?.has(dep.id) || false}
                                      onChange={() => togglePick(asc.id, 'd', dep.id)}
                                    />
                                    <span>{dep.name} — {dep.cpf}</span>
                                  </label>
                                ))}
                                {pack.dependents.length === 0 && <Text>Nenhum dependente.</Text>}
                              </div>
                            </div>

                            {/* CONVIDADOS */}
                            <div className="mb-4">
                              <Label>Convidados ({pack.guests.length})</Label>
                              <div className="flex flex-col gap-2 mt-2">
                                {pack.guests.map(g => (
                                  <label key={g.id} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={picked.g?.has(g.id) || false}
                                      onChange={() => togglePick(asc.id, 'g', g.id)}
                                    />
                                    <span>{g.name} — {g.cpf}</span>
                                  </label>
                                ))}
                                {pack.guests.length === 0 && <Text>Nenhum convidado.</Text>}
                              </div>
                            </div>

                            {/* CRIANÇAS */}
                            <div>
                              <Label>Crianças ({pack.children.length})</Label>
                              <div className="flex flex-col gap-2 mt-2">
                                {pack.children.map(c => (
                                  <label key={c.id} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={picked.c?.has(c.id) || false}
                                      onChange={() => togglePick(asc.id, 'c', c.id)}
                                    />
                                    <span>{c.name} — {c.cpf || "sem CPF"}</span>
                                  </label>
                                ))}
                                {pack.children.length === 0 && <Text>Nenhuma criança.</Text>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

              </div>
            </>
          }
        </section>
        <Aside action={handleSubmit} />
      </section>
    </>
  );
}

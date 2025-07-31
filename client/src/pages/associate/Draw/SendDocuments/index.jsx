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
import { useLocation, useNavigate } from "react-router-dom";
import Dependents from "./Dependents";
import Guests from "./Guests";
import Children from "./Children";

export default function SendDocumentsDraw() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, loadingBooking, saveBooking, setBooking } = useBooking();
  const { draw_apply_id } = location.state;
  const [draw, setDraw] = useState();
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

  useEffect(() => {
    if (!draw_apply_id || loadingBooking) return;

    const fetchData = async () => {
      const response = await apiRequest(`/draws/get-draw-complete?draw_apply_id=${draw_apply_id}`);
      if (response) {
        setDependents(response.dependents);
        setGuests(response.guests);
        setChildren(response.children);
        setDraw(response);
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

  async function handleSubmit() {
    try {
      await apiRequest("/draws/create-participants-draw", {
        method: "POST",
        body: JSON.stringify({
          dependents: dependents.map(({ id }) => ({ dependent_id: id, draw_apply_id: draw_apply_id })),
          guests: guests.map(({ id }) => ({ guest_id: id, draw_apply_id: draw_apply_id })),
          children: children.map(({ id }) => ({ child_id: id, draw_apply_id: draw_apply_id })),
          holders: []
        })
      });

      try {
        const result = await apiRequest(`/draws/${draw.id}/update-draw-apply`, {
          method: "PUT",
          body: JSON.stringify({
            url_receipt_picture: draw.url_receipt_picture,
            url_word_card_file: draw.url_word_card_file,
          })
        });

        if (result) {
          navigate(`/associado/sorteio/${draw.id.slice(0, 8)}/finalizar-inscricao`, {
            state: {
              draw_apply_id: draw.id
            }
          });
        }
      } catch (err) {
        console.error(err)
      }
    } catch (err) {
      console.error(err)
    }
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
      <section className="flex w-full p-20 justify-between">
        <section className="w-fit">
          <GlobalBreadcrumb />
          <div className="flex gap-12 items-end mb-8">
            <Text heading="h1">Envio de Documentos</Text>
            <div className="flex items-center gap-2">
              <Label>Solicitação</Label>
              <Badge variant="">#{draw && draw.id.slice(0, 8)}</Badge>
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
                setFile={(url) => setDraw(prevState => {
                  const newURL = url; return {
                    ...prevState,
                    url_receipt_picture: newURL
                  }
                })}
                value={draw ? draw.url_receipt_picture : ""}
              />
              <FileUploadBlock
                label="Carteira de Trabalho Digital"
                id="clt-digital"
                tooltip="CLTs não digitais serão rejeitadas na fase de aprovação. CLTs digitais nos ajudam a evitar fraudes."
                associationId={user.id}
                documentType={'clt_digital'}
                documentsAssociation={'holder'}
                userId={user.id}
                setFile={(url) => setDraw(prevState => {
                  const newURL = url; return {
                    ...prevState,
                    url_word_card_file: newURL
                  }
                })}
                value={draw ? draw.url_word_card_file : ""}
              />
            </CardContent>
          </Card>
          {
            draw &&
            draw.url_word_card_file &&
            draw.url_receipt_picture &&
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
        <Aside action={handleSubmit} />
      </section>
    </>
  );
}

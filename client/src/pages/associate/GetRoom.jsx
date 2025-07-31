import Aside from "@/components/Aside";
import RoomCard from "@/components/associate/RoomCard";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";

import { toast } from "sonner";

import { apiRequest } from "@/lib/api";
import { useBooking } from "@/hooks/useBooking";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GetRoom() {
  const [rooms, setRooms] = useState([]);
  const [userType, setUserType] = useState();
  const [selectedRoomsCapacity, setSelectedRoomsCapacity] = useState(0);
  const [peopleCapacity, setPeopleCapacity] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const { booking } = useBooking();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    setUserType(user.associate_role);

    if (booking) {
      if (!booking.rooms || booking.rooms.length < 1) {
        const qtd = (booking.partner_presence ? 1 : 0) + booking.dependents_quantity + booking.guests_quantity;
        setPeopleCapacity(qtd);
        (async () => {
          const response = await apiRequest(`/rooms/get-available-rooms?check_in=${booking.check_in}&check_out=${booking.check_out}&capacity=${qtd}&booking_id=${booking.id}`);
          setRooms(response);
        })()
        console.log('no has room')
      } else {
        const qtd = (booking.partner_presence ? 1 : 0) + booking.dependents_quantity + booking.guests_quantity;
        setPeopleCapacity(qtd);
        (async () => {
          const response = await apiRequest(`/rooms/get-available-rooms?check_in=${booking.check_in}&check_out=${booking.check_out}&capacity=${qtd}&booking_id=${booking.id}`);

          const newResult = response.map(r => {
            const isInBooking = booking.rooms.some(br => br.id === r.id);
            return {
              ...r,
              is_selected: isInBooking
            };
          });

          setRooms(newResult);
          setIsUpdate(true);
        })()

        console.log('has room')
      }
    }
  }, [booking])

  function handleSelectRoom(room) {
    apiRequest(`/rooms/book-room`, {
      method: "POST",
      body: JSON.stringify({
        rooms: [{
          booking_id: booking.id,
          room_id: room.id,
          check_in: booking.check_in,
          check_out: booking.check_out
        }]
      })
    });

    setRooms(prevState => prevState.map((r) => {
      if (r.id === room.id) {
        return {
          ...r,
          is_selected: true
        }
      }

      return r
    }));
  }

  useEffect(() => {
    const rm = rooms.filter(r => r.is_selected === true);
    setSelectedRoomsCapacity(rm.reduce((acc, r) => acc + r.capacity, 0))
  }, [rooms])

  async function handleUnselectRoom(room) {
    if (room.is_selected) {
      await apiRequest("/rooms/unselect-room", {
        method: "POST",
        body: JSON.stringify({
          booking_id: booking.id,
          room_id: room.id
        })
      });
    };

    setRooms(prevState => prevState.map((r) => {
      if (r.id === room.id) {
        return {
          ...r,
          is_selected: false
        }
      }

      return r
    }));
  }

  function handleSubmit() {
    if (selectedRoomsCapacity < peopleCapacity) {
      toast.warning("Você não selecionou quartos suficientes pela quantidade total de pessoas na reserva.")
    } else {
      if (isUpdate) {
        navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/finalizar-reserva?booking_id=${booking.id}`);
      } else {
        navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/organizar-reserva?booking_id=${booking.id}`);
      }
    }
  }

  return (
    <section className="flex w-full p-20 justify-between">
      <section className="w-[80%]">
        <GlobalBreadcrumb />
        <div className="flex gap-12 items-end mb-8">
          <div className="flex flex-col space-y-4 mb-6">
            <Text heading={"h1"}>Escolha de quartos</Text>
            <Text heading={"h2"}>Quartos disponíveis para reserva</Text>
          </div>
        </div>
        <section className="grid xl:grid-cols-3 gap-3 sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-1 w-full">
          {
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                userType={userType}
                isSelected={room.is_selected}
                canSelectMore={selectedRoomsCapacity < peopleCapacity}
                onSelect={() => handleSelectRoom(room)}
                onUnselect={() => handleUnselectRoom(room)}
                isUpdate={false}
              />
            ))
          }
        </section>
      </section>
      <Aside action={handleSubmit} />
    </section>
  )
}
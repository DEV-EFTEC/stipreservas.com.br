import Aside from "@/components/Aside";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import Text from "@/components/Text";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useBooking } from "@/hooks/useBooking";
import { apiRequest } from "@/lib/api";
import { Accessibility, AlertTriangle, Building, Terminal, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import RoomCard from "@/components/associate/RoomCard";
import { toast } from "sonner";

export default function GetRoom() {
  const [rooms, setRooms] = useState([]);
  const [userType, setUserType] = useState();
  const [selectedRoomsNumber, setSelectedRoomsNumber] = useState([]);
  const [selectedRoomsCapacity, setSelectedRoomsCapacity] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [peopleCapacity, setPeopleCapacity] = useState(0);
  const { booking } = useBooking();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    setUserType(user.associate_role);

    if (booking) {
      const qtd = (booking.partner_presence ? 1 : 0) + booking.dependents_quantity + booking.guests_quantity + booking.children_age_max_quantity;
      setPeopleCapacity(qtd);
      (async () => {
        const response = await apiRequest(`/rooms/get-available-rooms?check_in=${booking.check_in}&check_out=${booking.check_out}&capacity=${qtd}&booking_id=${booking.id}`);
        setRooms(response);
      })()
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
      toast.warning("Você não selecionou quartos o suficiente pela quantidade total de pessoas na reserva.")
    } else {
      navigate(`/associado/criar-reserva/${booking.id.slice(0, 8)}/finalizar-reserva?booking_id=${booking.id}`);
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
              />
            ))
          }
        </section>
      </section>
      <Aside action={handleSubmit} />
    </section>
  )
}
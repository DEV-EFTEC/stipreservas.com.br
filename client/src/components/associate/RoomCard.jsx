import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UsersRound, Building, Accessibility } from "lucide-react";
import Text from "@/components/Text";

const enumFloor = {
  "0": "Térreo",
  "1": "1º Andar",
  "2": "2º Andar",
  "3": "3º Andar",
};

export default function RoomCard({
  room,
  userType,
  isSelected,
  onSelect,
  onUnselect,
  canSelectMore,
  isUpdate
}) {
  const bookingFee = userType === "partner" ? room.partner_booking_fee_per_day : room.contributor_booking_fee_per_day;
  const guestFee = userType === "partner" ? room.partner_guest_fee_per_day : room.contributor_guest_fee_per_day;

  const formattedCurrency = (value) =>
    Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <Card className={`flex flex-col justify-between ${isSelected && "border-teal-500"}`}>
      <CardContent>
        <Text heading={"h4"}>Quarto {room.number < 10 ? `0${room.number}` : room.number}</Text>
        <div className="flex flex-col space-y-2 mt-4">
          <div className="flex items-center space-x-4">
            <UsersRound size={16} strokeWidth={3} />
            <p className="text-sm font-medium">Capacidade: {room.capacity}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Building size={16} strokeWidth={3} />
            <p className="text-sm font-medium">{enumFloor[room.floor]}</p>
          </div>
          {room.preferential && (
            <Badge variant="preferential">
              <Accessibility size={20} strokeWidth={3} />
              <p className="text-sm font-normal">Preferencial</p>
            </Badge>
          )}
        </div>
      </CardContent>

      <CardContent>
        <div className="mb-5 flex flex-col space-y-2">
          <div>
            <p className="text-sm">Taxa de reserva</p>
            <div className="flex items-center space-x-2">
              <p className="text-xl font-bold">{formattedCurrency(bookingFee)}</p>
              <Text heading="small">por dia</Text>
            </div>
          </div>
          <div>
            <p className="text-sm">Por convidado</p>
            <div className="flex items-center space-x-2">
              <p className="text-xl font-bold">{formattedCurrency(guestFee)}</p>
              <Text heading="small">por dia</Text>
            </div>
          </div>
        </div>

        {room.preferential ? (
          <AlertDialog>
            {isSelected ? (
              <Button variant="selected" className="w-full" onClick={onUnselect} disabled={isUpdate}>
                Cancelar seleção
              </Button>
            ) : (
              <AlertDialogTrigger asChild>
                <Button className="w-full" onClick={onSelect} disabled={!canSelectMore || isUpdate}>
                  Selecionar
                </Button>
              </AlertDialogTrigger>
            )}
            <AlertDialogContent className="bg-amber-400">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Atenção!</AlertDialogTitle>
                <AlertDialogDescription className="text-white">
                  Você está selecionando um quarto preferencial. Caso haja uma solicitação com laudo médico, você será realocado com aviso prévio.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Fechar</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : isSelected ? (
          <Button variant="selected" className="w-full" onClick={onUnselect} disabled={isUpdate}>
            Cancelar seleção
          </Button>
        ) : (
          <Button className="w-full" onClick={onSelect} disabled={!canSelectMore || isUpdate}>
            Selecionar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

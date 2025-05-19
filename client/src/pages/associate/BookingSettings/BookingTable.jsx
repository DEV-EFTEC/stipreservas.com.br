import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function BookingTable({ title, people, rooms, onChangeRoom, onChangeCheckIn, onChangeCheckOut }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Quarto</TableHead>
            <TableHead>Data de entrada</TableHead>
            <TableHead>Data de saída</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map(person => (
            <TableRow key={person.id}>
              <TableCell>{person.name}</TableCell>
              <TableCell>{person.cpf}</TableCell>
              <TableCell>
                <Select
                  value={rooms.length === 1 ? rooms[0].id : person.room_id}
                  disabled={rooms.length === 1}
                  onValueChange={(value) => onChangeRoom(person.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o quarto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Quartos</SelectLabel>
                      {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          Quarto {room.number < 10 ? `0${room.number}` : room.number}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={format(new Date(person.check_in), 'yyyy-MM-dd')}
                  min={format(new Date(person.check_in), 'yyyy-MM-dd')}
                  max={format(new Date(person.check_out), 'yyyy-MM-dd')}
                  onChange={(value) => onChangeCheckIn(person.id, value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={format(new Date(person.check_out), 'yyyy-MM-dd')}
                  min={format(new Date(person.check_in), 'yyyy-MM-dd')}
                  max={format(new Date(person.check_out), 'yyyy-MM-dd')}
                  onChange={(value) => onChangeCheckOut(person.id, value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

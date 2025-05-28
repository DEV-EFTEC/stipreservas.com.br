import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { CircleHelp } from "lucide-react";

export default function BookingTable({ title, people, rooms, onChangeRoom, onChangeCheckIn, onChangeCheckOut, tooltip }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        {
          tooltip &&
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleHelp
                  size={20}
                  className="text-sky-600"
                  strokeWidth={3}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      </div>
      <Table className={'border'}>
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
              <TableCell className="w-1/5">{person.name}</TableCell>
              <TableCell className="w-1/5">{person.cpf}</TableCell>
              <TableCell className="w-1/5">
                <Select
                  value={rooms.length === 1 ? rooms[0].id : person.room_id}
                  disabled={rooms.length === 1}
                  onValueChange={(value) => onChangeRoom(person.id, value)}
                >
                  <SelectTrigger>
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
              <TableCell className="w-1/5">
                <Input
                  type="date"
                  value={format(new Date(person.check_in), 'yyyy-MM-dd')}
                  min={format(new Date(person.check_in), 'yyyy-MM-dd')}
                  max={format(new Date(person.check_out), 'yyyy-MM-dd')}
                  onChange={(value) => onChangeCheckIn(person.id, value)}
                />
              </TableCell>
              <TableCell className="w-1/5">
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

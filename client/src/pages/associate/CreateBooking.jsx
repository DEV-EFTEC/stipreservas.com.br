import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { apiRequest } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DatePickerWithRange from "@/components/DatePickerWithRange";

import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "@/hooks/useBooking";
import Aside from "@/components/Aside";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { Label } from "@/components/ui/label";
import { Baby, User, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function CreateBooking() {
  const { user, loading } = useAuth();
  const { saveBooking } = useBooking();
  const navigate = useNavigate();
  const [date, setDate] = useState({
    from: addDays(new Date(), 7),
    to: addDays(new Date(), 13),
  });
  const [partnerPresence, setPartnerPresence] = useState(true);

  const formSchema = z.object({
    name: z.string(),
    cpf: z.string().min(14),
    associate_role: z.enum(["partner", "contributor"]),
    guests_quantity: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), { message: "Deve ser um número" }),
    dependents_quantity: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), { message: "Deve ser um número" }),
    children_age_max_quantity: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), { message: "Deve ser um número" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      cpf: user.cpf,
      associate_role: user.associate_role,
      guests_quantity: 0,
      dependents_quantity: 0,
      children_age_max_quantity: 0
    }
  });

  async function onSubmit(values) {
    delete values.associate_role;
    delete values.cpf;
    delete values.name;
    values.created_by = user.id;
    const result = await apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        check_in: date.from,
        check_out: date.to,
        partner_presence: partnerPresence
      })
    })
    console.log(result)
    if (result) {
      const resultParticipants = await apiRequest("/bookings/create-participants", {
        method: "POST",
        body: JSON.stringify({
          guests_quantity: values.guests_quantity,
          dependents_quantity: values.dependents_quantity,
          children_age_max_quantity: values.children_age_max_quantity,
          created_by: user.id,
          booking_id: result.id
        })
      });
      saveBooking({ ...values, check_in: date.from, check_out: date.to, id: result.id, partner_presence: partnerPresence });
      navigate(`/associado/criar-reserva/${result.id.slice(0, 8)}/enviar-documentos`, {
        state: { participants: resultParticipants }
      });
    }
  }

  return (
    <>
      {
        !loading
        &&
        <section className="flex w-full p-20 justify-between">
          <section className="w-full">
            <GlobalBreadcrumb />
            <div className="flex flex-col gap-8 mb-6">
              <Text heading={"h1"}>Nova solicitação</Text>
              <Text heading={"h2"}>Informações do titular</Text>
            </div>
            <Form {...form}>
              <form className="space-y-8 rounded-xl w-xl">
                <div className="flex flex-col space-y-8">
                  <div className="flex justify-between gap-15">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className={"w-full"}>
                          <FormLabel>Títular</FormLabel>
                          <FormControl>
                            <Input placeholder={user.name} {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem className={"w-full"}>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input placeholder={user.cpf} {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="associate_role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled
                            className="flex gap-12 flex-row-reverse w-fit"
                          >
                            <FormItem className="flex items-center space-x-0 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="contributor" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Contribuinte
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-0 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="partner" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Sócio
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {
                    user.associate_role == "partner"
                    &&
                    <div className="flex items-center space-x-2">
                      <Checkbox id="partner_presence" onCheckedChange={(checked) => setPartnerPresence(checked)}/>
                      <label
                        htmlFor="partner_presence"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sócio estará presente?
                      </label>
                    </div>
                  }
                </div>
                <hr />
                <div>
                  <Text heading={'h2'}>Dados da reserva</Text>
                </div>
                <div>
                  <Label className={"mb-2"}>Data de Entrada e Saída</Label>
                  <DatePickerWithRange date={date} setDate={setDate} associate_role={user.associate_role} />
                </div>
                <hr />
                <div className="flex flex-col space-y-8">
                  <Text heading={"h2"}>Quantidade de pessoas</Text>
                  <div className="flex justify-between gap-12">
                    <FormField
                      control={form.control}
                      name="dependents_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <User size={20} strokeWidth={3} className="text-blue-500" />
                            Dependentes
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={0} {...field} type={"number"} min={0} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guests_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Users size={20} strokeWidth={3} className="text-pink-500" />
                            Convidados
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={0} {...field} type={"number"} min={0} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="children_age_max_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Baby size={20} strokeWidth={3} className="text-orange-500" />
                            Menores de 5 anos
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={0} {...field} type={"number"} min={0} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
            <Aside action={form.handleSubmit(onSubmit)} />
          </section>
        </section>
      }
    </>
  )
}
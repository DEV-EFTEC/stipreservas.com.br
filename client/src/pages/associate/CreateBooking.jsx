import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { apiRequest } from "@/lib/api";

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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
 
import DatePickerWithRange from "@/components/DatePickerWithRange";
import Aside from "@/components/Aside";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";

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
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      cpf: user.cpf,
      associate_role: user.associate_role,
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
    if (result) {
      saveBooking(result);
      navigate(`/associado/criar-reserva/${result.id.slice(0, 8)}/enviar-documentos`);
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
            <div className="flex flex-col space-y-4 mb-6">
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
                      <Checkbox id="partner_presence" onCheckedChange={(checked) => setPartnerPresence(checked)} />
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
              </form>
            </Form>
            <Aside action={form.handleSubmit(onSubmit)} />
          </section>
        </section>
      }
    </>
  )
}
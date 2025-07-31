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

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import CalendarRangeSelection from "@/components/calendar-range-selection";

export default function CreateDrawApply() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 5, 9),
    to: new Date(2025, 5, 26),
  })
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const draw_id = queryParams.get("draw_id");
  const [partnerPresence, setPartnerPresence] = useState(true);
  const [draw, setDraw] = useState();
  const [drawDate, setDrawDate] = useState();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const result = await apiRequest(`/draws/${draw_id}/get-draw`, {
        method: "GET"
      });
      setDraw(result);
      setDrawDate(new Date(result.start_period_date));
      setDateRange({
        from: new Date(result.start_period_date),
        to: new Date(result.end_period_date),
      })
    })();
    setIsLoading(false);
  }, [draw_id])

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
    const result = await apiRequest("/draws/apply", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        draw_id: draw.id,
        check_in: dateRange.from,
        check_out: dateRange.to,
        partner_presence: partnerPresence
      })
    });
    if (result) {
      await apiRequest("/draws/create-participants-draw", {
        method: "POST",
        body: JSON.stringify({
          holders: [
            {
              holder_id: user.id,
              draw_apply_id: result.id,
              check_in: result.check_in,
              check_out: result.check_out
            }
          ],
          dependents: [],
          guests: [],
          children: []
        })
      });
      navigate(`/associado/sorteio/${result.id.slice(0, 8)}/enviar-documentos`, {
        state: {
          draw_apply_id: result.id
        }
      });
    }
  }

  return (
    <>
      {
        !isLoading
        &&
        <section className="flex w-full p-20 justify-between">
          <section className="w-full">
            <GlobalBreadcrumb />
            <div className="flex flex-col space-y-4 mb-6">
              <Text heading={"h1"}>Nova participação em sorteio</Text>
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
                      <Checkbox id="partner_presence" onCheckedChange={(checked) => setPartnerPresence(checked)} checked disabled />
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
                  {
                    draw
                    &&
                    <CalendarRangeSelection dateRange={dateRange} end_period_date={draw.end_period_date} setDateRange={setDateRange} start_period_date={draw.start_period_date} />
                  }
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
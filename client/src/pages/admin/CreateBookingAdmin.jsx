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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { useAssociate } from "@/hooks/useAssociate";
import maskCPF from "@/lib/maskCPF";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUploadBlock } from "@/components/admin/FileUploadBlock";

export default function CreateBookingAdmin() {
  const { saveAssociate, loading } = useAssociate();
  const [user, setUser] = useState(null);
  const [cpf, setCpf] = useState(null);
  const { saveBooking } = useBooking();
  const navigate = useNavigate();
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
  const [partnerPresence, setPartnerPresence] = useState(true);
  const [userNewPicture, setUserNewPicture] = useState(null);

  const formSchema = z.object({
    name: z.string(),
    cpf: z.string().min(14),
    associate_role: z.enum(["partner", "contributor"]),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("cpf", user.cpf);
      console.log(user.associate_role)
      form.setValue("associate_role", user.associate_role);
    }
  }, [user]);

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
    });
    if (result) {
      const holders = await apiRequest("/bookings/create-participants-booking", {
        method: "POST",
        body: JSON.stringify({
          holders: [
            {
              holder_id: user.id,
              booking_id: result.id,
              check_in: result.check_in,
              check_out: result.check_out
            }
          ],
          dependents: [],
          guests: [],
          children: [],
          associates: [],
          stepchildren: [],
        })
      });
      saveBooking({ ...result, holders });
      navigate(`/admin/criar-reserva/${result.id.slice(0, 8)}/enviar-documentos`);
    }
  }

  async function searchUser() {
    try {
      const result = await apiRequest("/users/find-user-by-cpf", {
        method: "POST",
        body: JSON.stringify({
          cpf: cpf
        })
      });

      if (result) {
        setUser(result);
        saveAssociate(result);
      }
    } catch (err) {
      toast.error(err)
      console.error(err)
    }
  }

  return (
    <section className="w-full xl:p-20 pr-2 overflow-y-auto">
      <section className="w-full mb-40">
        <GlobalBreadcrumb />
        <div className="flex flex-col space-y-4 mb-6">
          <Text heading={"h1"}>Nova solicitação</Text>
          <Text heading={"h2"}>Informações do titular</Text>
          <div className="flex w-fit space-x-4">
            <Input value={cpf} onChange={(e) => {
              const masked = maskCPF(e.target.value);
              setCpf(masked);
            }} placeholder="Digite o CPF do associado" />
            <Button onClick={searchUser}>Procurar</Button>
          </div>
        </div>
        {
          user &&
          <Form {...form}>
            <form className="space-y-8 rounded-xl">
              <div className="flex flex-col space-y-8">
                <div className="flex justify-between space-y-4 flex-wrap sm:flex-nowrap sm:space-y-0 sm:space-x-4">
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
                  <FileUploadBlock
                    label="Documento com foto"
                    id="document_picture"
                    associationId={user.id}
                    documentType={'document_picture'}
                    documentsAssociation={'holder'}
                    userId={user.id}
                    key={'document_picture_sender'}
                    setFile={(url) => setUserNewPicture(url)}
                    value={!userNewPicture ? user.url_document_picture : userNewPicture}
                  />
                </div>
                <div className="flex justify-between space-y-4 flex-wrap sm:flex-nowrap sm:space-y-0 sm:space-x-4">
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem className={"w-full"}>
                        <FormLabel>CNPJ empregador</FormLabel>
                        <FormControl>
                          <Input placeholder={user.enterprise.cnpj} {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="enterprise_name"
                    render={({ field }) => (
                      <FormItem className={"w-full"}>
                        <FormLabel>Razão social</FormLabel>
                        <FormControl>
                          <Input placeholder={user.enterprise.name} {...field} disabled />
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
                          value={field.value}
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
              <div className="mb-4">
                <Label className={"mb-2"}>Data de Entrada e Saída</Label>
                <DatePickerWithRange date={date} setDate={setDate} associate_role={user.associate_role} />
              </div>
            </form>
          </Form>
        }
      </section>
      <Aside action={form.handleSubmit(onSubmit)} isDisabled={date.from === null ? true : false} />
    </section>
  )
}
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { apiRequest } from "@/lib/api";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const formSchema = z.object({
        cpf: z.string().min(14),
        name: z.string().min(5),
        email: z.string().includes('@').includes('.', {
            message: 'Endereço de e-mail inválido.'
        }),
        birth_date: z.string(),
        role: z.string(),
        associate_role: z.enum(["partner", "contributor"]),
        password: z.string()
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cpf: "",
            name: "",
            email: "",
            birth_date: "",
            role: "associate",
            associate_role: "contributor",
            password: ""
        }
    });

    function onSubmit(values) {
        const result = apiRequest("/users/register", {
            method: "POST",
            body: JSON.stringify(values)
        })
        
        if (result) {
            navigate("/signin");
        }
    }

    return (
        <section className="flex flex-col items-center justify-center h-screen bg-radial from-sky-800 to-sky-950">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white w-sm p-10 rounded-xl">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome completo do Títular</FormLabel>
                                <FormControl>
                                    <Input placeholder="E.g.: Juliane Camargo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="birth_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data de nascimento</FormLabel>
                                <FormControl>
                                    <Input placeholder="E.g.: 01/01/1990" {...field} type="date"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                    <Input placeholder="E.g.: 123.456.789-00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Endereço de e-mail</FormLabel>
                                <FormControl>
                                    <Input placeholder="E.g.: julianecam@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Em qual modalidade você se enquadra?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="contributor" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Contribuinte
                                            </FormLabel>
                                        </FormItem>
                                        <FormDescription>
                                            Possui o desconto da taxa assistêncial no holerite.
                                        </FormDescription>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="partner" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Sócio
                                            </FormLabel>
                                        </FormItem>
                                        <FormDescription>
                                            Possui o desconto da taxa assistêncial + o desconto da mensalidade sindical no holerite ou por boleto.
                                        </FormDescription>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <Input placeholder="*******" {...field} type={'password'} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className={"w-full"}>Criar conta</Button>
                    <p>Já possui uma conta? <Link to={"/signin"}>Entrar</Link></p>
                </form>
            </Form>
        </section>
    )
}

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
import { Link, useLocation, useNavigate } from "react-router-dom";
import StipLogo from "@/assets/StipLogo";
import maskCPF from "@/lib/maskCPF";
import validarCpf from "validar-cpf";
import { useEffect, useState } from "react";
import Text from "@/components/Text";
import maskCNPJ from "@/lib/maskCNPJ";
import maskPhone from "@/lib/maskPhone";

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const [tokenIsValid, setTokenIsValid] = useState();
    const [enterprise, setEnterprise] = useState()

    const formSchema = z.object({
        cpf: z.string().min(14, { message: "Deve ter no mínimo de 14 caracteres." }).refine((cpf) => validarCpf(cpf), {
            message: "CPF Inválido."
        }),
        name: z.string().min(5),
        email: z.string().includes('@').includes('.', {
            message: 'Endereço de e-mail inválido.'
        }),
        birth_date: z.string(),
        role: z.string(),
        cnpj: z.string(),
        mobile_phone: z.string(),
        associate_role: z.enum(["partner", "contributor"]),
        password: z.string()
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cpf: "",
            cnpj: "",
            name: "",
            email: "",
            birth_date: "",
            mobile_phone: "",
            role: "associate",
            associate_role: "contributor",
            password: ""
        }
    });

    function onSubmit(values) {
        const result = apiRequest("/users/register", {
            method: "POST",
            body: JSON.stringify({
                ...values,
                token,
                enterprise
            })
        })

        if (result) {
            navigate("/signin");
        }
    }

    useEffect(() => {
        (async () => {
            const result = await apiRequest("/users/verify-registration-link", {
                method: "POST",
                body: JSON.stringify({ token })
            });

            if (result?.success) {
                setTokenIsValid(true);
            } else {
                setTokenIsValid(false);
            }
        })();
    }, []);

    const watchedCnpj = form.watch("cnpj");

    useEffect(() => {
        const cnpjOnlyNumbers = watchedCnpj.replace(/\D/g, '');
        if (cnpjOnlyNumbers.length === 14) {
            (async () => {
                const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjOnlyNumbers}`);
                const result = await res.json();
                setEnterprise({
                    cnpj: result.cnpj,
                    name: result.razao_social
                });
            })();
        }
    }, [watchedCnpj]);

    return (
        <section className="flex flex-col items-center justify-center h-full bg-radial from-sky-800 to-sky-950 py-30 overflow-y-auto space-y-8">
            <StipLogo />
            {
                tokenIsValid
                    ?
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white w-sm p-10 rounded-xl">
                            <div className="flex items-center justify-center text-black">
                                <h2 className="text-2xl font-bold">Seja bem-vindo!</h2>
                            </div>
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
                                            <Input placeholder="E.g.: 01/01/1990" {...field} type="date" />
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
                                            <Input
                                                placeholder="123.456.789-00"
                                                {...field}
                                                onChange={(e) => field.onChange(maskCPF(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cnpj"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CNPJ da empresa (apenas números)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="00.000.000/0001-00"
                                                {...field}
                                                onChange={(e) => field.onChange(maskCNPJ(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mobile_phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Celular</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+55 (00) 90000-0000"
                                                {...field}
                                                onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                            />
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
                                name="associate_role"
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
                            <p className="text-center">Já possui uma conta? <Link to={"/signin"} className="underline text-sky-700">Entrar</Link></p>
                        </form>
                    </Form>
                    :
                    <Text heading={'h1'}>Link inválido ou expirado</Text>
            }
        </section>
    )
}

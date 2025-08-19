import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import StipLogo from "@/assets/StipLogo";
import maskCPF from "@/lib/maskCPF";
import { AlertCircle } from "lucide-react";

export default function SignIn() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState("");

    const formSchema = z.object({
        cpf: z.string().min(14),
        password: z.string()
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cpf: "",
            password: ""
        },
    });

    async function onSubmit(values) {
        try {
            setSubmitError("");

            const result = await apiRequest("/users/login", {
                method: "POST",
                body: JSON.stringify(values)
            });

            if (!result?.token) {
                throw new Error("CPF ou senha inválidos.");
            }

            localStorage.setItem("token", result.token);
            login(result.user);
            navigate(result.path);
        } catch (err) {
            setSubmitError(err.message || "Erro ao fazer login. Tente novamente.");
        }
    }

    return (
        <section className="flex flex-col items-center justify-center h-screen bg-radial from-sky-800 to-sky-950 gap-8">
            <StipLogo />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-4 md:p-10 rounded-xl w-5/6 md:w-2/6 spce-y-10">
                    <div className="flex items-center justify-center text-black">
                        <h2 className="text-2xl font-bold">Seja bem-vindo!</h2>
                    </div>
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
                    {submitError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Houve um erro!</AlertTitle>
                            <AlertDescription>
                                {submitError}
                            </AlertDescription>
                        </Alert>
                    )}
                    <Button type="submit" className={"w-full"}>Entrar</Button>
                </form>
            </Form>
            <p className="text-sm text-white text-center">
                Clicando em continuar, você concorda com os nossos<br />
                <Link className="underline">Termos de Serviço</Link> e <Link className="underline">Políticas de Privacidade</Link>.
            </p>
        </section>
    )
}

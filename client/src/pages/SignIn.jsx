import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import StipLogo from "@/assets/StipLogo";
import Text from "@/components/Text";

export default function SignIn() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const formSchema = z.object({
        cpf: z.string().min(14),
        password: z.string()
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cpf: "",
            password: ""
        }
    });

    async function onSubmit(values) {
        const result = await apiRequest("/users/login", {
            method: "POST",
            body: JSON.stringify(values)
        })
        if (result) {
            localStorage.setItem("token", result.token);
            login(result.user);
            navigate(result.path);
        }
    }

    return (
        <section className="flex flex-col items-center justify-center h-screen bg-radial from-sky-800 to-sky-950 space-y-8">
            <StipLogo />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white w-sm p-10 rounded-xl">
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
                                    <Input placeholder="123.456.789-00" {...field} />
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
                    <Button type="submit" className={"w-full"}>Entrar</Button>
                    <p className="text-center">Ainda não criou sua conta? <Link to={"/register"} className="underline text-sky-700">Registre-se</Link></p>
                </form>
            </Form>
            <p className="text-sm text-white text-center">
                Clicando em continuar, você concorda com os nossos<br />
                <Link className="underline">Termos de Serviço</Link> e <Link className="underline">Políticas de Privacidade</Link>.
            </p>
        </section>
    )
}

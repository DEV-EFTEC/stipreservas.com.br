import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from "react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { Check, Copy, ShieldAlert } from "lucide-react";

export function PasswordConfirmDialog({ userId }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [isCopied, setIsCopied] = useState(false)

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await apiRequest(`/users/verify-password`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });

      setLoading(false);
      if (res.success) {
        toast.success("Senha confirmada.");
        setLoading(true);
        toast.info("Gerando nova senha...");
        const userPass = await apiRequest(`/users/generate-new-password`, {
          method: 'POST',
          body: JSON.stringify({
            userId
          })
        })
        setPassword("");
        setUserPassword(userPass);
      } else {
        toast.error("Senha incorreta.");
      }
    } catch (err) {
      toast.error("Erro ao verificar senha.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyClick() {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      toast.success('Link copiado com sucesso!')
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Regerar senha</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmação necessária</AlertDialogTitle>
          <AlertDialogDescription>
            Digite sua senha para gerar uma nova senha para o usuário.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {
          userPassword &&
          <>
            <Alert variant="warning">
              <ShieldAlert />
              <AlertTitle>ATENÇÃO!</AlertTitle>
              <AlertDescription>
                Após sair dessa tela a senha não poderá ser vista novamente. Em caso de perde-la será necessário regerá-la.
              </AlertDescription>
            </Alert>
            <div className="flex">
              <Input defaultValue={userPassword} disabled />
              <Button variant="positive" onClick={handleCopyClick} >{!isCopied ? <Copy /> : <Check />}{!isCopied ? 'Copiar' : 'Copiado'}</Button>
            </div>
          </>
        }
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={loading || !password}>
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, Check, Copy, Dices, Link, MessageCircleQuestion, PartyPopper, Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingGif from "@/assets/loading.gif";
import SuccessGif from "@/assets/success.gif";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function GenerateRegisterLink() {
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
  const [link, setLink] = useState(null)
  const [isCopied, setIsCopied] = useState(false)

  async function getLink() {
    setButtonIsDisabled(true);
    const result = await apiRequest(`/users/generate-registration-link`, {
      method: "POST",
    });
    setLink(result.link);
    setButtonIsDisabled(false);
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
    <section className="flex w-full p-20 justify-between overflow-y-auto overflow-x-hidden">
      <section className="w-full">
        <GlobalBreadcrumb />
        <div className="flex gap-12 items-end mb-8">
          <Text heading={'h1'}>Gerar link de cadastro</Text>
        </div>
        <section>
          <div className="w-full flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="flex">
              <Input defaultValue={link} placeholder={'O link aparecerá aqui'}/>
              <Button variant="positive" onClick={handleCopyClick} >{!isCopied ? <Copy /> : <Check />}{!isCopied ? 'Copiar' : 'Copiado'}</Button>
            </div>
            <Button variant="default" onClick={getLink} disabled={buttonIsDisabled}><Link />Gerar link</Button>
          </div>
        </section>
      </section>
    </section>
  )
}
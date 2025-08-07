import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Text from "@/components/Text";
import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { Check, Circle, Copy, Link, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function CreateSystemUser() {
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
  const [link, setLink] = useState(null)
  const [isCopiedUser, setIsCopiedUser] = useState(false)
  const [isCopiedPassword, setIsCopiedPassword] = useState(false)
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState(null)
  const [typeNewUser, setTypeNewUser] = useState('admin');

  useEffect(() => {
    (async () => {
      try {
        const result = await apiRequest(`/users/find-no-associate`, {
          method: "GET",
        });

        setUsers(result);
      } catch (err) {
        toast.error(err.message)
      }
    })();
  }, []);

  async function handleCreateNewUser() {
    const result = await apiRequest(`/users/create-new-superuser`, {
      method: "POST",
      body: JSON.stringify({
        role: typeNewUser
      })
    })
    setNewUser(result);
    setUsers(prevState => [...prevState, result])
    setTypeNewUser(null)
    toast.success('Sucesso!', 'Novo usuário criado com sucesso!');
  }

  async function handleCopyClick(prop, setState) {
    try {
      await navigator.clipboard.writeText(prop);
      setState(true);
      toast.success('Copiado com sucesso!')
      setTimeout(() => setState(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section className="flex w-full p-20 justify-between overflow-y-auto overflow-x-hidden">
      <section className="w-full">
        <GlobalBreadcrumb />
        <div className="flex gap-12 items-end mb-8">
          <Text heading={'h1'}>Usuários do sistema</Text>
        </div>
        <div className="flex items-start mb-8 justify-between flex-col">
          <div className="flex items-center space-x-4">
            <Text heading={'h2'}>Criar novo usuário</Text>
            <Select value={typeNewUser} onValueChange={(e) => setTypeNewUser(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin"><Circle size={16} strokeWidth="20px" color={'#052f4a'} className="rounded-xl" />Adm Curitiba</SelectItem>
                <SelectItem value="local"><Circle size={16} strokeWidth="20px" color={'#973c00'} className="rounded-xl" />Adm Shangri-lá</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreateNewUser}>Criar</Button>
          </div>
          <div className="flex w-full justify-between items-center mt-4">
            {
              newUser &&
              <>
                <div className="flex space-x-4 flex-col w-full">
                  <p>CPF para login: {newUser.cpf} <Button variant="ghost" onClick={() => handleCopyClick(newUser.cpf, setIsCopiedUser)} >{!isCopiedUser ? <Copy /> : <Check />}{!isCopiedUser ? 'Copiar' : 'Copiado'}</Button></p>
                  <p>Senha: {newUser.password} <Button variant="ghost" onClick={() => handleCopyClick(newUser.password, setIsCopiedPassword)} >{!isCopiedPassword ? <Copy /> : <Check />}{!isCopiedPassword ? 'Copiar' : 'Copiado'}</Button></p>
                </div>
                <Alert variant="warning">
                  <ShieldAlert />
                  <AlertTitle>ATENÇÃO!</AlertTitle>
                  <AlertDescription>
                    Após sair dessa tela a senha não poderá ser vista novamente. Em caso de perde-la será necessário regerá-la.
                  </AlertDescription>
                </Alert>
              </>
            }
          </div>
        </div>
        <section>
          <Text heading={'h2'}>Usuários do sistema</Text>
          <DataTable columns={columns} data={users} />
        </section>
      </section>
    </section>
  )
}
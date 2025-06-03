import GlobalBreadcrumb from "@/components/associate/GlobalBreadcrumb";
import { FileUploadBlock } from "@/components/FileUploadBlock";
import Text from "@/components/Text";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Profile() {
  const { user, login } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await apiRequest(`/users/find-user-by-id`, {
        method: 'POST',
        body: JSON.stringify({
          id: user.id
        })
      });
      setUserProfile(data.result);
    })();
  }, [])

  async function handleSubmit() {
    const { url_document_picture, url_profile_picture } = userProfile;
    const result = await apiRequest(`/users/update-user/${userProfile.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        url_document_picture,
        url_profile_picture
      })
    });
    login(result);
    if (result) toast.success("Sua conta foi atualizada com sucesso!");
  }

  return (
    <section className="w-full p-20">
      <GlobalBreadcrumb />
      {
        userProfile &&
        <div className="flex w-full justify-between mb-10 flex-col">
          <Text heading={'h1'}>Perfil</Text>
          <div className="mt-10 flex flex-col space-y-10 mb-10">
            <FileUploadBlock
              label="Foto de perfil"
              id="profile_picture"
              associationId={userProfile.id}
              documentType={'profile_picture'}
              documentsAssociation={'holder'}
              userId={userProfile.id}
              key={'profile_picture_sender'}
              setFile={(url) => setUserProfile(prevState => {
                const newURL = url; return {
                  ...prevState,
                  url_profile_picture: newURL
                }
              })}
              value={userProfile ? userProfile.url_profile_picture : ""}
            />
            <FileUploadBlock
              label="Documento com foto"
              id="document_picture"
              associationId={userProfile.id}
              documentType={'document_picture'}
              documentsAssociation={'holder'}
              userId={userProfile.id}
              key={'document_picture_sender'}
              setFile={(url) => setUserProfile(prevState => {
                const newURL = url; return {
                  ...prevState,
                  url_document_picture: newURL
                }
              })}
              value={userProfile ? userProfile.url_document_picture : ""}
            />
          </div>
          <Button className={'w-fit'} onClick={handleSubmit}>Salvar</Button>
        </div>
      }
    </section>
  )
}
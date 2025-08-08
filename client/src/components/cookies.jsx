import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

const STORAGE_KEY = 'cookieConsent';
const DEFAULT_CONSENT = {
  essential: true,
  analytics: false,
  marketing: false,
  thirdPartyMedia: false,
  version: '2025-08-08',
};

function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler consentimento:', e);
    return null;
  }
}

function writeConsent(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.error('Erro ao salvar consentimento:', e);
  }
}

export function useCookieConsent() {
  const [consent, setConsent] = useState(() => readConsent() || DEFAULT_CONSENT);

  useEffect(() => {
    writeConsent(consent);
  }, [consent]);

  return [consent, setConsent];
}

export function YoutubeEmbed({ videoId, width = 560, height = 315, title = 'YouTube video' }) {
  const [consent] = useCookieConsent();

  if (!consent || !consent.thirdPartyMedia) {
    return (
      <div className="border rounded-md p-4 bg-neutral-50 text-center">
        <p className="mb-3">Este vídeo está hospedado no YouTube e pode definir cookies de terceiros.</p>
        <p className="text-sm text-muted-foreground mb-3">Para visualizar, aceite cookies de mídia nas configurações de cookies.</p>
        <div className="mx-auto inline-block">
          <a href="#cookie-settings" className="underline text-sm">Abrir configurações de cookies</a>
        </div>
      </div>
    );
  }

  const src = `https://www.youtube.com/embed/${videoId}`;
  return (
    <div className="aspect-video">
      <iframe
        title={title}
        width={width}
        height={height}
        src={src}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default function CookieBanner() {
  const [consent, setConsent] = useState(undefined);
  const [openDialog, setOpenDialog] = useState(false);


  useEffect(() => {
    const saved = readConsent();
    if (saved) {
      setConsent(saved); // já tem consentimento salvo
    } else {
      setConsent(null);  // ainda não aceitou/rejeitou
    }
  }, []);

  function acceptAll() {
    const next = { ...DEFAULT_CONSENT, analytics: true, marketing: true, thirdPartyMedia: true, acceptedAt: new Date().toISOString() };
    setConsent(next);
    writeConsent(next);
  }

  function rejectNonEssential() {
    const next = { ...DEFAULT_CONSENT, analytics: false, marketing: false, thirdPartyMedia: false, acceptedAt: new Date().toISOString() };
    setConsent(next);
    writeConsent(next);
  }

  function saveSettings(partial) {
    const next = { ...DEFAULT_CONSENT, ...partial, acceptedAt: new Date().toISOString() };
    setConsent(next);
    writeConsent(next);
    setOpenDialog(false);
  }

  if (consent && consent.acceptedAt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Usamos cookies</h3>
          <p className="text-sm text-muted-foreground">Utilizamos cookies para melhorar sua experiência. Vídeos incorporados (YouTube) podem definir cookies de terceiros. Você pode aceitar todos os cookies ou gerenciar suas preferências.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-2">
          <Button onClick={acceptAll}>Aceitar todos</Button>
          <Button onClick={rejectNonEssential}>Recusar não-essenciais</Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost">Configurações</Button>
            </DialogTrigger>
            <DialogContent id="cookie-settings" className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Configurações de Cookies</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Essenciais</p>
                    <p className="text-sm text-muted-foreground">Necessários para o funcionamento da plataforma (sempre ativos).</p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics</p>
                    <p className="text-sm text-muted-foreground">Usamos para entender uso da plataforma e melhorar o serviço.</p>
                  </div>
                  <Switch
                    checked={consent ? consent.analytics : false}
                    onCheckedChange={(val) => setConsent((prev) => ({ ...(prev || DEFAULT_CONSENT), analytics: !!val }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing</p>
                    <p className="text-sm text-muted-foreground">Publicidade e comunicações externas.</p>
                  </div>
                  <Switch
                    checked={consent ? consent.marketing : false}
                    onCheckedChange={(val) => setConsent((prev) => ({ ...(prev || DEFAULT_CONSENT), marketing: !!val }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mídia incorporada (YouTube)</p>
                    <p className="text-sm text-muted-foreground">Permite carregar vídeos do YouTube que podem definir cookies de terceiros.</p>
                  </div>
                  <Switch
                    checked={consent ? consent.thirdPartyMedia : false}
                    onCheckedChange={(val) => setConsent((prev) => ({ ...(prev || DEFAULT_CONSENT), thirdPartyMedia: !!val }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <div className="flex gap-2 w-full justify-end">
                  <Button variant="outline" onClick={() => { setConsent(DEFAULT_CONSENT); setOpenDialog(false); }}>Cancelar</Button>
                  <Button onClick={() => saveSettings(consent || DEFAULT_CONSENT)}>Salvar preferências</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

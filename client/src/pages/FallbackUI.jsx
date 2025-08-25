import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Home, RefreshCw, Wifi, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function FallbackUI({ homePath }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-sky-700" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-sky-100 rounded-full animate-ping"></div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 font-sans">Oops! Algo deu errado</h1>
          <p className="text-lg text-gray-600 font-sans">Não se preocupe! Estamos aqui para ajudar.</p>
        </div>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Você pode tentar:</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-gray-600">
                <RefreshCw className="w-5 h-5 text-amber-600" />
                <span>Recarregar a página</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Wifi className="w-5 h-5 text-amber-600" />
                <span>Verificar sua conexão com a internet</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MessageCircle className="w-5 h-5 text-amber-600" />
                <span>Entrar em contato com o suporte</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button onClick={() => window.location.reload()} size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>

          <Button variant="outline" size="lg" onClick={() => navigate(homePath)}>
            <Home className="w-4 h-4 mr-2" />
            Voltar para a Página Inicial
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          Se o problema persistir, nossa equipe de suporte está sempre disponível para ajudar você.
          Esses erros são enviados e analisados. Nas próximas horas o problema já estará resolvido.
        </p>
      </div>
    </div>
  )
}

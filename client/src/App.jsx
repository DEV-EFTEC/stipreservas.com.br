"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Phone,
  Users,
  CreditCard,
  FileCheck,
  Gift,
  Waves,
  Calendar,
  CheckCircle,
  MessageCircle,
  Smartphone,
} from "lucide-react"
import { Link } from "react-router-dom"
import StipLogo from "./assets/StipLogo"
import SedePraia from "./assets/SedePraia.jpg"
import SedePraiaFachada from "./assets/SedePraiaFachada.jpg"
import SedePraiaPanoramica from "./assets/SedePraiaPanoramica.png"
import SedePraiaAerea from "./assets/SedePraiaAerea.png"
import SedePraiaEstacionamento from "./assets/SedePraiaEstacionamento.jpg"
import SedePraiaPiscina from "./assets/SedePraiaPiscina.jpg"
import ReactPlayer from 'react-player'

export default function UnionBeachHeadquarters() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-sky-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StipLogo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="#processo" className="hover:text-sky-200 transition-colors">
                  Processo
                </a>
                <a href="#sorteios" className="hover:text-sky-200 transition-colors">
                  Sorteios
                </a>
                <a href="#contato" className="hover:text-sky-200 transition-colors">
                  Contato
                </a>
              </nav>
              <Button className="bg-white text-sky-900 hover:bg-zinc-100 font-semibold ml-4" size="sm" asChild>
                <a href={'/signin'}>
                  Entrar
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-sky-800"
                onClick={() => {
                  const mobileMenu = document.getElementById("mobile-menu")
                  mobileMenu?.classList.toggle("hidden")
                }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div id="mobile-menu" className="hidden md:hidden mt-4 pb-4 border-t border-sky-800">
            <nav className="flex flex-col space-y-3 mt-4">
              <a href="#processo" className="hover:text-sky-200 transition-colors py-2">
                Processo
              </a>
              <a href="#sorteios" className="hover:text-sky-200 transition-colors py-2">
                Sorteios
              </a>
              <a href="#contato" className="hover:text-sky-200 transition-colors py-2">
                Contato
              </a>
              <Button className="bg-white text-sky-900 hover:bg-zinc-100 font-semibold mt-4 w-full" size="sm" asChild>
                <a href={'/signin'}>
                  Entrar
                </a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-sky-900 via-sky-800 to-sky-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-sky-600 hover:bg-sky-600 text-white">Exclusivo para Associados</Badge>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">Sua Sede na Praia Está Te Esperando</h2>
                <p className="text-xl text-sky-100 leading-relaxed">
                  Desfrute de momentos únicos na nossa sede praia com toda a família. Faça sua reserva de forma simples
                  e segura, com pagamento via Pix e participe dos nossos sorteios de alta temporada.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-sky-900 hover:bg-zinc-100 font-semibold" asChild>
                    <Link to="https://wa.link/dhybtn" target="_blank">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contatar via WhatsApp
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-sky-900 bg-transparent"
                    asChild
                  >
                    <Link to="#processo">Ver Como Funciona</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src={SedePraia}
                  alt="Sede Praia do Sindicato"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white text-sky-900 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">Exclusivo Associados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration Notice */}
        <section className="bg-amber-50 border-l-4 border-amber-400 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-start space-x-4">
              <Smartphone className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Importante: Cadastro Obrigatório via WhatsApp</h3>
                <p className="text-amber-700">
                  Para se cadastrar e ter acesso ao sistema de reservas, é necessário entrar em contato conosco via
                  WhatsApp para comprovar a assistência sindical e receber o link da página de cadastro.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Location Presentation Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Conheça Nossa Sede Praia</h2>
              <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
                Localizada em um dos pontos mais privilegiados do litoral, nossa sede oferece toda a infraestrutura
                necessária para momentos inesquecíveis com sua família.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-sky-900 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2">Localização Privilegiada</h3>
                    <p className="text-zinc-600 mb-3">
                      Rua Olinda, 278-344, Balneário de Shangri-lá
                      <br />
                      Pontal do Paraná, PR - CEP: 83255-000
                    </p>
                    <p className="text-zinc-600">
                      Situada a apenas uma quadra da praia, com fácil acesso e estacionamento disponível para todos os
                      hóspedes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Waves className="h-6 w-6 text-sky-900 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2">Infraestrutura</h3>
                    <p className="text-zinc-600">
                      O prédio conta com 25 apartamentos, cada um com um beliche e uma cama de casal, ventilador de teto, guarda-roupa e frigobar. A cozinha coletiva dispõem de 6 cooktops de quatro bocas, forno elétrico e microondas. As famílias também podem desfrutar, nas acomodações, de mesas e banquetas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Users className="h-6 w-6 text-sky-900 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2">Capacidade</h3>
                    <p className="text-zinc-600">
                      25 quartos totalmente equipados, acomodando em torno de 108 pessoas, garantindo conforto e privacidade para
                      todas as famílias.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src={SedePraiaFachada}
                  alt="Fachada da Sede Praia do Sindicato"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute top-4 right-4 bg-sky-900 text-white px-3 py-2 rounded-lg">
                  <span className="text-sm font-semibold">1 quadra de distância da praia</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-sky-200 hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="bg-sky-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Waves className="h-8 w-8 text-sky-900" />
                  </div>
                  <h4 className="font-semibold text-zinc-900 mb-2">Acesso Direto à Praia</h4>
                  <p className="text-zinc-600 text-sm">Apenas 1 quadra de distância</p>
                </CardContent>
              </Card>

              <Card className="border-sky-200 hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="bg-sky-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-sky-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-zinc-900 mb-2">Estacionamento</h4>
                  <p className="text-zinc-600 text-sm">Vagas para todos os hóspedes</p>
                </CardContent>
              </Card>

              <Card className="border-sky-200 hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="bg-sky-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-sky-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-zinc-900 mb-2">Área de Lazer</h4>
                  <p className="text-zinc-600 text-sm">Aproveite momentos de lazer com nossas piscinas, ideais tanto para adultos quanto para os pequenos.</p>
                </CardContent>
              </Card>

              <Card className="border-sky-200 hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="bg-sky-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-sky-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-zinc-900 mb-2">Segurança 24h</h4>
                  <p className="text-zinc-600 text-sm">Portaria e monitoramento</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 bg-zinc-50 rounded-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">Como Chegar</h3>
                <p className="text-zinc-600">
                  Fácil acesso pela PR-412 (Rodovia Eng. Darci Gomes de Morais), com sinalização clara e vias pavimentadas.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-sky-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900">Rodovia PR-412 (Eng. Darci Gomes de Morais)</h4>
                      <p className="text-zinc-600 text-sm">Siga pela rodovia até a altura da Av. Sebastião Caboto.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-sky-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900">Av. Sebastião Caboto</h4>
                      <p className="text-zinc-600 text-sm">Vire à direita na Rua Luiz da Silveira, depois à esquerda na Av. Sebastião Caboto.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-sky-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900">Rua Olinda</h4>
                      <p className="text-zinc-600 text-sm">Vire à direita na Rua Olinda e siga até o número 278.</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white rounded-lg border border-sky-200">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-sky-900" />
                      <div>
                        <p className="font-semibold text-zinc-900">Endereço Completo:</p>
                        <p className="text-zinc-600">Rua Olinda, 278-344, Balneário de Shangri-lá</p>
                        <p className="text-zinc-600">Pontal do Paraná, PR - CEP: 83255-000</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d899.3823163362722!2d-48.416747!3d-25.620554!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94db9598e3537969%3A0x42b62cd193d3314b!2sStip!5e0!3m2!1spt-BR!2sbr!4v1753986777281!5m2!1spt-BR!2sbr" width="100%" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <a href="https://maps.app.goo.gl/XHXvD9vnztUMrE9p6" target="_blank">
                      <Button className="bg-white text-sky-900 hover:bg-zinc-100">
                        <MapPin className="mr-2 h-4 w-4" />
                        Ver no Google Maps
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery Section */}
        <section className="py-20 bg-zinc-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Galeria</h2>
              <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
                Conheça todos os ambientes da nossa sede praia através das nossas fotos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Main Featured Photo */}
              <div className="lg:col-span-2 lg:row-span-2">
                <ReactPlayer
                  src="https://www.youtube.com/watch?v=8gN8QvMfEEw"
                  controls
                  width="100%"
                  height="100%"
                />
              </div>

              {/* Quartos */}
              <div className="relative group overflow-hidden rounded-lg shadow-lg h-48">
                <img
                  src={SedePraiaPiscina}
                  alt="Piscinas"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover object-[20%_60%] group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-semibold">Piscinas</h4>
                  <p className="text-xs">Parte externa</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-lg shadow-lg h-48">
                <img
                  src={SedePraiaFachada}
                  alt="Fachada"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-semibold">Fachada Sede Praia</h4>
                  <p className="text-xs">Parte Externa</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-lg shadow-lg h-48">
                <img
                  src={SedePraiaEstacionamento}
                  alt="Estacionamento"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-semibold">Estacionamento</h4>
                  <p className="text-xs">Seguro</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-lg shadow-lg h-48">
                <img
                  src={SedePraiaAerea}
                  alt="Vista aerea"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-semibold">Sede por vista aérea</h4>
                  <p className="text-xs">Parte externa</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-lg shadow-lg h-48">
                <img
                  src={SedePraiaPanoramica}
                  alt="Vista panorâmica"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h4 className="font-semibold">Vista panorâmica</h4>
                  <p className="text-xs">Apenas 1 quadra de distância da praia</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="processo" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Como Fazer Sua Reserva</h2>
              <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
                Processo simples e seguro em 5 etapas para garantir sua estadia na sede praia
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-sky-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-sky-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      1
                    </div>
                    <CardTitle className="text-sky-900">Informações Pessoais</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600">
                    Insira as informações necessárias como RG do titular e documentos dos acompanhantes.
                  </CardDescription>
                  <div className="mt-4 flex items-center text-sm text-zinc-500">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Documentação obrigatória
                  </div>
                </CardContent>
              </Card>

              <Card className="border-sky-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-sky-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      2
                    </div>
                    <CardTitle className="text-sky-900">Escolha do Quarto</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600">
                    Selecione o quarto desejado e o período de permanência para cada membro da família.
                  </CardDescription>
                  <div className="mt-4 flex items-center text-sm text-zinc-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    Disponibilidade em tempo real
                  </div>
                </CardContent>
              </Card>

              <Card className="border-sky-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-sky-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      3
                    </div>
                    <CardTitle className="text-sky-900">Envio da Solicitação</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600">
                    Envie sua solicitação de reserva com todos os dados preenchidos para análise.
                  </CardDescription>
                  <div className="mt-4 flex items-center text-sm text-zinc-500">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmação automática
                  </div>
                </CardContent>
              </Card>

              <Card className="border-sky-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-sky-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      4
                    </div>
                    <CardTitle className="text-sky-900">Aprovação Administrativa</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600">
                    Nossa equipe analisa a documentação e aprova sua solicitação para liberação do pagamento.
                  </CardDescription>
                  <div className="mt-4 flex items-center text-sm text-zinc-500">
                    <Users className="h-4 w-4 mr-2" />
                    Análise em até 24h
                  </div>
                </CardContent>
              </Card>

              <Card className="border-sky-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-sky-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      5
                    </div>
                    <CardTitle className="text-sky-900">Pagamento via Pix</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600">
                    Após aprovação, realize o pagamento de forma rápida e segura através do Pix.
                  </CardDescription>
                  <div className="mt-4 flex items-center text-sm text-zinc-500">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pagamento instantâneo
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-green-800">Autorização e Acesso</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-green-700">
                    Receba sua autorização e aproveite sua estadia na sede praia com toda tranquilidade!
                  </CardDescription>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <Waves className="h-4 w-4 mr-2" />
                    Pronto para curtir!
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Raffles Section */}
        <section id="sorteios" className="py-20 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white mb-4">Alta Demanda</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Sistema de Sorteios por Alta Demanda
              </h2>
              <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
                Devido ao número limitado de quartos e alta procura, utilizamos um sistema de sorteios para determinar
                quais associados poderão fazer suas reservas durante períodos de alta demanda.
              </p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="border-amber-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-amber-500 mb-4" />
                  <CardTitle className="text-amber-800">Quartos Limitados</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Nossa sede possui número limitado de acomodações, tornando necessário um processo justo de seleção
                    durante períodos de alta procura.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Gift className="h-12 w-12 text-amber-500 mb-4" />
                  <CardTitle className="text-amber-800">Sistema Justo</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    O sorteio garante que todos os associados tenham chances iguais de acesso às acomodações,
                    independentemente da ordem de solicitação.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Calendar className="h-12 w-12 text-amber-500 mb-4" />
                  <CardTitle className="text-amber-800">1 Quarto por Associado</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Cada associado tem direito a reservar apenas 1 quarto por período, garantindo que mais famílias
                    possam usufruir da sede.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="bg-white rounded-lg p-8 shadow-lg max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-zinc-900 mb-6">Como Funciona o Sistema de Sorteios?</h3>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900">Período de Inscrições</h4>
                        <p className="text-zinc-600 text-sm">Associados se inscrevem durante o período determinado</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900">Sorteio Transparente</h4>
                        <p className="text-zinc-600 text-sm">Realização do sorteio com todos os inscritos</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900">Contemplados Notificados</h4>
                        <p className="text-zinc-600 text-sm">Associados sorteados são comunicados via WhatsApp</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900">Processo de Reserva</h4>
                        <p className="text-zinc-600 text-sm">Contemplados seguem o processo normal de reserva</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start space-x-3">
                    <Gift className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">Importante</h4>
                      <p className="text-amber-700 text-sm">
                        O sorteio é aplicado apenas em períodos de alta demanda quando o número de solicitações excede a
                        capacidade disponível. Em períodos normais, as reservas seguem o processo padrão por ordem de
                        chegada.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contato" className="py-20 bg-sky-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato Conosco</h2>
              <p className="text-xl text-sky-100 max-w-3xl mx-auto">
                Para se cadastrar e ter acesso ao sistema de reservas, entre em contato via WhatsApp. Nossa equipe está
                pronta para ajudar você!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <MessageCircle className="h-8 w-8 text-sky-300 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">WhatsApp Oficial</h3>
                    <p className="text-sky-100 mb-4">
                      Entre em contato para comprovar assistência sindical e receber o link de cadastro.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                      <Link to="https://wa.link/dhybtn" target="_blank">
                        <Phone className="mr-2 h-4 w-4" />
                        Contatar via WhatsApp
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-8 w-8 text-sky-300 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Localização</h3>
                    <p className="text-sky-100">
                      Nossa sede praia está localizada em um dos pontos mais privilegiados da costa, oferecendo toda a
                      infraestrutura necessária para sua família.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Calendar className="h-8 w-8 text-sky-300 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Horário de Atendimento</h3>
                    <p className="text-sky-100">
                      Segunda a Sexta: 8h às 17h (Sede de Curitiba)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6">Informações Importantes</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span className="text-sky-100">Cadastro obrigatório via WhatsApp</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span className="text-sky-100">Comprovação de assistência sindical necessária</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span className="text-sky-100">Pagamento seguro via Pix</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span className="text-sky-100">Sorteios exclusivos na alta temporada</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span className="text-sky-100">Aprovação administrativa em até 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <StipLogo />
              </div>
              <p className="text-zinc-400">
                Proporcionando momentos únicos de lazer e descanso para nossos associados e suas famílias.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
              <div className="space-y-2">
                <a href="#processo" className="block hover:text-sky-400 transition-colors">
                  Como Reservar
                </a>
                <a href="#sorteios" className="block hover:text-sky-400 transition-colors">
                  Sorteios
                </a>
                <a href="#contato" className="block hover:text-sky-400 transition-colors">
                  Contato
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp: (41) 99152-0296
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Rua Olinda, 278-344, Balneário de Shangri-lá, Pontal do Paraná - PR
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-700 mt-8 pt-8 text-center">
            <p className="text-zinc-400">
              © {new Date().getFullYear()} STIP reservas. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

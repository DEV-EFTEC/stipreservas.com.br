import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router";
import { AuthProvider } from './hooks/useAuth';
import { BookingProvider } from './hooks/useBooking';
import ProtectedRoute from './components/ProtectedRoute';

import { SidebarProvider as AssociateSidebarProvider, SidebarTrigger as AssociateSidebarTrigger } from './components/ui/sidebar';
import { SidebarProvider as AdminSidebarProvider, SidebarTrigger as AdminSidebarTrigger } from './components/ui/admin/sidebar';

import { AppSidebar as AssociateSidebar } from './components/associate/AppSidebar';
import { AppSidebar as AdminSidebar } from './components/admin/AppSidebar';
import { Home as AssociateHome } from './pages/associate/Home/index';
import { Profile as AssociateProfile } from './pages/associate/Profile.jsx';
import { Home as AdminHome } from './pages/admin/Home/index';

import App from './App';
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";

import Unauthorized from './pages/Unauthorized';
import CreateBooking from './pages/associate/CreateBooking';
import SendDocuments from './pages/associate/SendDocuments/index';
import GetRoom from './pages/associate/GetRoom';
import BookingDetails from './pages/associate/BookingDetails';
import FinishBook from './pages/associate/FinishBook';
import BookingSettings from './pages/associate/BookingSettings/index';

import ApproveDocuments from './pages/admin/ApproveDocuments';

import "@/lib/setupPDF";
import './index.css';
import { SocketProvider } from './hooks/useSocket';
import { BookingDetails as AdminBookingDetails } from './pages/admin/BookingDetails';
import { DrawDetails as AdminDrawDetails } from './pages/admin/DrawDetails';
import ApprovePage from './pages/admin/ApprovePage';
import Settings from './pages/admin/Settings';
import { DrawSettings } from './pages/admin/DrawSettings';
import CreateDrawApply from './pages/associate/Draw/CreateDrawApply';
import SendDocumentsDraw from './pages/associate/Draw/SendDocuments';
import FinishApplyDraw from './pages/associate/Draw/FinishApplyDraw';
import { RaffleWithParticipants } from './pages/admin/RaffleWithParticipants';
import { Run } from './pages/admin/Run';
import { CalendarMode } from './pages/admin/CalendarMode';
import RefusePage from './pages/admin/RefusePage';
import ListDependents from './pages/associate/Escorts/ListDependents';
import ListGuests from './pages/associate/Escorts/ListGuests';
import ApproveDocumentsDraw from './pages/admin/ApproveDocumentsDraw';
import ApprovePageDraw from './pages/admin/ApprovePageDraw';
import RefusePageDraw from './pages/admin/RefusePageDraw';
import { AssociateProvider } from './hooks/useAssociate';
import CreateBookingAdmin from './pages/admin/CreateBookingAdmin';
import SendDocumentsAdmin from './pages/admin/SendDocumentsAdmin';
import GetRoomAdmin from './pages/admin/GetRoomAdmin';
import FinishBookAdmin from './pages/admin/FinishBookAdmin';
import BookingSettingsAdmin from './pages/admin/BookingSettingsAdmin';
import { GenerateRegisterLink } from './pages/admin/GenerateRegisterLink';
import { CreateSystemUser } from './pages/admin/CreateSystemUser';

let router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/register/:id",
    element: <Register />
  },
  {
    path: "/associado",
    element: <Navigate to="/associado/home" replace />
  },
  {
    path: "/associado/home",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <AssociateHome />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/perfil",
    element: (
      <ProtectedRoute role={"associate"}>
        <AssociateSidebarProvider>
          <AssociateSidebar />
          <AssociateSidebarTrigger />
          <AssociateProfile />
        </AssociateSidebarProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <CreateBooking />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva/:id/enviar-documentos",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <SendDocuments />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva/:id/escolher-quarto",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <GetRoom />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva/:id/finalizar-reserva",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <FinishBook />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva/:id/organizar-reserva",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <BookingSettings />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/solicitacao/:id",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <BookingDetails />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/sorteio/:id/participar",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <CreateDrawApply />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/sorteio/:id/enviar-documentos",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <SendDocumentsDraw />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/sorteio/:id/finalizar-inscricao",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <FinishApplyDraw />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/acompanhantes/dependentes",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <ListDependents />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/acompanhantes/convidados",
    element: (
      <ProtectedRoute role={"associate"}>
        <SocketProvider>
          <AssociateSidebarProvider>
            <BookingProvider>
              <AssociateSidebar />
              <AssociateSidebarTrigger />
              <ListGuests />
            </BookingProvider>
          </AssociateSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: <Navigate to="/admin/home" replace />
  },
  {
    path: "/admin/associados/gerar-link",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <AdminSidebar />
            <AdminSidebarTrigger />
            <GenerateRegisterLink />
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/home",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <AdminSidebar />
            <AdminSidebarTrigger />
            <AdminHome />
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/solicitacao/:id",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <AdminBookingDetails />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/aprovar-documentacao/:id",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <ApproveDocuments />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/sorteio/aprovar-documentacao/:id",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <ApproveDocumentsDraw />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/enviar-aprovacao/:id",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <ApprovePage />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/enviar-recusa/:id",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <RefusePage />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/sorteio/enviar-aprovacao/:id",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <ApprovePageDraw />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/sorteio/enviar-recusa/:id",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <RefusePageDraw />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/sistema/configuracoes",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <Settings />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/sorteios",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <DrawSettings />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/sorteios/inscritos",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <RaffleWithParticipants />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/sorteios/run",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <Run />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/sorteio/inscricao/:id",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <AdminDrawDetails />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/calendario",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <CalendarMode />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/criar-reserva",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AssociateProvider>
                <AdminSidebar />
                <AdminSidebarTrigger />
                <CreateBookingAdmin />
              </AssociateProvider>
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/criar-reserva/:id/enviar-documentos",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AssociateProvider>
                <AdminSidebar />
                <AdminSidebarTrigger />
                <SendDocumentsAdmin />
              </AssociateProvider>
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/criar-reserva/:id/escolher-quarto",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AssociateProvider>
                <AdminSidebar />
                <AdminSidebarTrigger />
                <GetRoomAdmin />
              </AssociateProvider>
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/criar-reserva/:id/finalizar-reserva",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AssociateProvider>
                <AdminSidebar />
                <AdminSidebarTrigger />
                <FinishBookAdmin />
              </AssociateProvider>
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/criar-reserva/:id/organizar-reserva",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <BookingSettingsAdmin />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/sistema/criar-usuario",
    element: (
      <ProtectedRoute role={"admin"}>
        <SocketProvider>
          <AdminSidebarProvider>
            <BookingProvider>
              <AdminSidebar />
              <AdminSidebarTrigger />
              <CreateSystemUser />
            </BookingProvider>
          </AdminSidebarProvider>
        </SocketProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />
  }
])

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)

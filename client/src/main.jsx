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
import ApprovePage from './pages/admin/ApprovePage';
import Settings from './pages/admin/Settings';
import { DrawSettings } from './pages/admin/DrawSettings';

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
        <AssociateSidebarProvider>
          <BookingProvider>
            <AssociateSidebar />
            <AssociateSidebarTrigger />
            <AssociateHome />
          </BookingProvider>
        </AssociateSidebarProvider>
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
        <AssociateSidebarProvider>
          <BookingProvider>
            <AssociateSidebar />
            <AssociateSidebarTrigger />
            <CreateBooking />
          </BookingProvider>
        </AssociateSidebarProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva/:id/enviar-documentos",
    element: (
      <ProtectedRoute role={"associate"}>
        <AssociateSidebarProvider>
          <BookingProvider>
            <AssociateSidebar />
            <AssociateSidebarTrigger />
            <SendDocuments />
          </BookingProvider>
        </AssociateSidebarProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva/:id/escolher-quarto",
    element: (
      <ProtectedRoute role={"associate"}>
        <AssociateSidebarProvider>
          <BookingProvider>
            <AssociateSidebar />
            <AssociateSidebarTrigger />
            <GetRoom />
          </BookingProvider>
        </AssociateSidebarProvider>
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
        <AssociateSidebarProvider>
          <BookingProvider>
            <AssociateSidebar />
            <AssociateSidebarTrigger />
            <BookingSettings />
          </BookingProvider>
        </AssociateSidebarProvider>
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
    path: "/admin",
    element: <Navigate to="/admin/home" replace />
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
    path: "/admin/config",
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
    path: "/unauthorized",
    element: <Unauthorized />
  }
])

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)

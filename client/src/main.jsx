import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router";
import { AuthProvider } from './hooks/useAuth';
import { BookingProvider } from './hooks/useBooking';
import { Toaster } from './components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';

import { SidebarProvider as AssociateSidebarProvider, SidebarTrigger as AssociateSidebarTrigger } from './components/ui/sidebar';
import { SidebarProvider as AdminSidebarProvider, SidebarTrigger as AdminSidebarTrigger } from './components/ui/admin/sidebar';

import { AppSidebar as AssociateSidebar } from './components/associate/AppSidebar';
import { AppSidebar as AdminSidebar } from './components/admin/AppSidebar';
import { Home as AssociateHome } from './pages/associate/Home';
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

import "@/lib/setupPDF";
import './index.css';
import { SocketProvider } from './hooks/useSocket';

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
            <Toaster richColors />
          </BookingProvider>
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
            <Toaster richColors />
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
        <AssociateSidebarProvider>
          <BookingProvider>
            <AssociateSidebar />
            <AssociateSidebarTrigger />
            <BookingDetails />
          </BookingProvider>
        </AssociateSidebarProvider>
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
            <Toaster richColors />
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

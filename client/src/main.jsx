import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router";
import { AuthProvider } from './hooks/useAuth';

import { Home as AssociateHome } from './pages/associate/Home';
import { Home as AdminHome } from './pages/admin/Home';
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import CreateBooking from './pages/associate/CreateBooking';
import App from './App';
import SendDocuments from './pages/associate/SendDocuments';
import { BookingProvider } from './hooks/useBooking';
import { Toaster } from './components/ui/sonner';
import { AppSidebar } from './components/associate/AppSidebar';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import "@/lib/setupPDF";
import GetRoom from './pages/associate/GetRoom';
import BookingDetails from './pages/associate/BookingDetails';
import FinishBook from './pages/associate/FinishBook';

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
    element: <Navigate to="/associado/home" replace/>
  },
  {
    path: "/associado/home",
    element: (
      <ProtectedRoute role={"associate"}>
        <SidebarProvider>
          <BookingProvider>
            <AppSidebar />
            <SidebarTrigger />
            <AssociateHome />
            <Toaster />
          </BookingProvider>
        </SidebarProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva",
    element: (
      <ProtectedRoute role={"associate"}>
        <SidebarProvider>
          <BookingProvider>
            <AppSidebar />
            <SidebarTrigger />
            <CreateBooking />
          </BookingProvider>
        </SidebarProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva/:id/enviar-documentos",
    element: (
      <ProtectedRoute role={"associate"}>
        <SidebarProvider>
          <BookingProvider>
            <AppSidebar />
            <SidebarTrigger />
            <SendDocuments />
          </BookingProvider>
        </SidebarProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva/:id/escolher-quarto",
    element: (
      <ProtectedRoute role={"associate"}>
        <SidebarProvider>
          <BookingProvider>
            <AppSidebar />
            <SidebarTrigger />
            <GetRoom />
          </BookingProvider>
        </SidebarProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/criar-reserva/:id/finalizar-reserva",
    element: (
      <ProtectedRoute role={"associate"}>
        <SidebarProvider>
          <BookingProvider>
            <AppSidebar />
            <SidebarTrigger />
            <FinishBook />
          </BookingProvider>
        </SidebarProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/associado/solicitacao/:id",
    element: (
      <ProtectedRoute role={"associate"}>
        <SidebarProvider>
          <BookingProvider>
            <AppSidebar />
            <SidebarTrigger />
            <BookingDetails />
          </BookingProvider>
        </SidebarProvider>
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/home",
    element: (
      <ProtectedRoute role={"admin"}>
        <AdminHome />
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

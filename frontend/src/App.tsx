import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadoutList from "./pages/LoadoutList";
import LoadoutForm from "./pages/LoadoutForm";
import ConfirmDelete from "./pages/ConfirmDelete";
import TransactionUpdate from "./pages/TransactionUpdate";
import TransactionSuccess from "./pages/TransactionSuccess";
import TransactionFail from "./pages/TransactionFail";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/loadout/new" element={<LoadoutForm />} />
          <Route path="/loadout/:id/edit" element={<LoadoutForm />} />
          <Route path="/loadout/:id/delete" element={<ConfirmDelete />} />
          <Route path="/loadout/:id/transaction" element={<TransactionUpdate />} />
          <Route path="/transaction/success" element={<TransactionSuccess />} />
          <Route path="/transaction/fail" element={<TransactionFail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/success" element={<RegisterSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

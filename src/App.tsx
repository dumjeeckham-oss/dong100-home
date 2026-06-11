'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./views/Index.tsx";
import NotFound from "./views/NotFound.tsx";
import StudioPage from "./views/StudioPage.tsx";
import NoticePage from "./views/NoticePage.tsx";
import NoticeDetailPage from "./views/NoticeDetailPage.tsx";
import ArchivePage from "./views/ArchivePage.tsx";
import ArchiveDetailPage from "./views/ArchiveDetailPage.tsx";
import UserArchivePage from "./views/UserArchivePage.tsx";
import UserArchiveDetailPage from "./views/UserArchiveDetailPage.tsx";
import FAQPage from "./views/FAQPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice/:id" element={<NoticeDetailPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/archive/:id" element={<ArchiveDetailPage />} />
          <Route path="/user-archive" element={<UserArchivePage />} />
          <Route path="/user-archive/:id" element={<UserArchiveDetailPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/studio/*" element={<StudioPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

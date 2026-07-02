import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import SearchPage from "@/pages/SearchPage";
import ReportPage from "@/pages/ReportPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/report/:reportId" element={<ReportPage />} />
        <Route path="*" element={<SearchPage />} />
      </Routes>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

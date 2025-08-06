// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/RequireAuth";
import SidebarLayout from "./layout/SidebarLayout";

// Pagine
import Home from "./pages/Home";
import Movimenti from "./pages/Movimenti";
import Categoria from "./pages/Categoria";
import Sottocategoria from "./pages/Sottocategoria";
import Reports from "./pages/Reports";
import Risorse from "./pages/Risorse";
import Import from "./pages/Import";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth><SidebarLayout /></RequireAuth>}>
            <Route path="/" element={<Home />} />
            <Route path="/movimenti" element={<Movimenti />} />
            <Route path="/categoria" element={<Categoria />} />
            <Route path="/sottocategoria" element={<Sottocategoria />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/risorse" element={<Risorse />} />
            <Route path="/import" element={<Import />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
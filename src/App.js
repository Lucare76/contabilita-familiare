import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth context
import { AuthProvider } from "./contexts/AuthContext";

// Layout con sidebar
import SidebarLayout from "./layout/SidebarLayout";

// Pagine
import Home from "./pages/Home";
import Movimenti from "./pages/Movimenti";
import Categoria from "./pages/Categoria";
import Reports from "./pages/Reports";
import Risorse from "./pages/Risorse";
import ImportPage from "./pages/Import";
import Login from "./pages/Login";

// Rotte private
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Pagina di login accessibile liberamente */}
          <Route path="/login" element={<Login />} />

          {/* Tutto il resto è protetto e dentro il layout */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <SidebarLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<Home />} />
            <Route path="movimenti" element={<Movimenti />} />
            <Route path="categoria" element={<Categoria />} />
            <Route path="reports" element={<Reports />} />
            <Route path="risorse" element={<Risorse />} />
            <Route path="import" element={<ImportPage />} />
          </Route>

          {/* Rotta fallback */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


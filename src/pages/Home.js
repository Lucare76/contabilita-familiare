import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { isAdmin } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Benvenuto nella tua contabilità</h1>
      
      {isAdmin && (
        <div className="bg-yellow-100 p-4 rounded mb-6">
          <h2 className="font-bold">Sei l'amministratore</h2>
          <p>Puoi gestire tutti gli utenti.</p>
        </div>
      )}
      
      {/* Contenuto per tutti gli utenti */}
    </div>
  );
}

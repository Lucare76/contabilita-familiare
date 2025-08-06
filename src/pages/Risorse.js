// src/pages/Risorse.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Risorse() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("conto-corrente");
  const [saldoIniziale, setSaldoIniziale] = useState("");
  const [risorse, setRisorse] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState("");

  // 🔐 Autenticazione
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔁 Carica risorse dell’utente
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "risorse"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setRisorse(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setLoading(false);
      },
      (error) => {
        console.error("Errore nel caricamento risorse:", error);
        setErrore("Impossibile caricare le risorse.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore("");

    if (!nome.trim()) {
      setErrore("Il nome della risorsa è obbligatorio.");
      return;
    }
    if (!saldoIniziale || isNaN(saldoIniziale) || parseFloat(saldoIniziale) < 0) {
      setErrore("Inserisci un saldo iniziale valido.");
      return;
    }

    try {
      await addDoc(collection(db, "risorse"), {
        nome: nome.trim(),
        tipo,
        saldoIniziale: parseFloat(saldoIniziale),
        userId: user.uid,
        createdAt: new Date().toISOString().split("T")[0],
      });

      setNome("");
      setSaldoIniziale("");
      // Il nuovo documento verrà caricato automaticamente da onSnapshot
    } catch (err) {
      console.error("Errore salvataggio risorsa:", err);
      setErrore("Errore durante il salvataggio.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa risorsa?")) return;
    try {
      await deleteDoc(doc(db, "risorse", id));
    } catch (err) {
      console.error("Errore eliminazione:", err);
      setErrore("Errore durante l'eliminazione.");
    }
  };

  if (!user) {
    return <p className="p-6">Accedi per gestire le tue risorse.</p>;
  }

  if (loading) {
    return <p className="p-6">Caricamento risorse...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Gestisci Risorse</h2>
      <p className="text-gray-600 mb-6">
        Aggiungi i tuoi conti, portafogli o carte per tenere traccia del tuo denaro.
      </p>

      {/* Form aggiunta */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Aggiungi Risorsa</h3>

        {errore && <p className="text-red-500 text-sm mb-4">{errore}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="es. Conto Poste, Contante, PayPal"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="conto-corrente">Conto Corrente</option>
              <option value="contante">Contante</option>
              <option value="carta-di-credito">Carta di Credito</option>
              <option value="carta-prepagata">Carta Prepagata</option>
              <option value="libretto">Libretto Bancario</option>
              <option value="altro">Altro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Saldo Iniziale (€) *</label>
            <input
              type="number"
              step="0.01"
              value={saldoIniziale}
              onChange={(e) => setSaldoIniziale(e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded px-3 py-2"
              min="0"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            ➕ Aggiungi Risorsa
          </button>
        </div>
      </form>

      {/* Lista risorse */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Risorse Attive</h3>

        {risorse.length === 0 ? (
          <p className="text-gray-500">Nessuna risorsa aggiunta.</p>
        ) : (
          <ul className="space-y-2">
            {risorse.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50"
              >
                <div>
                  <strong>{r.nome}</strong> — {formatTipo(r.tipo)}{" "}
                  <span className="text-gray-600">
                    (Saldo iniziale: {r.saldoIniziale.toFixed(2)}€)
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ❌ Rimuovi
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Funzione per tradurre il tipo in una label leggibile
function formatTipo(tipo) {
  const map = {
    "conto-corrente": "Conto Corrente",
    "contante": "Contante",
    "carta-di-credito": "Carta di Credito",
    "carta-prepagata": "Carta Prepagata",
    "libretto": "Libretto Bancario",
    "altro": "Altro",
  };
  return map[tipo] || tipo;
}

export default Risorse;
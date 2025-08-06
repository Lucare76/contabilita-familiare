import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function Movimenti() {
  const [tipo, setTipo] = useState("entrata");
  const [importo, setImporto] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contoOrigine, setContoOrigine] = useState("");
  const [contoDestinazione, setContoDestinazione] = useState("");
  const [dataMovimento, setDataMovimento] = useState(new Date().toISOString().split("T")[0]); // YYYY-MM-DD
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore("");
    setLoading(true);

    // Validazione
    if (!importo || isNaN(importo) || parseFloat(importo) <= 0) {
      setErrore("Inserisci un importo valido.");
      setLoading(false);
      return;
    }
    if (!categoria.trim()) {
      setErrore("La categoria è obbligatoria.");
      setLoading(false);
      return;
    }
    if (!contoOrigine.trim()) {
      setErrore("Il conto di origine è obbligatorio.");
      setLoading(false);
      return;
    }
    if (tipo === "giroconto" && !contoDestinazione.trim()) {
      setErrore("Il conto destinazione è obbligatorio per i giroconti.");
      setLoading(false);
      return;
    }

    try {
      // Oggetto movimento
      let movimento = {
        tipo,
        importo: parseFloat(importo),
        categoria: categoria.trim(),
        descrizione: descrizione.trim() || null,
        dataMovimento: Timestamp.fromDate(new Date(dataMovimento)), // ✅ Data corretta
        createdAt: Timestamp.now(), // Quando è stato registrato
      };

      // Campi in base al tipo
      if (tipo === "giroconto") {
        movimento.contoOrigine = contoOrigine;
        movimento.contoDestinazione = contoDestinazione;
      } else {
        movimento.conto = contoOrigine;
      }

      // Salvataggio su Firestore
      await addDoc(collection(db, "movimenti"), movimento);

      alert("✅ Movimento registrato con successo!");
      
      // Reset form
      setImporto("");
      setDescrizione("");
      setCategoria("");
      setContoOrigine("");
      setContoDestinazione("");
      setDataMovimento(new Date().toISOString().split("T")[0]);
      setTipo("entrata");
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      setErrore("Errore: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Registra un Movimento</h2>

      {errore && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errore}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        {/* Tipo */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="entrata">Entrata</option>
            <option value="uscita">Uscita</option>
            <option value="giroconto">Giroconto</option>
          </select>
        </div>

        {/* Importo */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Importo (€)</label>
          <input
            type="number"
            step="0.01"
            value={importo}
            onChange={(e) => setImporto(e.target.value)}
            placeholder="0.00"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Categoria */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Categoria</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="es. Alimentari, Bollette, Stipendio"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* 🔴 DATA DEL MOVIMENTO */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Data del movimento</label>
          <input
            type="date"
            value={dataMovimento}
            onChange={(e) => setDataMovimento(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Descrizione */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Descrizione (opzionale)</label>
          <input
            type="text"
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            placeholder="Dettagli aggiuntivi..."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Conto origine */}
        <div className="mb-4">
          <label className="block font-medium mb-1">
            {tipo === "giroconto" ? "Conto origine" : "Conto"}
          </label>
          <input
            type="text"
            value={contoOrigine}
            onChange={(e) => setContoOrigine(e.target.value)}
            placeholder="es. Conto corrente, Contante"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Conto destinazione (solo giroconto) */}
        {tipo === "giroconto" && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Conto destinazione</label>
            <input
              type="text"
              value={contoDestinazione}
              onChange={(e) => setContoDestinazione(e.target.value)}
              placeholder="es. Contante, Libretto"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition w-full"
        >
          {loading ? "Salvataggio..." : "📌 Salva Movimento"}
        </button>
      </form>
    </div>
  );
}
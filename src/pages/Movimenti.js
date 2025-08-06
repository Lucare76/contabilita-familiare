// src/pages/Movimenti.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { query, where, onSnapshot } from "firebase/firestore";

export default function Movimenti() {
  const [tipo, setTipo] = useState("uscita");
  const [importo, setImporto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [risorsa, setRisorsa] = useState("");
  const [contatto, setContatto] = useState("");
  const [notaSpesa, setNotaSpesa] = useState("");
  const [tags, setTags] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [noteInterne, setNoteInterne] = useState("");
  const [dataMovimento, setDataMovimento] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");

  const [categorie, setCategorie] = useState([]);
  const [loadingCategorie, setLoadingCategorie] = useState(true);
  const [movimenti, setMovimenti] = useState([]);
  const [loadingMovimenti, setLoadingMovimenti] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "categories"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().name,
        sottocategorie: doc.data().subcategories || [],
      }));
      setCategorie(lista);
      setLoadingCategorie(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "movimenti"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.dataMovimento.seconds - a.dataMovimento.seconds);
      setMovimenti(lista);
      setLoadingMovimenti(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore("");
    setLoading(true);

    if (!importo || parseFloat(importo) <= 0) {
      setErrore("Importo non valido.");
      setLoading(false);
      return;
    }
    if (!categoria) {
      setErrore("Seleziona una sottocategoria.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "movimenti"), {
        tipo,
        importo: parseFloat(importo),
        categoria,
        risorsa,
        contatto,
        notaSpesa,
        tags: tags ? tags.split(",").map(t => t.trim()) : [],
        descrizione: descrizione.trim() || null,
        noteInterne: noteInterne.trim() || null,
        dataMovimento: Timestamp.fromDate(new Date(dataMovimento)),
        userId: user.uid,
      });
      alert("✅ Movimento salvato!");
      resetForm();
    } catch (error) {
      setErrore("Errore: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImporto("");
    setCategoria("");
    setRisorsa("");
    setContatto("");
    setNotaSpesa("");
    setTags("");
    setDescrizione("");
    setNoteInterne("");
    setDataMovimento(new Date().toISOString().split("T")[0]);
    setTipo("uscita");
  };

  const risorseDisponibili = [
    "Aurora Piano di Accumulo",
    "Bancoposta",
    "Bet365",
    "Betfair",
    "Binance",
    "Buoni Fruttiferi",
    "Buoni Nuovi",
    "Buoni Postali",
    "Bwin M",
    "Carta di Credito",
    "Contanti",
    "Crypto.com",
    "Edenred",
    "Eurobet",
    "Goldbet M",
    "Goldbet Z",
    "Libretto Postale",
    "Lottomatica",
    "Marathon",
    "MoneyFarm",
    "Paypal",
    "Planet365",
    "PostaPrevidenza Valore",
    "Poste Progetti Futuri",
    "Postepay",
    "Sisal",
    "Snai",
    "Sportium"
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">📌 Nuovo Movimento</h2>
      <p className="text-center text-gray-600 mb-8">Compila i campi per registrare un nuovo movimento</p>

      {errore && (
        <div className="bg-red-50 border-l-6 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
          <strong>Errore:</strong> {errore}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dati principali */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-200">📊 Dati Principali</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              >
                <option value="entrata">🟢 Entrata</option>
                <option value="uscita">🔴 Uscita</option>
                <option value="giroconto">🔄 Giroconto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Importo (€)</label>
              <input
                type="number"
                step="0.01"
                value={importo}
                onChange={(e) => setImporto(e.target.value)}
                placeholder="100.00"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 text-lg font-semibold transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              {loadingCategorie ? (
                <p className="text-sm text-gray-500">Caricamento...</p>
              ) : (
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition"
                  required
                >
                  <option value="">Seleziona una sottocategoria</option>
                  {categorie.map((cat) => (
                    <optgroup key={cat.id} label={cat.nome}>
                      {cat.sottocategorie.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
              <input
                type="date"
                value={dataMovimento}
                onChange={(e) => setDataMovimento(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Risorsa e contatto */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-200">🔗 Risorsa & Contatto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risorsa</label>
              <select
                value={risorsa}
                onChange={(e) => setRisorsa(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition"
              >
                <option value="">Seleziona una risorsa</option>
                {risorseDisponibili.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contatto</label>
              <input
                type="text"
                value={contatto}
                onChange={(e) => setContatto(e.target.value)}
                placeholder="Amazon, Supermercato"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nota spesa</label>
              <select
                value={notaSpesa}
                onChange={(e) => setNotaSpesa(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition"
              >
                <option value="">Nessuna</option>
                <option value="spesa-alimentare">Spesa alimentare</option>
                <option value="farmacia">Farmacia</option>
                <option value="benzina">Benzina</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="es. urgent, neonato"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Descrizione e note */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-200">📝 Descrizione & Note</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
              <input
                type="text"
                value={descrizione}
                onChange={(e) => setDescrizione(e.target.value)}
                placeholder="Descrizione breve"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note Interne</label>
              <textarea
                value={noteInterne}
                onChange={(e) => setNoteInterne(e.target.value)}
                placeholder="Note private"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-500 transition"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition w-full md:w-auto"
          >
            {loading ? "⏳ Salvataggio..." : "✅ Salva Movimento"}
          </button>
        </div>
      </form>

      {/* Tabella movimenti */}
      <div className="mt-12 bg-white p-8 rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">📋 Movimenti Registrati</h3>
        {loadingMovimenti ? (
          <p className="text-gray-500">Caricamento...</p>
        ) : movimenti.length === 0 ? (
          <p className="text-gray-500">Nessun movimento.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">Data</th>
                  <th className="px-6 py-4 text-left">Tipo</th>
                  <th className="px-6 py-4 text-left">Categoria</th>
                  <th className="px-6 py-4 text-left">Importo</th>
                  <th className="px-6 py-4 text-left">Risorsa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movimenti.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{m.dataMovimento.toDate().toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        m.tipo === "entrata" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {m.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{m.categoria}</td>
                    <td className="px-6 py-4 font-semibold">{m.importo.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-gray-600">{m.risorsa || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
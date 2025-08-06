// src/pages/ModificaCategoria.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ModificaCategoria() {
  const [categorie, setCategorie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSelezionata, setCategoriaSelezionata] = useState("");
  const [nuovaSottocategoria, setNuovaSottocategoria] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  // 🔁 Carica tutte le categorie dell'utente
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "categories"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorie(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Ottieni i dati di una categoria specifica
  const getCategoria = async (id) => {
    try {
      const docRef = doc(db, "categories", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  // ✅ Aggiungi una sottocategoria a una categoria esistente
  const aggiungiSottocategoria = async () => {
    if (!categoriaSelezionata || !nuovaSottocategoria.trim()) return;

    const categoria = categories.find((c) => c.id === categoriaSelezionata);
    const nuovaLista = [...categoria.subcategories, nuovaSottocategoria.trim()];

    try {
      await updateDoc(doc(db, "categories", categoriaSelezionata), {
        subcategories: nuovaLista,
      });
      alert(`✅ "${nuovaSottocategoria}" aggiunta a "${categoria.name}"`);
      setNuovaSottocategoria("");
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Modifica Categoria</h2>

      {loading ? (
        <p>Caricamento categorie...</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          {/* Seleziona categoria */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Seleziona una categoria</label>
            <select
              value={categoriaSelezionata}
              onChange={(e) => setCategoriaSelezionata(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Seleziona una categoria</option>
              {categorie.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Form per modificare la categoria selezionata */}
          {categoriaSelezionata && (
            <div>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Es. Aurora"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <div className="flex space-x-4">
                <label><input type="radio" value="entrata" checked={tipologia === "entrata"} onChange={() => setTipologia("entrata")} className="mr-1" /> Entrata</label>
                <label><input type="radio" value="uscita" checked={tipologia === "uscita"} onChange={() => setTipologia("uscita")} className="mr-1" /> Uscita</label>
                <label><input type="radio" value="entrate_uscite" checked={tipologia === "entrate_uscite"} onChange={() => setTipologia("entrate_uscite")} className="mr-1" /> Entrata/Uscita</label>
              </div>
            </div>
          )}

          {/* Sottocategorie */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Sottocategorie</label>
            <div className="flex items-center">
              <input
                type="text"
                value={nuovaSottocategoria}
                onChange={(e) => setNuovaSottocategoria(e.target.value)}
                placeholder="Aggiungi una sottocategoria"
                className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2"
              />
              <button
                onClick={() => {
                  if (nuovaSottocategoria.trim()) {
                    aggiungiSottocategoria(categoriaSelezionata, nuovaSottocategoria);
                    setNuovaSottocategoria("");
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ➕
              </button>
            </div>
            {sottocategorie.length > 0 && (
              <ul className="list-disc pl-5 mt-2">
                {sottocategorie.map((sub, i) => (
                  <li key={i} className="text-gray-700">{sub}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Conferma
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
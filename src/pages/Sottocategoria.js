// src/pages/Sottocategoria.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Sottocategoria() {
  const [categorie, setCategorie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaId, setCategoriaId] = useState("");
  const [nuovaSottocategoria, setNuovaSottocategoria] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "categories"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        subcategories: doc.data().subcategories || [],
      }));
      setCategorie(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const aggiungi = async () => {
    if (!categoriaId || !nuovaSottocategoria.trim()) return;

    const categoria = categorie.find(c => c.id === categoriaId);
    const nuovaLista = [...categoria.subcategories, nuovaSottocategoria.trim()];

    try {
      await updateDoc(doc(db, "categories", categoriaId), {
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
      <h2 className="text-2xl font-bold mb-6">Aggiungi Sottocategoria</h2>

      {loading ? (
        <p>Caricamento categorie...</p>
      ) : categorie.length === 0 ? (
        <p className="text-red-500">Nessuna categoria. Vai in 'Categorie' per crearne una.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block font-medium mb-1">Scegli una categoria</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Seleziona...</option>
              {categorie.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Nuova sottocategoria</label>
            <input
              type="text"
              value={nuovaSottocategoria}
              onChange={(e) => setNuovaSottocategoria(e.target.value)}
              placeholder="Es. pannolini"
              className="w-full border border-gray-300 rounded px-3 py-2"
              onKeyDown={(e) => e.key === "Enter" && aggiungi()}
            />
          </div>

          <button
            onClick={aggiungi}
            disabled={!categoriaId || !nuovaSottocategoria.trim()}
            className="bg-green-600 text-white px-6 py-2 rounded w-full disabled:bg-gray-400"
          >
            ➕ Aggiungi Sottocategoria
          </button>

          {categoriaId && (
            <div className="mt-6">
              <h3 className="font-medium">Sottocategorie:</h3>
              <ul className="mt-2 list-disc pl-5">
                {categorie
                  .find(c => c.id === categoriaId)
                  ?.subcategories.map((sub, i) => (
                    <li key={i} className="text-gray-700">{sub}</li>
                  ))
                }
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
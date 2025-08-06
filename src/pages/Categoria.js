// src/pages/Categoria.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Categoria() {
  const [nome, setNome] = useState("");
  const [tipologia, setTipologia] = useState("uscita");
  const [nuovaSottocategoria, setNuovaSottocategoria] = useState("");

  const [categorie, setCategorie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSelezionata, setCategoriaSelezionata] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  // 🔁 Carica tutte le categorie in tempo reale
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

  // ✅ Crea una nuova categoria
  const creaCategoria = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    try {
      await addDoc(collection(db, "categories"), {
        name: nome,
        tipologia,
        subcategories: [],
        userId: user.uid,
      });
      setNome("");
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  // ✅ Aggiungi sottocategoria a una categoria esistente
  const aggiungiSottocategoria = async () => {
    if (!categoriaSelezionata || !nuovaSottocategoria.trim()) return;

    const categoria = categorie.find((c) => c.id === categoriaSelezionata);
    const nuovaLista = [...categoria.subcategories, nuovaSottocategoria.trim()];

    try {
      await updateDoc(doc(db, "categories", categoriaSelezionata), {
        subcategories: nuovaLista,
      });
      setNuovaSottocategoria("");
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  // ✅ Rimuovi sottocategoria
  const rimuoviSottocategoria = async (index) => {
    const categoria = categorie.find((c) => c.id === categoriaSelezionata);
    const nuovaLista = [...categoria.subcategories];
    nuovaLista.splice(index, 1);

    try {
      await updateDoc(doc(db, "categories", categoriaSelezionata), {
        subcategories: nuovaLista,
      });
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  // ✅ Rimuovi categoria
  const rimuoviCategoria = async (id) => {
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  // ✅ Dati della categoria selezionata
  const categoriaAttuale = categorie.find((c) => c.id === categoriaSelezionata);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">🗂️ Gestisci Categorie</h2>
      <p className="text-center text-gray-600 mb-8">Crea, modifica e organizza le tue categorie</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Crea nuova categoria */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-200">
            ➕ Crea Nuova Categoria
          </h3>
          <form onSubmit={creaCategoria} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Categoria</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Es. Aurora"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipologia</label>
              <select
                value={tipologia}
                onChange={(e) => setTipologia(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition"
              >
                <option value="entrata">🟢 Entrata</option>
                <option value="uscita">🔴 Uscita</option>
                <option value="entrate_uscite">🟢/🔴 Entrata/Uscita</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition"
            >
              ✅ Crea Categoria
            </button>
          </form>
        </div>

        {/* Modifica categoria esistente */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-200">
            🔧 Modifica Categoria Esistente
          </h3>

          {loading ? (
            <p className="text-gray-500">Caricamento...</p>
          ) : categorie.length === 0 ? (
            <p className="text-gray-500">Nessuna categoria disponibile.</p>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Seleziona una categoria</label>
                <select
                  value={categoriaSelezionata}
                  onChange={(e) => setCategoriaSelezionata(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition"
                >
                  <option value="">Scegli una categoria</option>
                  {categorie.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.tipologia})
                    </option>
                  ))}
                </select>
              </div>

              {categoriaAttuale && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      value={categoriaAttuale.name}
                      readOnly
                      className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipologia</label>
                    <input
                      type="text"
                      value={categoriaAttuale.tipologia}
                      readOnly
                      className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800"
                    />
                  </div>

                  {/* Aggiungi sottocategoria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aggiungi Sottocategoria</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={nuovaSottocategoria}
                        onChange={(e) => setNuovaSottocategoria(e.target.value)}
                        placeholder="Nuova sottocategoria"
                        className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        onKeyDown={(e) => e.key === "Enter" && aggiungiSottocategoria()}
                      />
                      <button
                        onClick={aggiungiSottocategoria}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-r-lg transition"
                      >
                        ➕
                      </button>
                    </div>
                  </div>

                  {/* Lista sottocategorie */}
                  {categoriaAttuale.subcategories.length > 0 ? (
                    <ul className="space-y-2 mt-4">
                      {categoriaAttuale.subcategories.map((sub, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg text-gray-800"
                        >
                          <span>{sub}</span>
                          <button
                            onClick={() => rimuoviSottocategoria(i)}
                            className="text-red-500 hover:text-red-700 font-bold text-lg"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm mt-4">Nessuna sottocategoria</p>
                  )}

                  {/* Rimuovi categoria */}
                  <div className="mt-6">
                    <button
                      onClick={() => rimuoviCategoria(categoriaAttuale.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                    >
                      ❌ Rimuovi Categoria
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Visualizzazione globale */}
      <div className="mt-12 bg-white p-8 rounded-2xl shadow-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">📋 Tutte le Categorie</h3>
        {loading ? (
          <p>Caricamento...</p>
        ) : categorie.length === 0 ? (
          <p className="text-gray-500">Nessuna categoria.</p>
        ) : (
          <div className="space-y-4">
            {categorie.map((cat) => (
              <div
                key={cat.id}
                className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{cat.name}</h4>
                    <p className="text-sm text-gray-600">({cat.tipologia})</p>
                  </div>
                  <button
                    onClick={() => rimuoviCategoria(cat.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    ❌
                  </button>
                </div>
                <div className="mt-3">
                  <ul className="flex flex-wrap gap-2">
                    {cat.subcategories.map((sub, i) => (
                      <li
                        key={i}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
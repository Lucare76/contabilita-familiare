// src/pages/Categorie.js
import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Categorie() {
  const [nome, setNome] = useState("");
  const [tipologia, setTipologia] = useState("uscita"); // Default: Uscita
  const [sottocategorie, setSottocategorie] = useState([]);
  const [nuovaSottocategoria, setNuovaSottocategoria] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    try {
      await addDoc(collection(db, "categories"), {
        name: nome,
        subcategories: sottocategorie,
        tipologia: tipologia,
        userId: user.uid,
      });

      alert("Categoria salvata con successo!");
      setNome("");
      setSottocategorie([]);
      setNuovaSottocategoria("");
    } catch (error) {
      console.error("Errore nel salvataggio della categoria:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Gestisci Categorie</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        {/* Nome della categoria */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Nome della categoria</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Es. Alimentari"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Tipologia */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Tipologia</label>
          <div className="flex space-x-4">
            <div>
              <input
                type="radio"
                id="entrata"
                name="tipologia"
                value="entrata"
                checked={tipologia === "entrata"}
                onChange={() => setTipologia("entrata")}
                className="mr-2"
              />
              <label htmlFor="entrata">Entrata</label>
            </div>
            <div>
              <input
                type="radio"
                id="uscita"
                name="tipologia"
                value="uscita"
                checked={tipologia === "uscita"}
                onChange={() => setTipologia("uscita")}
                className="mr-2"
              />
              <label htmlFor="uscita">Uscita</label>
            </div>
            <div>
              <input
                type="radio"
                id="entrate_uscite"
                name="tipologia"
                value="entrate_uscite"
                checked={tipologia === "entrate_uscite"}
                onChange={() => setTipologia("entrate_uscite")}
                className="mr-2"
              />
              <label htmlFor="entrate_uscite">Entrata/Uscita</label>
            </div>
          </div>
        </div>

        {/* Sottocategorie */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Sottocategorie</label>
          <div>
            <input
              type="text"
              value={nuovaSottocategoria}
              onChange={(e) => setNuovaSottocategoria(e.target.value)}
              placeholder="Aggiungi una sottocategoria..."
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            />
            <button
              type="button"
              onClick={() => {
                if (nuovaSottocategoria.trim()) {
                  setSottocategorie([...sottocategorie, nuovaSottocategoria]);
                  setNuovaSottocategoria("");
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
            >
              Aggiungi
            </button>
          </div>
          <ul className="mt-2">
            {sottocategorie.map((sottocategoria, index) => (
              <li key={index} className="flex items-center justify-between mt-2">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mr-2"
                />
                <span>{sottocategoria}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newSottocategorie = [...sottocategorie];
                    newSottocategorie.splice(index, 1);
                    setSottocategorie(newSottocategorie);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Salva Categoria
        </button>
      </form>
    </div>
  );
}
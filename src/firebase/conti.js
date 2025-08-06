import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

const Conti = () => {
  const [nome, setNome] = useState("");
  const [conti, setConti] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "conti"), (snapshot) => {
      setConti(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nome.trim()) {
      await addDoc(collection(db, "conti"), {
        nome,
      });
      setNome("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Aggiungi Conto</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Nome del conto (es. Contanti, Carta, Banca)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Aggiungi
        </button>
      </form>

      <h3 className="mt-6 text-lg font-semibold">Conti Esistenti</h3>
      <ul className="mt-2">
        {conti.map((conto) => (
          <li key={conto.id}>{conto.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default Conti;
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Categoria() {
  const { user } = useAuth(); // ✅ CORRETTO

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [subcategories, setSubcategories] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'categories'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cats = [];
      querySnapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() });
      });
      setCategories(cats);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory || !user) return;

    await addDoc(collection(db, 'categories'), {
      userId: user.uid,
      name: newCategory,
      subcategories: subcategories
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== ''),
    });

    setNewCategory('');
    setSubcategories('');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Categorie</h1>

      <form onSubmit={handleAddCategory} className="space-y-2">
        <input
          type="text"
          placeholder="Nome categoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Sottocategorie (separate da virgola)"
          value={subcategories}
          onChange={(e) => setSubcategories(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Aggiungi categoria
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Tutte le categorie</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id} className="border rounded p-3 bg-gray-100">
              <strong>{cat.name}</strong>
              {cat.subcategories?.length > 0 && (
                <ul className="ml-4 list-disc text-sm">
                  {cat.subcategories.map((sub, i) => (
                    <li key={i}>{sub}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
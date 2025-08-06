// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setErrore("Email o password errati.");
      } else if (error.code === "auth/missing-email") {
        setErrore("Per favore inserisci l'email.");
      } else {
        setErrore("Errore: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Accedi</h2>

      {errore && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errore}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@esempio.com"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full disabled:bg-blue-400"
        >
          {loading ? "Accesso in corso..." : "Accedi"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Non hai un account? Contattami per attivare il tuo accesso.
      </p>
    </div>
  );
}
// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Definiamo le voci del menu con coerenza alle rotte
  const menuItems = [
    { path: "/", label: "🏠 Home" },
    { path: "/movimenti", label: "💰 Movimenti" },
    { path: "/categoria", label: "🏷️ Categorie" },
    { path: "/reports", label: "📊 Reports" },
    { path: "/risorse", label: "🏦 Risorse" },
    { path: "/import", label: "📥 Importa CSV" },
  ];

  return (
    <div className="w-60 bg-gray-800 text-white p-4 flex flex-col min-h-screen">
      <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">Budget App</h2>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded transition
              ${location.pathname === item.path
                ? "bg-white text-gray-800 font-medium"
                : "hover:bg-gray-700"
              }
            `}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

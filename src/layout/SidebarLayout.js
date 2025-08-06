import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const SidebarLayout = () => {
  const location = useLocation(); // Per sapere quale pagina è attiva

  // Definiamo le voci del menu
  const menuItems = [
    { path: "/", label: "🏠 Home" },
    { path: "/movimenti", label: "💰 Movimenti" },
    { path: "/categoria", label: "🏷️ Categorie" },
    { path: "/reports", label: "📊 Reports" },
    { path: "/risorse", label: "🏦 Risorse" },
    { path: "/import", label: "📥 Importa" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-blue-500">
          Budget Familiare
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded transition duration-200
                    ${location.pathname === item.path
                      ? "bg-white text-blue-600 font-medium"
                      : "hover:bg-blue-500 hover:text-white"
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;

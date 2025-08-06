import React from "react";
import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "200px", padding: "1rem", background: "#f0f0f0", height: "100vh" }}>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movimenti">Movimenti</Link></li>
            <li><Link to="/categoria">Categoria</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/risorse">Risorse</Link></li>
            <li><Link to="/import">Importa File</Link></li>
          </ul>
        </nav>
      </aside>
      <main style={{ flexGrow: 1, padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
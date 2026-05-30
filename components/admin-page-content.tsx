"use client";

import { useEffect, useState } from "react";
import { AdminLogin } from "./admin-login";
import { AdminDashboard } from "./admin-dashboard";

const TOKEN_KEY = "cla_admin_token";

function isTokenValid(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role === "admin" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AdminPageContent() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_KEY);
    if (stored && isTokenValid(stored)) {
      setToken(stored);
    }
  }, []);

  const handleLogin = (jwt: string) => {
    window.localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return (
    <main className="container" style={{ paddingTop: "24px" }}>
      <section className="card hero-card hero-banner" style={{ padding: "32px" }}>
        <div>
          <p className="hero-eyebrow">Administrace</p>
          <h1 className="hero-title">Správa AI nástrojů</h1>
          <p className="hero-copy">
            Zde mohou IT pracovníci spravovat povolené a omezené AI nástroje. Přihlaste se, abyste mohli přidávat, upravovat a mazat položky.
          </p>
        </div>
        <div>
          <a href="/" className="button secondary" style={{ marginTop: 16 }}>
            Veřejný seznam
          </a>
        </div>
      </section>
      <section style={{ marginTop: "24px" }}>
        {token ? <AdminDashboard token={token} onLogout={handleLogout} /> : <AdminLogin onSuccess={handleLogin} />}
      </section>
    </main>
  );
}

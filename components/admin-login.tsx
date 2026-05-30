"use client";

import { useState } from "react";
import type { FormEvent } from "react";
// @ts-ignore: Convex runtime export exists, but type definitions omit useActionGeneric.
import { useActionGeneric } from "convex/react";

interface AdminLoginProps {
  onSuccess: (token: string) => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const login = useActionGeneric("auth.adminLogin");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("AdminLogin submit", { login: loginValue });
      const token = await login({ login: loginValue, password });
      onSuccess(token as string);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      console.error("AdminLogin failed:", message);
      setError(message || "Nesprávné přihlašovací údaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: "28px", maxWidth: 560, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Přihlášení správce</h2>
      <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
        Přihlas se pomocí přezdívky a hesla. Neexistuje registrace ani reset hesla.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="login">Login</label>
          <input
            id="login"
            type="text"
            value={loginValue}
            onChange={(event) => setLoginValue(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Heslo</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error ? (
          <p style={{ color: "var(--danger)", marginTop: 0, marginBottom: "16px" }}>{error}</p>
        ) : null}
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Odesílám…" : "Přihlásit se"}
        </button>
      </form>
    </div>
  );
}

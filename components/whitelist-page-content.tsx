"use client";

import { useMemo, useState } from "react";
import { useQueryGeneric } from "convex/react";

const categories = [
  "Textová AI",
  "Obrazová AI",
  "Kódování",
  "Analýza dat",
  "Překlad",
  "Ostatní",
];

export function WhitelistPageContent() {
  const tools = useQueryGeneric("aiSystems.listAll");
  const loading = tools === undefined;
  const toolList = tools || [];
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Všechny");

  const filteredTools = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return toolList.filter((tool: any) => {
      const matchesCategory =
        selectedCategory === "Všechny" || tool.category === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        [tool.name, tool.provider, tool.description, tool.category]
          .filter(Boolean)
          .some((value) =>
            value.toLowerCase().includes(normalizedSearch)
          );
      return matchesCategory && matchesSearch;
    });
  }, [tools, search, selectedCategory]);

  const stats = useMemo(() => {
    const approved = toolList.filter((tool: any) => tool.status === "approved").length;
    const restricted = toolList.filter((tool: any) => tool.status === "restricted").length;
    return { approved, restricted, total: toolList.length };
  }, [toolList]);

  return (
    <main className="container">
      <section className="card hero-card hero-banner">
        <div>
          <p className="hero-eyebrow">CLA AI whitelist</p>
          <h1 className="hero-title">Povolené AI prostředky</h1>
          <p className="hero-copy">
            Seznam nástrojů, které jsou v naší firmě schválené k použití. Filtrujte podle kategorie nebo vyhledejte konkrétní řešení.
          </p>
        </div>
        <div>
          <a href="/admin" className="button secondary" style={{ marginTop: 16 }}>
            Admin panel
          </a>
        </div>
      </section>

      <section style={{ marginTop: "24px" }}>
        <div className="stats-grid">
          {[
            { label: "Povoleno", value: stats.approved },
            { label: "Omezené použití", value: stats.restricted },
            { label: "Celkem", value: stats.total },
          ].map((item) => (
            <div key={item.label} className="stat-card">
              <div style={{ color: "var(--muted)", fontSize: "0.95rem" }}>{item.label}</div>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "24px" }}>
        <div className="filter-panel card">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", alignItems: "center" }}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Hledat název, poskytovatele nebo popis"
              className="input-field"
            />
            <div className="pill-list">
              <button
                type="button"
                className={`pill-button ${selectedCategory === "Všechny" ? "active" : ""}`}
                onClick={() => setSelectedCategory("Všechny")}
              >
                Všechny
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`pill-button ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "24px" }}>
        {loading ? (
          <div className="tool-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card tool-card" style={{ padding: "24px", minHeight: "220px" }}>
                <div style={{ width: "40%", height: "22px", background: "#dbeff8", borderRadius: "12px", marginBottom: "18px" }} />
                <div style={{ width: "80%", height: "14px", background: "#dbeff8", borderRadius: "12px", marginBottom: "12px" }} />
                <div style={{ width: "100%", height: "14px", background: "#dbeff8", borderRadius: "12px", marginBottom: "8px" }} />
                <div style={{ width: "90%", height: "14px", background: "#dbeff8", borderRadius: "12px", marginTop: "16px" }} />
              </div>
            ))}
          </div>
        ) : toolList.length === 0 ? (
          <div className="card" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "1.2rem" }}>
              Seznam je zatím prázdný.
            </p>
            <p style={{ marginTop: "10px", color: "var(--muted)" }}>
              Administrátor může přidat první AI nástroj v administraci.
            </p>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="card" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "1.2rem" }}>
              Nic neodpovídá zadanému filtru.
            </p>
            <p style={{ marginTop: "10px", color: "var(--muted)" }}>
              Zkuste upravit hledaný výraz nebo vybrat jinou kategorii.
            </p>
          </div>
        ) : (
          <div className="tool-grid">
            {filteredTools.map((tool: any) => (
              <article key={tool._id} className="card tool-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <h2 style={{ margin: "0 0 8px 0", fontSize: "1.25rem" }}>{tool.name}</h2>
                    {tool.provider ? (
                      <div style={{ color: "var(--muted)", fontSize: "0.95rem" }}>{tool.provider}</div>
                    ) : null}
                  </div>
                  <span className={`badge ${tool.status === "approved" ? "status-approved" : "status-restricted"}`}>
                    {tool.status === "approved" ? "Povoleno" : "Omezené použití"}
                  </span>
                </div>
                <p
                  style={{
                    margin: "18px 0 20px 0",
                    color: "var(--muted)",
                    lineHeight: 1.65,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {tool.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span className="badge" style={{ background: "#e0f7f4", color: "#0c4f4a" }}>
                    {tool.category}
                  </span>
                  {tool.url ? (
                    <a href={tool.url} target="_blank" rel="noreferrer" className="link-pill">
                      Navštívit ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

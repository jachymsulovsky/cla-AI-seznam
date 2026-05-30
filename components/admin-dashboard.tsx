"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useMutationGeneric, useQueryGeneric } from "convex/react";

const categories = [
  "Textová AI",
  "Obrazová AI",
  "Kódování",
  "Analýza dat",
  "Překlad",
  "Ostatní",
];

const statusOptions = [
  { value: "approved", label: "Povoleno" },
  { value: "restricted", label: "Omezené použití" },
];

interface AiToolForm {
  name: string;
  provider: string;
  description: string;
  category: string;
  status: string;
  url: string;
}

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

const emptyForm: AiToolForm = {
  name: "",
  provider: "",
  description: "",
  category: "Textová AI",
  status: "approved",
  url: "",
};

export function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formState, setFormState] = useState<AiToolForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tools = useQueryGeneric("aiSystems.listAll") || [];
  const addTool = useMutationGeneric("aiSystems.add");
  const updateTool = useMutationGeneric("aiSystems.update");
  const removeTool = useMutationGeneric("aiSystems.remove");

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormState(emptyForm);
    setModalOpen(true);
    setErrorMessage(null);
  };

  const handleOpenEdit = (tool: any) => {
    setEditingId(tool._id);
    setFormState({
      name: tool.name || "",
      provider: tool.provider || "",
      description: tool.description || "",
      category: tool.category || "Textová AI",
      status: tool.status || "approved",
      url: tool.url || "",
    });
    setModalOpen(true);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!formState.name || !formState.description || !formState.category || !formState.status) {
        setErrorMessage("Vyplňte prosím všechny povinné položky.");
        return;
      }
      const payload = {
        token,
        name: formState.name,
        provider: formState.provider || undefined,
        description: formState.description,
        category: formState.category,
        status: formState.status,
        url: formState.url || undefined,
      } as any;

      if (editingId) {
        await updateTool({ id: editingId, ...payload });
      } else {
        await addTool(payload);
      }
      setModalOpen(false);
      setEditingId(null);
      setFormState(emptyForm);
      setRefreshKey((value) => value + 1);
    } catch (caught) {
      setErrorMessage("Chyba při ukládání. Zkontrolujte oprávnění a zkuste to znovu.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await removeTool({ token, id: deleteId });
      setDeleteId(null);
      setRefreshKey((value) => value + 1);
    } catch (caught) {
      setErrorMessage("Chyba při mazání položky.");
    }
  };

  const activeCount = useMemo(() => tools.length, [tools]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Správa AI nástrojů</h2>
          <p style={{ margin: "10px 0 0", color: "var(--muted)" }}>
            V tabulce níže upravte nebo smažte existující položky. Nový nástroj přidáte tlačítkem.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button type="button" className="button">
            Přidat AI nástroj
          </button>
          <button type="button" className="button secondary" onClick={onLogout}>
            Odhlásit se
          </button>
        </div>
      </div>

      <div className="card table-card" style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "18px", color: "var(--muted)" }}>
          Celkem nástrojů: {activeCount}
        </div>
        {tools.length === 0 ? (
          <p style={{ margin: 0 }}>Žádné nástroje nejsou momentálně v seznamu.</p>
        ) : (
          <div className="table-responsive">
            <table className="table-grid">
              <thead>
                <tr>
                  <th>Název</th>
                  <th>Poskytovatel</th>
                  <th>Kategorie</th>
                  <th>Stav</th>
                  <th style={{ textAlign: "center" }}>Akce</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool: any) => (
                  <tr key={tool._id}>
                    <td>{tool.name}</td>
                    <td>{tool.provider || "—"}</td>
                    <td>{tool.category}</td>
                    <td>
                      <span className={`badge ${tool.status === "approved" ? "status-approved" : "status-restricted"}`}>
                        {tool.status === "approved" ? "Povoleno" : "Omezené použití"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button type="button" className="button ghost" style={{ marginRight: "10px" }} onClick={() => handleOpenEdit(tool)}>
                        Upravit
                      </button>
                      <button type="button" className="button ghost" style={{ color: "var(--danger)" }} onClick={() => setDeleteId(tool._id)}>
                        Smazat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen ? (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 style={{ marginTop: 0 }}>{editingId ? "Upravit AI nástroj" : "Přidat AI nástroj"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Název nástroje</label>
                <input
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="provider">Poskytovatel</label>
                <input
                  id="provider"
                  value={formState.provider}
                  onChange={(e) => setFormState({ ...formState, provider: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="description">Popis</label>
                <textarea
                  id="description"
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="category">Kategorie</label>
                <select
                  id="category"
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="status">Stav</label>
                <select
                  id="status"
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                  required
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="url">URL</label>
                <input
                  id="url"
                  type="url"
                  value={formState.url}
                  onChange={(e) => setFormState({ ...formState, url: e.target.value })}
                />
              </div>
              {errorMessage ? (
                <p style={{ color: "var(--danger)", marginBottom: "16px" }}>{errorMessage}</p>
              ) : null}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
                <button type="button" className="button" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }} onClick={() => setModalOpen(false)}>
                  Zrušit
                </button>
                <button type="submit" className="button">
                  Uložit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteId ? (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 style={{ marginTop: 0 }}>Potvrzení mazání</h3>
            <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
              Opravdu chcete tento nástroj smazat? Tato akce je nevratná.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
              <button type="button" className="button" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }} onClick={() => setDeleteId(null)}>
                Zrušit
              </button>
              <button type="button" className="button" style={{ background: "var(--danger)", color: "white" }} onClick={handleDelete}>
                Smazat
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

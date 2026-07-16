import React, { useEffect, useState } from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../api.js";

const PRIORITIES = [
  { value: "basse", label: "Basse" },
  { value: "normale", label: "Normale" },
  { value: "haute", label: "Haute" },
];

// Les couleurs de chaque prénom viennent de la LoadingPage (or / turquoise).
const PEOPLE = [
  { value: "max", label: "Max" },
  { value: "shany", label: "Shany" },
];

const toggleIn = (list, who) =>
  list.includes(who) ? list.filter((w) => w !== who) : [...list, who];

function AssigneeChips({ value, onToggle }) {
  return (
    <span className="panel__who-group">
      {PEOPLE.map((p) => {
        const on = value.includes(p.value);
        return (
          <button
            key={p.value}
            type="button"
            className={`panel__who panel__who--${p.value}${on ? " is-on" : ""}`}
            aria-pressed={on}
            aria-label={`${p.label} : ${on ? "assigné" : "non assigné"}`}
            onClick={() => onToggle(p.value)}
          >
            {p.label}
          </button>
        );
      })}
    </span>
  );
}

export default function TodoPanel() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("normale");
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTodos()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    const payload = {
      text: value,
      due_date: dueDate || null,
      priority,
      assignees,
    };
    setText("");
    setDueDate("");
    setPriority("normale");
    setAssignees([]);
    try {
      const created = await addTodo(payload);
      setItems((prev) => [...prev, created]);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleToggle(item) {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i))
    );
    try {
      await updateTodo(item.id, { done: !item.done });
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleAssign(item, who) {
    const next = toggleIn(item.assignees ?? [], who);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, assignees: next } : i))
    );
    try {
      await updateTodo(item.id, { assignees: next });
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await deleteTodo(id);
    } catch (e) {
      setError(e.message);
    }
  }

  const remaining = items.filter((i) => !i.done).length;

  return (
    <section className="panel panel--todos">
      <header className="panel__header">
        <span className="panel__pin" aria-hidden="true"></span>
        <h2 className="panel__title">À faire</h2>
        <span className="panel__count">{remaining} en cours</span>
      </header>

      <form className="panel__form panel__form--todo" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Ajouter une tâche…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Nouvelle tâche"
        />
        <div className="panel__form-row">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Date d'échéance"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Priorité"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <button type="submit">Ajouter</button>
        </div>
        <div className="panel__form-who">
          <span className="panel__form-who-label">Pour</span>
          <AssigneeChips
            value={assignees}
            onToggle={(who) => setAssignees((prev) => toggleIn(prev, who))}
          />
        </div>
      </form>

      {error && <p className="panel__error">{error}</p>}
      {loading ? (
        <p className="panel__empty">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="panel__empty">Rien à faire pour l'instant. Profitez-en.</p>
      ) : (
        <ul className="panel__list">
          {items.map((item) => (
            <li key={item.id} className={item.done ? "is-checked" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => handleToggle(item)}
                />
                <span className="panel__todo-text">
                  {item.text}
                  <span className="panel__meta">
                    {item.due_date && (
                      <span className="panel__date">{formatDate(item.due_date)}</span>
                    )}
                    <span className={`panel__priority panel__priority--${item.priority}`}>
                      {item.priority}
                    </span>
                  </span>
                </span>
              </label>
              {/* Hors du <label> : sinon un clic sur une pastille cocherait la tâche. */}
              <AssigneeChips
                value={item.assignees ?? []}
                onToggle={(who) => handleAssign(item, who)}
              />
              <button
                className="panel__delete"
                onClick={() => handleDelete(item.id)}
                aria-label={`Supprimer ${item.text}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

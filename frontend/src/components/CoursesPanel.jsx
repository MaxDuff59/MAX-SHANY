import React, { useEffect, useState } from "react";
import { getCourses, addCourse, updateCourse, deleteCourse } from "../api.js";

export default function CoursesPanel() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCourses()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setText("");
    try {
      const created = await addCourse(value);
      setItems((prev) => [...prev, created]);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleToggle(item) {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)),
    );
    try {
      await updateCourse(item.id, { checked: !item.checked });
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await deleteCourse(id);
    } catch (e) {
      setError(e.message);
    }
  }

  const remaining = items.filter((i) => !i.checked).length;
  const ordered = [...items].sort(
    (a, b) => Number(a.checked) - Number(b.checked),
  );

  return (
    <section className="panel panel--courses">
      <header className="panel__header">
        <span className="panel__pin" aria-hidden="true"></span>
        <h2 className="panel__title">Courses</h2>
        <span className="panel__count">{remaining} à prendre</span>
      </header>

      <form className="panel__form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Ajouter un article…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Nouvel article de course"
        />
        <button type="submit">Ajouter</button>
      </form>

      {error && <p className="panel__error">{error}</p>}
      {loading ? (
        <p className="panel__empty">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="panel__empty">
          La liste est vide. Ajoutez le premier article.
        </p>
      ) : (
        <ul className="panel__list">
          {ordered.map((item) => (
            <li key={item.id} className={item.checked ? "is-checked" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggle(item)}
                />
                <span>{item.text}</span>
              </label>
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

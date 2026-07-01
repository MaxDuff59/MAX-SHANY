const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handle(res) {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Erreur API (${res.status}) ${body}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ---- Courses ----
export const getCourses = () => fetch(`${API_URL}/courses`).then(handle);

export const addCourse = (text) =>
  fetch(`${API_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  }).then(handle);

export const updateCourse = (id, patch) =>
  fetch(`${API_URL}/courses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).then(handle);

export const deleteCourse = (id) =>
  fetch(`${API_URL}/courses/${id}`, { method: "DELETE" }).then(handle);

// ---- Todos ----
export const getTodos = () => fetch(`${API_URL}/todos`).then(handle);

export const addTodo = (payload) =>
  fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handle);

export const updateTodo = (id, patch) =>
  fetch(`${API_URL}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).then(handle);

export const deleteTodo = (id) =>
  fetch(`${API_URL}/todos/${id}`, { method: "DELETE" }).then(handle);

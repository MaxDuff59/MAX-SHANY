import { supabase } from "./supabase.js";

function unwrap({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// ---- Courses ----
export const getCourses = () =>
  supabase.from("courses").select("*").order("created_at").then(unwrap);

export const addCourse = (text) =>
  supabase.from("courses").insert({ text }).select().single().then(unwrap);

export const updateCourse = (id, patch) =>
  supabase.from("courses").update(patch).eq("id", id).select().single().then(unwrap);

export const deleteCourse = (id) =>
  supabase.from("courses").delete().eq("id", id).then(unwrap);

// ---- Todos ----
export const getTodos = () =>
  supabase.from("todos").select("*").order("due_date").then(unwrap);

export const addTodo = (payload) =>
  supabase.from("todos").insert(payload).select().single().then(unwrap);

export const updateTodo = (id, patch) =>
  supabase.from("todos").update(patch).eq("id", id).select().single().then(unwrap);

export const deleteTodo = (id) =>
  supabase.from("todos").delete().eq("id", id).then(unwrap);

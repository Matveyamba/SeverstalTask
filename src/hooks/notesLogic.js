export function isValidText(text) {
  return typeof text === "string" && text.trim().length > 0;
}

export function makeTitle(text) {
  const t = (text || "").trim();
  if (!t) return "Без названия";
  const firstLine = t.split("\n")[0].trim();
  return firstLine.length > 40 ? firstLine.slice(0, 40) + "…" : firstLine;
}

export function createNote(now = Date.now()) {
  return {
    id: `n_${now}_${Math.random().toString(16).slice(2)}`,
    text: "",
    createdAt: now,
    updatedAt: now
  };
}

export function upsertNote(notes, note) {
  const id = String(note.id);
  const idx = notes.findIndex((n) => n.id === id);
  if (idx >= 0) {
    const copy = notes.slice();
    copy[idx] = { ...note, id };
    return copy;
  }
  return [{ ...note, id }, ...notes];
}

export function removeNote(notes, id) {
  const sid = String(id);
  return notes.filter((n) => n.id !== sid);
}

export function findNote(notes, id) {
  const sid = String(id);
  return notes.find((n) => n.id === sid) || null;
}

export function filterNotes(notes, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return notes;
  return notes.filter((n) => n.text.toLowerCase().includes(q));
}

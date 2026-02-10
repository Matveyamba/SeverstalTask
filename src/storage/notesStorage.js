const STORAGE_KEY = "a_notes_v1";


function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function normalizeNotes(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(Boolean)
    .map((n) => ({
      id: String(n.id),
      text: typeof n.text === "string" ? n.text : "",
      createdAt: Number(n.createdAt) || Date.now(),
      updatedAt: Number(n.updatedAt) || Date.now()
    }));
}

export function loadNotes(storage = window.localStorage) {
  const raw = safeParse(storage.getItem(STORAGE_KEY) || "[]");
  const notes = normalizeNotes(raw);
  return notes.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveNotes(notes, storage = window.localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(normalizeNotes(notes)));
}

export function ensureSeed(storage = window.localStorage, now = Date.now()) {
  const existing = loadNotes(storage);
  if (existing.length > 0) return existing;

  const seed = [
    {
      id: "seed-1",
      text: "Добро пожаловать 👋\n\nЭто ваша первая заметка.",
      createdAt: now,
      updatedAt: now
    }
  ];

  saveNotes(seed, storage);
  return loadNotes(storage);
}

export function __clear(storage = window.localStorage) {
  storage.removeItem(STORAGE_KEY);
}

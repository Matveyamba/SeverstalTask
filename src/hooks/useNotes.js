import { useEffect, useMemo, useState } from "react";
import { ensureSeed, loadNotes, saveNotes } from "../storage/notesStorage.js";
import {
  createNote,
  findNote,
  filterNotes,
  isValidText,
  removeNote,
  upsertNote
} from "./notesLogic.js";

export function useNotes() {
  const [notes, setNotes] = useState(() => ensureSeed());
  const [selectedId, setSelectedId] = useState(() => notes[0]?.id ?? null);

  const selected = useMemo(() => findNote(notes, selectedId), [notes, selectedId]);

  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterNotes(notes, query), [notes, query]);

  const [draft, setDraft] = useState(() => selected?.text ?? "");
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [confirm, setConfirm] = useState(null);


  useEffect(() => {
    setDraft(selected?.text ?? "");
    setDirty(false);
    setSaveError("");
  }, [selectedId]);

  useEffect(() => {
    function onBeforeUnload(e) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function select(id) {
    setSelectedId(id);
  }

  function onChangeDraft(text) {
    setDraft(text);
    setDirty(true);
    setSaveError("");
  }

  function saveNow() {
    if (!selectedId) return { ok: false, reason: "no_selected" };

    if (!isValidText(draft)) {
      setSaveError("Пустую заметку сохранить нельзя. Введите текст или удалите заметку.");
      return { ok: false, reason: "invalid" };
    }

    const now = Date.now();
    const current = findNote(notes, selectedId);
    if (!current) return { ok: false, reason: "not_found" };

    const updated = { ...current, text: draft, updatedAt: now };
    const next = upsertNote(notes, updated).sort((a, b) => b.updatedAt - a.updatedAt);

    setNotes(next);
    setDirty(false);
    setSaveError("");
    saveNotes(next);

    return { ok: true };
  }

  function createNewImmediate() {
    const now = Date.now();
    const n = createNote(now);
    const next = upsertNote(notes, n).sort((a, b) => b.updatedAt - a.updatedAt);
    setNotes(next);
    setSelectedId(n.id);
    setDraft("");
    setDirty(false);
    setSaveError("");
    saveNotes(next);
  }

  function deleteSelectedImmediate() {
    if (!selectedId) return;
    const next = removeNote(notes, selectedId);
    setNotes(next);
    setSelectedId(next[0]?.id ?? null);
    setDirty(false);
    setSaveError("");
    saveNotes(next);
  }

  function requestSelect(id) {
    if (id === selectedId) return;
    if (!dirty) {
      select(id);
      return;
    }
    setConfirm({ kind: "select", payload: { id } });
  }

  function requestCreate() {
    if (!dirty) {
      createNewImmediate();
      return;
    }
    setConfirm({ kind: "create" });
  }

  function requestDelete() {
    if (!selectedId) return;
    if (!dirty) {
      deleteSelectedImmediate();
      return;
    }
    setConfirm({ kind: "delete" });
  }

  function closeConfirm() {
    setConfirm(null);
  }

  function discardAndContinue() {
    if (!confirm) return;

    const saved = findNote(notes, selectedId);
    setDraft(saved?.text ?? "");
    setDirty(false);
    setSaveError("");

    const kind = confirm.kind;
    const payload = confirm.payload;

    setConfirm(null);

    if (kind === "select") select(payload.id);
    if (kind === "create") createNewImmediate();
    if (kind === "delete") deleteSelectedImmediate();
  }

  function saveAndContinue() {
    if (!confirm) return;

    const res = saveNow();
    if (!res.ok) {
      return;
    }

    const kind = confirm.kind;
    const payload = confirm.payload;

    setConfirm(null);

    if (kind === "select") select(payload.id);
    if (kind === "create") createNewImmediate();
    if (kind === "delete") deleteSelectedImmediate();
  }

  useEffect(() => {
  function onKeyDown(e) {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const mod = isMac ? e.metaKey : e.ctrlKey;

    if (mod && e.altKey && e.key.toLowerCase() === "n") {
      e.preventDefault();
      requestCreate();
    }

    if (mod && e.altKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveNow();
    }
  }

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [dirty, draft, notes, selectedId, confirm]);


  return {
    notes,
    filtered,
    selectedId,
    selected,
    query,
    setQuery,
    draft,
    dirty,
    saveError,


    onChangeDraft,
    saveNow,

    requestSelect,
    requestCreate,
    requestDelete,

    confirm,
    closeConfirm,
    discardAndContinue,
    saveAndContinue
  };
}

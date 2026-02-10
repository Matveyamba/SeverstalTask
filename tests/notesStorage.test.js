import { describe, it, expect, beforeEach } from "vitest";
import { __clear, ensureSeed, loadNotes, saveNotes } from "../src/storage/notesStorage.js";

function createFakeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k)
  };
}

describe("notesStorage", () => {
  let storage;

  beforeEach(() => {
    storage = createFakeStorage();
    __clear(storage);
  });

  it("ensureSeed creates one note on first run", () => {
    const notes = ensureSeed(storage, 1000);
    expect(notes.length).toBe(1);
    expect(notes[0].id).toBe("seed-1");
  });

  it("saveNotes/loadNotes roundtrip + ordering by updatedAt desc", () => {
    saveNotes(
      [
        { id: "1", text: "a", createdAt: 1, updatedAt: 1 },
        { id: "2", text: "b", createdAt: 2, updatedAt: 5 }
      ],
      storage
    );

    const loaded = loadNotes(storage);
    expect(loaded[0].id).toBe("2");
    expect(loaded[1].id).toBe("1");
  });
});

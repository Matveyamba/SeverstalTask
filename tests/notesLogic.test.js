import { describe, it, expect } from "vitest";
import { createNote, upsertNote, removeNote, isValidText, makeTitle } from "../src/hooks/notesLogic.js";

describe("notesLogic", () => {
  it("isValidText", () => {
    expect(isValidText("   ")).toBe(false);
    expect(isValidText("ok")).toBe(true);
  });

  it("makeTitle", () => {
    expect(makeTitle("")).toBe("Без названия");
    expect(makeTitle("Hello\nWorld")).toBe("Hello");
  });

  it("createNote + upsert/remove", () => {
    const n = createNote(1000);
    let notes = [];
    notes = upsertNote(notes, n);
    expect(notes.length).toBe(1);

    const updated = { ...n, text: "x", updatedAt: 2000 };
    notes = upsertNote(notes, updated);
    expect(notes.length).toBe(1);
    expect(notes[0].text).toBe("x");

    notes = removeNote(notes, n.id);
    expect(notes.length).toBe(0);
  });
});

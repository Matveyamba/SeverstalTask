import React from "react";
import styles from "./NotesList.module.css";
import Input from "./ui/Input.jsx";
import Button from "./ui/Button.jsx";
import EmptyState from "./ui/EmptyState.jsx";
import { makeTitle } from "../hooks/notesLogic.js";

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function NotesList({ notes, selectedId, query, setQuery, onSelect, onCreate }) {
  return (
    <div className={styles.card} aria-label="Список заметок">
      <div className={styles.top}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск…"
          ariaLabel="Поиск по заметкам"
        />
        <Button onClick={onCreate} ariaLabel="Создать заметку" title="Ctrl/Cmd+N">
          +
        </Button>
      </div>

      <div className={styles.list} aria-label="Заметки">
        {notes.length === 0 ? (
          <EmptyState title="Ничего не найдено" description="Создайте вашу первую заметку." />
        ) : (
          notes.map((n) => (
            <button
              key={n.id}
              className={`${styles.item} ${n.id === selectedId ? styles.active : ""}`}
              onClick={() => onSelect(n.id)}
              aria-current={n.id === selectedId ? "true" : "false"}
              aria-label={`Открыть заметку: ${makeTitle(n.text)}`}
              type="button"
            >
              <div className={styles.itemTitle}>{makeTitle(n.text)}</div>
              <div className={styles.itemMeta}>Обновлено: {formatDate(n.updatedAt)}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

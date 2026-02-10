import React, { useMemo, useRef } from "react";
import styles from "./Editor.module.css";
import Button from "./ui/Button.jsx";
import Badge from "./ui/Badge.jsx";
import EmptyState from "./ui/EmptyState.jsx";

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function splitDraft(text) {
  const s = typeof text === "string" ? text : "";
  const idx = s.indexOf("\n");
  if (idx === -1) return { title: s, body: "" };
  return {
    title: s.slice(0, idx),
    body: s.slice(idx + 1)
  };
}

function joinDraft(title, body) {
  const t = (title ?? "").replace(/\r/g, "");
  const b = (body ?? "").replace(/\r/g, "");
  if (!b) return t;
  return `${t}\n${b}`;
}

export default function Editor({ note, draft, dirty, saveError, onChange, onSave, onDelete }) {
  const titleRef = useRef(null);
  const bodyRef = useRef(null);

  const status = useMemo(() => {
    if (!note) return null;
    return dirty ? { text: "Есть изменения", tone: "warn" } : { text: "Сохранено", tone: "ok" };
  }, [dirty, note]);

  const { title, body } = useMemo(() => splitDraft(draft), [draft]);

  if (!note) {
    return (
      <div className={styles.card}>
        <EmptyState
          title="Выберите заметку"
          description="Откройте заметку в списке слева или создайте новую."
        />
      </div>
    );
  }

  return (
    <div className={styles.card} aria-label="Редактор">
      <div className={styles.top}>
        <div className={styles.meta}>
          {/* микро-анимация по смене текста */}
          <Badge tone={status.tone} key={status.text}>
            {status.text}
          </Badge>
          <span className={styles.updatedAt}>Обновлено: {formatDate(note.updatedAt)}</span>
        </div>

        <div className={styles.actions}>
          <Button
            variant="ghost"
            onClick={() => titleRef.current?.focus()}
            ariaLabel="Фокус на заголовок"
          >
            Фокус
          </Button>
          <Button variant="ghost" onClick={onSave} disabled={!dirty} ariaLabel="Сохранить">
            Сохранить
          </Button>
          <Button variant="danger" onClick={onDelete} ariaLabel="Удалить заметку">
            Удалить
          </Button>
        </div>
      </div>

      <div className={styles.body}>
        <label className={styles.label} htmlFor="noteTitle">
          Заголовок
        </label>
        <input
          id="noteTitle"
          ref={titleRef}
          className={styles.titleInput}
          value={title}
          onChange={(e) => onChange(joinDraft(e.target.value, body))}
          placeholder="Заголовок…"
          aria-label="Заголовок заметки"
          autoComplete="off"
        />

        <label className={styles.label} htmlFor="noteBody" style={{ marginTop: 10 }}>
          Текст
        </label>
        <textarea
          id="noteBody"
          ref={bodyRef}
          className={styles.textarea}
          value={body}
          onChange={(e) => onChange(joinDraft(title, e.target.value))}
          placeholder="Введите текст…"
          aria-label="Текст заметки"
          spellCheck="false"
        />

        {saveError ? (
          <div className={styles.error} role="alert">
            {saveError}
          </div>
        ) : null}
      </div>
    </div>
  );
}

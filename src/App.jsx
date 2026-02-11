import React, { useMemo, useState } from "react";
import styles from "./App.module.css";
import { useNotes } from "./hooks/useNotes.js";
import NotesList from "./components/NotesList.jsx";
import Editor from "./components/Editor.jsx";
import Button from "./components/ui/Button.jsx";
import Modal from "./components/ui/Modal.jsx";

export default function App() {
  const n = useNotes();
  const [mobilePane, setMobilePane] = useState("list");

  const headerRight = useMemo(() => {
    return (
      <div className={styles.headerRight}>
        <Button onClick={n.requestCreate} ariaLabel="Создать заметку" title="Ctrl/Cmd+N">
          Новая
        </Button>
        <Button
          variant="ghost"
          onClick={n.saveNow}
          disabled={!n.dirty}
          ariaLabel="Сохранить заметку"
          title="Ctrl/Cmd+S"
        >
          Сохранить
        </Button>
      </div>
    );
  }, [n]);

  const confirmOpen = Boolean(n.confirm);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Заметки</h1>
          <p className={styles.subtitle}>
            Ctrl/Cmd+Alt+N — новая, Ctrl/Cmd+Alt+S — сохранить
          </p>
        </div>
        {headerRight}
      </header>

      <div className={styles.mobileTabs} role="tablist" aria-label="Навигация">
        <button
          className={`${styles.tab} ${mobilePane === "list" ? styles.tabActive : ""}`}
          onClick={() => setMobilePane("list")}
          role="tab"
          aria-selected={mobilePane === "list"}
        >
          Список
        </button>
        <button
          className={`${styles.tab} ${mobilePane === "editor" ? styles.tabActive : ""}`}
          onClick={() => setMobilePane("editor")}
          role="tab"
          aria-selected={mobilePane === "editor"}
          disabled={!n.selectedId}
          title={!n.selectedId ? "Нет выбранной заметки" : undefined}
        >
          Редактор
        </button>
      </div>

      <main className={styles.main}>
        <section className={`${styles.left} ${mobilePane !== "list" ? styles.mobileHidden : ""}`}>
          <NotesList
            notes={n.filtered}
            selectedId={n.selectedId}
            query={n.query}
            setQuery={n.setQuery}
            onSelect={(id) => {
              n.requestSelect(id);
              setMobilePane("editor");
            }}
            onCreate={n.requestCreate}
          />
        </section>

        <section className={`${styles.right} ${mobilePane !== "editor" ? styles.mobileHidden : ""}`}>
          <Editor
            note={n.selected}
            draft={n.draft}
            dirty={n.dirty}
            saveError={n.saveError}
            onChange={n.onChangeDraft}
            onSave={n.saveNow}
            onDelete={n.requestDelete}
          />
        </section>
      </main>

      <Modal
        isOpen={confirmOpen}
        onClose={n.closeConfirm}
        title="Заметка не сохранена"
        description="У вас есть несохранённые изменения. Хотите сохранить перед выходом?"
        secondaryText="Выйти без сохранения"
        onSecondary={n.discardAndContinue}
        primaryText="Сохранить"
        onPrimary={n.saveAndContinue}
      />
    </div>
  );
}

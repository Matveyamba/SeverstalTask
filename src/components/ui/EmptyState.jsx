import React from "react";
import styles from "./EmptyState.module.css";

export default function EmptyState({ title, description }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{description}</div>
    </div>
  );
}

import React from "react";
import styles from "./Button.module.css";

export default function Button({ children, onClick, disabled, variant = "primary", ariaLabel, title }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

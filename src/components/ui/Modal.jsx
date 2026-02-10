import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.css";
import Button from "./Button.jsx";

export default function Modal({
  title,
  description,
  isOpen,
  onClose,
  primaryText,
  onPrimary,
  secondaryText,
  onSecondary
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.activeElement;
    dialogRef.current?.focus();

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      prev?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.title}>{title}</div>
        <div className={styles.desc}>{description}</div>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onSecondary} ariaLabel={secondaryText}>
            {secondaryText}
          </Button>
          <Button onClick={onPrimary} ariaLabel={primaryText}>
            {primaryText}
          </Button>
        </div>
      </div>
    </div>
  );
}

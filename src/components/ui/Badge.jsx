import React from "react";
import styles from "./Badge.module.css";

export default function Badge({ children, tone = "ok" }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

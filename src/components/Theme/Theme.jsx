import styles from "./Theme.module.css";

export function Theme() {
  function handleValueChange(event) {
    const meta = document.querySelector('meta[name="color-scheme"]');
    meta.setAttribute("content", event.target.value);
  }

  return (
    <div className={styles.Theme}>
      <span>Theme:</span>
      <select defaultValue="light dark" onChange={handleValueChange}>
        <option value="light dark">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
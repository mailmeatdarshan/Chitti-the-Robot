import { useState } from "react";
import styles from "./Sidebar.module.css";

const CHATS = [
  {
    id: 1,
    title: "How to use AI Tools API in React Application",
  },
  {
    id: 2,
    title: "Gemini AI vs ChatGPT",
  },
  {
    id: 3,
    title: "Comparising Models for Popular AI Tools",
  },
  {
    id: 4,
    title: "How to use AI tools in your daily life",
  },
  {
    id: 5,
    title: "How to use AI tools in your daily work",
  },
];

export function Sidebar({ chats = CHATS, activeChatId = 1 }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSidebarToggle() {
    setIsOpen(!isOpen);
  }

  function handleEscapeClick(event) {
    if (isOpen && event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <>
      <button
        className={styles.MenuButton}
        onClick={handleSidebarToggle}
        onKeyDown={handleEscapeClick}
      >
        <MenuIcon />
      </button>

      <div className={styles.Sidebar} data-open={isOpen}>
        <ul className={styles.Chats}>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={styles.Chat}
              data-active={chat.id === activeChatId}
            >
              <button className={styles.ChatButton}>
                <div className={styles.ChatTitle}>{chat.title}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div className={styles.Overlay} onClick={handleSidebarToggle} />
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#1f1f1f"
    >
      <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
    </svg>
  );
}
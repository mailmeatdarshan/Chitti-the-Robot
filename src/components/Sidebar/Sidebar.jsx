import { useState } from "react";
import styles from "./Sidebar.module.css";

export function Sidebar({
  chats = [],
  activeChatId,
  onChatSelect,
  onChatCreate,
  onChatDelete,
}) {
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
        <button className={styles.NewChatButton} onClick={onChatCreate}>
          <AddIcon />
          <span>New Chat</span>
        </button>

        <ul className={styles.Chats}>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={styles.Chat}
              data-active={chat.id === activeChatId}
            >
              <button
                className={styles.ChatButton}
                onClick={() => {
                  onChatSelect(chat.id);
                  if (window.innerWidth <= 768) setIsOpen(false);
                }}
              >
                <div className={styles.ChatTitle}>{chat.title}</div>
              </button>
              <button
                className={styles.DeleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onChatDelete(chat.id);
                }}
              >
                <DeleteIcon />
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

function AddIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="currentColor"
    >
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="currentColor"
    >
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T760-120H280Zm480-600H280v520h480v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  );
}

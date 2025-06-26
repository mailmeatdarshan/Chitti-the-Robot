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
  return (
    <div className={styles.Sidebar}>
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
  );
}
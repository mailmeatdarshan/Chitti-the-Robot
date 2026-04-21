import { useState, useEffect } from "react";

import { Sidebar } from "./components/Sidebar/Sidebar";
import { Loader } from "./components/Loader/Loader";
import { Chat } from "./components/Messages/Messages";
import { Controls } from "./components/Controls/Controls";
import { Assistant } from "./components/Assistant/Assistant";
import { Theme } from "./components/Theme/Theme";
import styles from "./App.module.css";

let assistant;

function App() {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [activeChatId, setActiveChatId] = useState(() => {
    const lastActiveId = localStorage.getItem("activeChatId");
    return lastActiveId ? JSON.parse(lastActiveId) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("activeChatId", JSON.stringify(activeChatId));
  }, [activeChatId]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];

  function updateLastMessageContent(content) {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: chat.messages.map((message, index) =>
                index === chat.messages.length - 1
                  ? { ...message, content: `${message.content}${content}` }
                  : message
              ),
            }
          : chat
      )
    );
  }

  function addMessage(chatId, message) {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = [...chat.messages, message];
          // Update title if it's the first user message
          let newTitle = chat.title;
          if (chat.title === "New Chat" && message.role === "user") {
            newTitle =
              message.content.slice(0, 30) +
              (message.content.length > 30 ? "..." : "");
          }
          return { ...chat, messages: updatedMessages, title: newTitle };
        }
        return chat;
      })
    );
  }

  async function handleContentSend(content) {
    let currentChatId = activeChatId;

    // Create a new chat if none is active
    if (!currentChatId) {
      const newChat = {
        id: Date.now(),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      currentChatId = newChat.id;
    }

    addMessage(currentChatId, { content, role: "user" });
    setIsLoading(true);

    try {
      const chatHistory = messages.filter(({ role }) => role !== "system");
      const result = await assistant.chatStream(content, chatHistory);

      let isFirstChunk = false;
      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage(currentChatId, { content: "", role: "assistant" });
          setIsLoading(false);
          setIsStreaming(true);
        }
        updateLastMessageContent(chunk);
      }
      setIsStreaming(false);
    } catch (error) {
      addMessage(currentChatId, {
        content:
          error?.message ??
          "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  function handleChatCreate() {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }

  function handleChatSelect(id) {
    setActiveChatId(id);
  }

  function handleChatDelete(id) {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  }

  function handleAssistantChange(newAssistant) {
    assistant = newAssistant;
  }

  return (
    <div className={styles.App}>
      {isLoading && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="/Chitti.png" />
      </header>
      <div className={styles.Content}>
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onChatCreate={handleChatCreate}
          onChatSelect={handleChatSelect}
          onChatDelete={handleChatDelete}
        />

        <main className={styles.Main}>
          <div className={styles.ChatContainer}>
            {activeChatId ? (
              <Chat messages={messages} />
            ) : (
              <div className={styles.Welcome}>
                <img src="/Chitti.png" alt="Welcome" />
                <h1>Hi, I'm Chitti, speed 1 terahertz, memory 1 zettabyte</h1>
              </div>
            )}
          </div>
          <Controls
            isDisabled={isLoading || isStreaming}
            onSend={handleContentSend}
          />
          <div className={styles.Configuration}>
            <Assistant onAssistantChange={handleAssistantChange} />
            <Theme />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import { initializeSocketConnection } from "../services/chat.socket";
import { useEffect } from "react";
import { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../hook/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AiTwotoneDelete } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import { setCurrentChatId } from "../chat.slice.js";

const Dashboard = () => {
  const dispatch = useDispatch();
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");

  const [showSidebar, setShowSidebar] = useState(false);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  const user = useSelector((state) => state.auth.user);
  // console.log(user);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handelSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  const deleteChat = (chatId) => {
    console.log("delete chat called", chatId);
    chat.handelDeleteChat(chatId);
  };

  return (
  <main className="min-h-screen w-full bg-[#07090f] p-3 text-white md:p-5">
    <section className="mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl p-1 md:h-[calc(100vh-2.5rem)] md:gap-6">

      {/* Mobile Overlay */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-72
          bg-[#080b12]
          border-r border-gray-800
          p-4
          transition-transform duration-300
          md:relative md:flex md:h-full md:translate-x-0 md:flex-col md:rounded-3xl md:border

          ${
            showSidebar
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-[#31b8c6]">
            History
          </h2>

          <button
            onClick={() => setShowSidebar(false)}
            className="md:hidden"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto">
          <button
            onClick={() => {
              dispatch(setCurrentChatId(null));
              setShowSidebar(false);
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-white hover:border-white/30"
          >
            <IoIosAddCircle size={20} />
            New Chat
          </button>

          {Object.values(chats).map((chat, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-white/20 px-3 py-2 hover:border-white/30"
            >
              <button
                onClick={() => {
                  openChat(chat.id);
                  setShowSidebar(false);
                }}
                className="cursor-pointer text-left text-base font-light text-white/90"
              >
                {chat.title}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this chat?"
                  );

                  if (confirmDelete) {
                    deleteChat(chat.id);
                  }
                }}
                className="cursor-pointer rounded-lg p-2 text-gray-300 hover:bg-red-500/10 hover:text-red-300"
              >
                <AiTwotoneDelete size={12} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="relative flex h-full min-w-0 flex-1 flex-col gap-4 md:max-w-3xl mx-auto">

        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden">
          <button
            onClick={() => setShowSidebar(true)}
            className="rounded-xl border border-white/20 p-2"
          >
            ☰
          </button>

          <h2 className="text-xl font-semibold text-[#31b8c6]">
            Ukora
          </h2>

          <div className="w-10" />
        </div>

        {/* Messages */}
        <div className="messages flex-1 space-y-3 overflow-y-auto pr-1 pb-36">
          {chats[currentChatId]?.messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-full w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${
                message.role === "user"
                  ? "ml-auto rounded-br-none bg-white/12 text-white"
                  : "mr-auto text-white/90"
              }`}
            >
              {message.role === "user" ? (
                <p>{message.content}</p>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-2 list-disc pl-5">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 list-decimal pl-5">{children}</ol>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-white/10 px-1 py-0.5">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="mb-2 overflow-x-auto rounded-xl bg-black/30 p-3">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-2 w-full">
          <h1 className="mb-5 hidden text-center text-5xl font-semibold text-[#31b8c6] md:block">
            Ukora
          </h1>

          <footer className="rounded-3xl border border-white/20 bg-[#080b12] p-4 md:p-5">
            <form
              onSubmit={handleSubmitMessage}
              className="flex flex-col gap-3 md:flex-row"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-lg text-white outline-none placeholder:text-white/45 focus:border-white/90"
              />

              <button
                type="submit"
                className="rounded-2xl border border-white/20 px-6 py-3 text-lg font-semibold text-white transition hover:bg-white/10"
              >
                Send
              </button>
            </form>
          </footer>
        </div>
      </section>
    </section>
  </main>
);
};

export default Dashboard;

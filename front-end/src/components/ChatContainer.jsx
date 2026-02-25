/**
 * ChatContainer.jsx — Main Chat Conversation Area (Right Panel)
 *
 * Renders the full conversation view for the currently selected user.
 * Placed in the right panel of ChatPage when selectedUser is not null.
 *
 * Structure (top to bottom):
 *  <ChatHeader>               — Shows the other user's avatar, name, online status.
 *  Scrollable message list    — Maps over `messages` from the store. Each message
 *                               is aligned right if sent by authUser, left otherwise.
 *                               Supports both text and image content.
 *                               Auto-scrolls to the latest message on update.
 *  <MessagesLoadingSkeleton>  — Shown while messages are being fetched.
 *  <NoChatHistoryPlaceholder> — Shown when the message list is empty. Provides
 *                               quick-send buttons ("Say Hello", etc.) that call
 *                               sendMessage() directly on click.
 *  <MessageInput>             — Text input, image picker, and send button.
 *
 * Side effects (useEffect):
 *  - Fetches messages for the selected user on mount / when selectedUser changes.
 *  - Subscribes to live message updates (socket.io stub) and unsubscribes on unmount.
 *  - Auto-scrolls to the bottom ref element whenever `messages` array changes.
 */
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

/**
 * Render the main chat interface for the selected conversation.
 *
 * Loads messages for the selected user, subscribes to live message updates (and unsubscribes on cleanup),
 * and auto-scrolls to the latest message when messages change.
 *
 * @returns {JSX.Element} A React element containing the chat header, a scrollable message list (with per-message alignment, timestamps, and optional images),
 * a loading skeleton while messages load, a placeholder when there is no history, and the message input area.
 */
function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${msg.senderId === authUser._id
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-800 text-slate-200"
                    }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder
            name={selectedUser.username || selectedUser.fullName}
            onQuickMessage={(text) => sendMessage({ text, image: null })}
          />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;

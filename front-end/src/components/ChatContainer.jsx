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
 *  <NoChatHistoryPlaceholder> — Shown when the message list is empty.
 *  <MessageInput>             — Text input, image picker, and send button.
 *
 * Side effects (useEffect):
 *  - Fetches messages for the selected user on mount / when selectedUser changes.
 *  - Subscribes to live socket messages and unsubscribes on unmount.
 *  - Auto-scrolls to the bottom whenever the messages array changes.
 */
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  // Read everything we need from the chat store
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage,
  } = useChatStore();

  const { authUser } = useAuthStore(); // the logged-in user (for message alignment)

  // This ref points to an invisible <div> at the bottom of the message list.
  // We scroll to it whenever new messages arrive.
  const messageEndRef = useRef(null);

  // Effect 1: Load messages and subscribe to real-time updates when the selected user changes
  useEffect(() => {
    getMessagesByUserId(selectedUser._id); // fetch message history from the server
    subscribeToMessages();                  // start listening for new socket.io messages

    // Cleanup: stop listening when the component unmounts or the selected user changes
    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // Effect 2: Scroll to the newest message every time the messages list updates
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Top bar: other user's avatar, name, online status, close button */}
      <ChatHeader />

      {/* Scrollable message area */}
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          // --- Show messages ---
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                // chat-end = my messages (right side), chat-start = their messages (left side)
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${msg.senderId === authUser._id
                    ? "bg-cyan-600 text-white"    // my messages: cyan
                    : "bg-slate-800 text-slate-200" // their messages: dark grey
                    }`}
                >
                  {/* If the message has an image, show it */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {/* If the message has text, show it */}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  {/* Timestamp (e.g. "02:30 PM") */}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {/* Invisible scroll target — scrollIntoView() brings us here */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          // --- Show skeleton while loading ---
          <MessagesLoadingSkeleton />
        ) : (
          // --- Show placeholder if no messages yet ---
          <NoChatHistoryPlaceholder
            name={selectedUser.username || selectedUser.fullName}
            // quick-send buttons call sendMessage directly with predefined text
            onQuickMessage={(text) => sendMessage({ text, image: null })}
          />
        )}
      </div>

      {/* Message compose bar at the bottom */}
      <MessageInput />
    </>
  );
}

export default ChatContainer;

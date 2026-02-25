/**
 * ChatsList.jsx — Recent Conversations Sidebar List
 *
 * Rendered in the left sidebar when the "Chats" tab is active. Shows a list
 * of all users the logged-in user has previously exchanged messages with.
 */
import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } =
    useChatStore();

  // onlineUsers is a list of user IDs currently connected via socket.io
  const { onlineUsers } = useAuthStore();

  // Fetch the chat partners list when the component first mounts
  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  // Show skeleton placeholders while the data is loading
  if (isUsersLoading) return <UsersLoadingSkeleton />;

  // Show a "no chats" message if there are no conversations yet
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            {/* Avatar with explicit green dot when online */}
            <div className="relative flex-shrink-0">
              <div className="size-12 rounded-full overflow-hidden">
                <img
                  src={chat.profilePicture || "/avatar.png"}
                  alt={chat.username}
                  className="size-full object-cover"
                />
              </div>
              {/* Green dot — only visible when this user is in the onlineUsers list */}
              {onlineUsers.includes(chat._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
              )}
            </div>

            {/* Username */}
            <h4 className="text-slate-200 font-medium truncate">
              {chat.username}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;

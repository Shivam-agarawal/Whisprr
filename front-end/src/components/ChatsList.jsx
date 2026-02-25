import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Render a list of chat conversation partners and handle selecting a chat partner.
 *
 * On mount, requests the current user's chat partners. While partners are loading it
 * renders a loading skeleton; if no chats exist it renders an empty-state component.
 * Otherwise it renders each chat item with avatar, username, and an online/offline indicator.
 * Clicking an item sets that chat as the selected user in the chat store.
 *
 * @returns {JSX.Element} A React element containing either the loading skeleton, the empty-state, or the list of chat items.
 */
function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
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
            <div
              className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}
            >
              <div className="size-12 rounded-full">
                <img
                  src={chat.profilePicture || "/avatar.png"}
                  alt={chat.username}
                />
              </div>
            </div>
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

/**
 * ChatHeader.jsx — Conversation Header (Top of Right Panel)
 *
 * Displayed at the top of ChatContainer. Shows information about the user
 * whose conversation is currently open.
 *
 * Displays:
 *  - The selected user's profile picture (falls back to "/avatar.png").
 *  - Their username.
 *  - Online / Offline status — determined by checking if selectedUser._id
 *    is in the onlineUsers array from useAuthStore.
 *  - A close (X) button that calls setSelectedUser(null) to deselect the user
 *    and return to the NoConversationPlaceholder view.
 *
 * Keyboard shortcut: pressing the Escape key also closes the conversation.
 *   The event listener is added on mount and cleaned up on unmount.
 */
import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  // Check if the selected user is currently online
  // onlineUsers is an array of user IDs — if selectedUser's ID is in it, they're online
  const isOnline = onlineUsers.includes(selectedUser._id);

  // Add a keyboard shortcut: press Escape to close the current conversation
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null); // null means "no user selected"
    };

    // Attach the listener when the component mounts
    window.addEventListener("keydown", handleEscKey);

    // Cleanup: remove the listener when the component unmounts to avoid memory leaks
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        {/* Avatar with explicit green dot when online */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={selectedUser.profilePicture || "/avatar.png"} // fallback if no picture
              alt={selectedUser.username}
              className="size-full object-cover"
            />
          </div>
          {/* Green dot badge — shown when the user is online */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
          )}
        </div>

        <div>
          {/* User's display name */}
          <h3 className="text-slate-200 font-medium">
            {selectedUser.username}
          </h3>
          {/* Online/Offline text label */}
          <p className="text-slate-400 text-sm">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Close button — sets selectedUser to null, back to the "select a user" screen */}
      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}
export default ChatHeader;

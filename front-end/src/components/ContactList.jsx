/**
 * ContactList.jsx — All Contacts Sidebar List
 *
 * Rendered in the left sidebar when the "Contacts" tab is active. Shows
 * every registered user except the currently logged-in user.
 */
import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } =
    useChatStore();

  // List of currently online user IDs (from socket.io getOnlineUsers event)
  const { onlineUsers } = useAuthStore();

  // Fetch all contacts when the component first mounts
  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  // Show skeleton placeholders while data is loading
  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            {/* Avatar wrapper — position:relative so the green dot can sit on top */}
            <div className="relative flex-shrink-0">
              <div className="size-12 rounded-full overflow-hidden">
                <img
                  src={contact.profilePicture || "/avatar.png"}
                  alt={contact.username}
                  className="size-full object-cover"
                />
              </div>
              {/* Green dot — only shown when the user is online */}
              {onlineUsers.includes(contact._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
              )}
            </div>

            {/* Contact's username */}
            <h4 className="text-slate-200 font-medium">{contact.username}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;

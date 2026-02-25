import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Render a list of chat contacts with avatar, online/offline indicator, and click-to-select behavior.
 *
 * Renders a loading skeleton while contacts are being fetched. When loaded, displays each contact's
 * avatar (fallback to "/avatar.png"), username, and an "online" indicator if the contact's `_id`
 * appears in the auth store's `onlineUsers`. Clicking a contact calls the chat store's `setSelectedUser`
 * with that contact.
 *
 * @returns {JSX.Element} A JSX element containing either the loading skeleton or the contact list.
 */
function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

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
            <div
              className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}
            >
              <div className="size-12 rounded-full">
                <img src={contact.profilePicture || "/avatar.png"} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium">{contact.username}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;

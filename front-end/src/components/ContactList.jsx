import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Render a list of contacts, fetch contacts on mount, and allow selecting a contact.
 *
 * Displays a loading skeleton while contacts are being fetched. Once loaded, each
 * contact is rendered with an avatar (falls back to "/avatar.png"), username,
 * and an online/offline indicator; clicking a contact sets it as the selected user.
 *
 * @returns {JSX.Element} The contact list UI or the users loading skeleton.
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

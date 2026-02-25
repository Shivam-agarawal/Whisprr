/**
 * ChatPage.jsx — Main Chat Application Page
 *
 * The primary protected page rendered at "/" for authenticated users.
 * Contains the full two-panel chat layout wrapped in the animated border.
 *
 * Layout:
 *  Left Panel  (w-80, fixed width):
 *    - <ProfileHeader> — user avatar, username, logout & sound toggle buttons.
 *    - <ActiveTabSwitch> — toggles between "Chats" and "Contacts" tabs.
 *    - Tab content:
 *        "chats"    → <ChatsList>    (users you've previously messaged)
 *        "contacts" → <ContactList>  (all other registered users)
 *
 *  Right Panel (flex-1, takes remaining width):
 *    - If a user is selected: <ChatContainer> (header + messages + input)
 *    - If no user selected:   <NoConversationPlaceholder>
 *
 * State is read from useChatStore (activeTab, selectedUser).
 * No local state — all managed in the Zustand store.
 */
import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

/**
 * Render the main chat page layout with a left pane for profile, tab switch and lists, and a right pane for the active conversation or a placeholder.
 *
 * The left pane displays ChatsList when the store's `activeTab` is "chats", otherwise ContactList. The right pane renders ChatContainer when the store's `selectedUser` is set, otherwise NoConversationPlaceholder.
 * @returns {JSX.Element} The chat page React element.
 */
function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;

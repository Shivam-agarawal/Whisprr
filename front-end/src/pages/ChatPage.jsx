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

function ChatPage() {
  // Read which tab is active and which user (if any) is selected for chatting
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      {/* BorderAnimatedContainer wraps everything in the animated glowing border */}
      <BorderAnimatedContainer>

        {/* LEFT PANEL — sidebar with profile info and user list */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />   {/* avatar, username, logout, sound toggle */}
          <ActiveTabSwitch /> {/* "Chats" | "Contacts" tab buttons */}

          {/* Scrollable list area — shows Chats or Contacts depending on the active tab */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT PANEL — chat area (or prompt to select a user) */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {/* If a user is selected, show the full chat. Otherwise show a "pick someone" prompt */}
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>

      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;

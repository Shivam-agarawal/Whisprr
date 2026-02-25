/**
 * ActiveTabSwitch.jsx — Sidebar Tab Switcher (Chats | Contacts)
 *
 * A simple two-button tab bar rendered between the ProfileHeader and the
 * contact/chat list in the left sidebar of ChatPage.
 *
 * Tabs:
 *  "Chats"    — Shows ChatsList (users with existing message history).
 *  "Contacts" — Shows ContactList (all registered users).
 *
 * State: reads `activeTab` and calls `setActiveTab()` from useChatStore.
 * The active tab's button gets a highlighted background (cyan-500/20).
 * Tab switching is instant (no fetch) since each list fetches its own data
 * on mount via useEffect in ChatsList / ContactList.
 */
import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  // Get the current active tab and the function to change it
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      {/* "Chats" tab button */}
      <button
        onClick={() => setActiveTab("chats")} // switch to Chats tab
        className={`tab ${activeTab === "chats"
          ? "bg-cyan-500/20 text-cyan-400" // highlighted style when active
          : "text-slate-400"               // default style when inactive
          }`}
      >
        Chats
      </button>

      {/* "Contacts" tab button */}
      <button
        onClick={() => setActiveTab("contacts")} // switch to Contacts tab
        className={`tab ${activeTab === "contacts"
          ? "bg-cyan-500/20 text-cyan-400" // highlighted style when active
          : "text-slate-400"               // default style when inactive
          }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;

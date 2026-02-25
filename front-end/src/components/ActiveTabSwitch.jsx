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

/**
 * Renders a two-option tab switch ("Chats" and "Contacts") that updates the chat store's active tab when clicked.
 *
 * @returns {JSX.Element} A horizontal tab bar containing buttons to select the active chat view.
 */
function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab ${activeTab === "chats"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400"
          }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab ${activeTab === "contacts"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400"
          }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;

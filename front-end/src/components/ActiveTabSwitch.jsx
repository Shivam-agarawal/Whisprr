import { useChatStore } from "../store/useChatStore";

/**
 * Render a two-button tab control that reflects and updates the current active tab ("chats" or "contacts").
 *
 * Displays "Chats" and "Contacts" buttons and updates the active tab when a button is clicked.
 * The rendered buttons apply different styling depending on which tab is active.
 * @returns {JSX.Element} The tab switcher element.
 */
function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab ${
          activeTab === "chats"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab ${
          activeTab === "contacts"
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

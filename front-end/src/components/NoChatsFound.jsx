/**
 * NoChatsFound.jsx — Empty Chats Tab Placeholder
 *
 * Shown in the sidebar when the "Chats" tab is active but the user has
 * no existing conversations (i.e. the chats array from useChatStore is empty).
 *
 * Displays:
 *  - An icon and "No conversations yet" heading.
 *  - A short instruction message.
 *  - A "Find contacts" button that switches the active tab to "contacts"
 *    via setActiveTab("contacts"), guiding the user to start their first chat.
 */
import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

/**
 * Render a centered placeholder UI shown when there are no chats.
 *
 * Includes an icon, heading, explanatory text, and a "Find contacts" button
 * that sets the active tab to "contacts" via the chat store when clicked.
 * @returns {JSX.Element} A UI block displaying the "no conversations" message and action button.
 */
function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-8 h-8 text-cyan-400" />
      </div>
      <div>
        <h4 className="text-slate-200 font-medium mb-1">
          No conversations yet
        </h4>
        <p className="text-slate-400 text-sm px-6">
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="px-4 py-2 text-sm text-cyan-400 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors"
      >
        Find contacts
      </button>
    </div>
  );
}
export default NoChatsFound;

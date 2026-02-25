/**
 * MessagesLoadingSkeleton.jsx — Chat Messages Loading Skeleton
 *
 * Shown inside ChatContainer's message area while message history is being
 * fetched from the server (isMessagesLoading is true in useChatStore).
 *
 * Renders 6 pulsing chat-bubble placeholders alternating between left-aligned
 * (chat-start) and right-aligned (chat-end) positions, mimicking the layout
 * of a real conversation while content loads.
 *
 * No props. Uses DaisyUI chat classes for bubble alignment.
 */
/**
 * Render a skeleton placeholder for a list of chat messages.
 *
 * Renders six pulsing chat-bubble placeholders that alternate alignment (start/end)
 * to simulate loading chat messages.
 *
 * @returns {JSX.Element} A container element with six animated chat-bubble placeholders.
 */
function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse`}
        >
          <div className={`chat-bubble bg-slate-800 text-white w-32`}></div>
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;

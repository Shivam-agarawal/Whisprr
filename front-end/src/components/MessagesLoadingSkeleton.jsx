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
function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Create 6 skeleton bubbles using Array spread trick */}
      {/* Even indexes (0,2,4) → left side | Odd indexes (1,3,5) → right side */}
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse`}
        >
          {/* Empty bubble — the pulsing animation creates the skeleton effect */}
          <div className={`chat-bubble bg-slate-800 text-white w-32`}></div>
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;

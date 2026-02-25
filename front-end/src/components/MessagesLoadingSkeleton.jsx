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

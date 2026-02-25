/**
 * UsersLoadingSkeleton.jsx — Contact/Chat List Loading Skeleton
 *
 * Shown in the sidebar (inside ChatsList and ContactList) while user data
 * is being fetched from the server (isUsersLoading is true in useChatStore).
 *
 * Renders 3 pulsing placeholder rows, each containing:
 *  - A circular avatar placeholder (w-12 h-12).
 *  - Two line placeholders of different widths (mimicking a name + status).
 *
 * No props. No state. Purely presentational.
 */
function UsersLoadingSkeleton() {
  return (
    <div className="space-y-2">
      {/* Render 3 skeleton rows using an array of numbers as keys */}
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-slate-800/30 p-4 rounded-lg animate-pulse" // animate-pulse creates the pulsing effect
        >
          <div className="flex items-center space-x-3">
            {/* Circular avatar placeholder */}
            <div className="w-12 h-12 bg-slate-700 rounded-full"></div>

            <div className="flex-1">
              {/* Name line placeholder (wider) */}
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              {/* Status or subtitle line placeholder (narrower) */}
              <div className="h-3 bg-slate-700/70 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default UsersLoadingSkeleton;

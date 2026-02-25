/**
 * ProfileHeader.jsx — Logged-In User Profile Header (Sidebar Top)
 *
 * Displayed at the top of the left sidebar on the ChatPage. Shows the
 * current user's avatar, username, online status, and action buttons.
 *
 * Features:
 *  Avatar        — Clicking the avatar opens a file picker to upload a new
 *                  profile picture. Selected images are shown as a local preview
 *                  immediately (selectedImg state), then uploaded to Cloudinary
 *                  via updateProfile(). Uses authUser.profilePicture for
 *                  display — falls back to "/avatar.png" if not set.
 *  Username      — Displays authUser.username.
 *  Logout button — Calls useAuthStore.logout() (clears session & cookie).
 *  Sound toggle  — Plays a mouse-click sound and calls useChatStore.toggleSound()
 *                  to enable/disable keyboard typing sounds globally.
 *
 * Note: Profile picture field is `profilePicture` (matching the DB schema).
 *       Do NOT use `profilePic` — that was a bug that has been fixed.
 */
import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

/**
 * Renders the user's profile header including avatar (click to change), display name, online status, a logout button, and a sound toggle.
 *
 * The avatar supports image selection and upload; selecting an image updates the preview and calls the profile update handler. The sound toggle plays a click feedback and toggles the app sound state.
 *
 * @returns {JSX.Element} The profile header UI element.
 */
function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePicture: base64Image });
    };
  };

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePicture || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.username}
            </h3>

            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;

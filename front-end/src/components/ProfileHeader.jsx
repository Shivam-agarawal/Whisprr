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
 */
import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

// Load the click sound once at module level (not inside the component)
// This prevents creating a new Audio object on every render
const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();

  // selectedImg holds the base64 string of the newly picked image for local preview.
  // Once uploaded, authUser.profilePicture in the store takes over.
  const [selectedImg, setSelectedImg] = useState(null);

  // A ref to the hidden <input type="file"> so we can trigger it by clicking the avatar
  const fileInputRef = useRef(null);

  // Called when the user picks a new profile picture from their file system
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return; // nothing selected

    // Convert the image file to a base64 string so we can display it and send it via JSON
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result; // the full base64 string (e.g. "data:image/png;base64,...")
      setSelectedImg(base64Image);       // show preview immediately (optimistic)
      await updateProfile({ profilePicture: base64Image }); // upload to Cloudinary via backend
    };
  };

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          {/* AVATAR — click to open file picker and change profile picture */}
          <div className="avatar online"> {/* "online" adds the green status dot */}
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()} // click button → trigger file picker
            >
              {/* 
                Priority: selectedImg (local preview) > authUser.profilePicture (from DB) > default avatar 
              */}
              <img
                src={selectedImg || authUser.profilePicture || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              {/* Hover overlay — shows "Change" text on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            {/* Hidden file input — triggered by clicking the avatar button above */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE STATUS */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.username}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* LOGOUT BUTTON — calls logout() which clears authUser and the JWT cookie */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE — enables/disables keystroke sounds throughout the app */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // Play the click sound as feedback before toggling
              mouseClickSound.currentTime = 0; // reset to start in case it's already playing
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error));
              toggleSound(); // flip isSoundEnabled in the store and save to localStorage
            }}
          >
            {/* Show different icon based on whether sound is enabled */}
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />   // 🔊 sound ON icon
            ) : (
              <VolumeOffIcon className="size-5" /> // 🔇 sound OFF icon
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;

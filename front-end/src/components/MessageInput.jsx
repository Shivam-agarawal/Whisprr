/**
 * MessageInput.jsx — Chat Message Compose & Send Area
 *
 * The input bar at the bottom of the chat (inside ChatContainer). Lets the
 * user compose and send text messages and/or image attachments.
 *
 * Features:
 *  Text input    — Controlled input; plays a random keystroke sound on each
 *                  character when isSoundEnabled is true.
 *  Image picker  — Hidden file input triggered by the image icon button.
 *                  Accepts image/* files only (shows a toast error otherwise).
 *                  Selected image is read as a base64 DataURL and shown as a
 *                  thumbnail preview. A remove (×) button discards the image.
 *  Send button   — Disabled when both text and image are empty. On submit,
 *                  calls useChatStore.sendMessage({ text, image }).
 *                  The backend uploads base64 images to Cloudinary.
 *
 * Note: The body size limit on the backend is 10MB to accommodate base64 images.
 */
import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();

  // Local state for the text input and the image preview (base64 string)
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // A ref to the hidden <input type="file"> so we can trigger it programmatically
  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  // Called when the form is submitted (Enter key or Send button click)
  const handleSendMessage = (e) => {
    e.preventDefault(); // prevent the page from reloading on form submit

    // Don't send if both fields are empty
    if (!text.trim() && !imagePreview) return;

    // Play a sound on send if sound is enabled
    if (isSoundEnabled) playRandomKeyStrokeSound();

    // Call the store action to send the message (handles optimistic UI + API call)
    sendMessage({
      text: text.trim(),   // trimmed text (empty string if no text)
      image: imagePreview, // base64 string if image selected, null otherwise
    });

    // Reset the input fields after sending
    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = ""; // clear the file input
  };

  // Called when the user picks a file from the file picker
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Reject non-image files and show an error toast
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Convert the image file to a base64 string so it can be sent via JSON
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result); // reader.result = base64 string
    reader.readAsDataURL(file);
  };

  // Clear the selected image and reset the file input
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 border-t border-slate-700/50">
      {/* Image preview — shown above the input bar when an image is selected */}
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            {/* Remove button (×) — clears the selected image */}
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Message compose form */}
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex space-x-4"
      >
        {/* Text input field */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            // Play a keystroke sound on each character typed (if sounds are enabled)
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Type your message..."
        />

        {/* Hidden file input — triggered by clicking the image icon button below */}
        <input
          type="file"
          accept="image/*"  // only allow image files
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Image picker button — clicks the hidden file input */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()} // programmatically open file picker
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${imagePreview ? "text-cyan-500" : ""
            }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Send button — disabled if there's nothing to send */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;

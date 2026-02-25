/**
 * useKeyboardSound.js — Keyboard Sound Effect Hook
 *
 * A custom React hook that provides a function to play a random keystroke
 * sound effect. Used in MessageInput to give tactile audio feedback while
 * the user types, when sound is enabled in useChatStore.
 *
 * Sound Pool:
 *  Four distinct keystroke audio files (keystroke1–4.mp3) are pre-loaded
 *  at module level so they are ready to play instantly without delay.
 *  Each call picks one at random, resets it to time 0 (so rapid triggers
 *  don't queue up), and plays it. Errors (e.g. browser autoplay block) are
 *  caught and logged silently.
 *
 * Returns:
 *  { playRandomKeyStrokeSound } — call this function on each keypress event.
 *
 * Audio Files Expected In: /public/sounds/keystroke1.mp3 … keystroke4.mp3
 */

// Load all keystroke sounds once at module level (not inside the function).
// This way the audio objects are reused every keystroke instead of being
// recreated, which would cause a small delay before each sound.
const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

function useKeyboardSound() {
  const playRandomKeyStrokeSound = () => {
    // Pick a random sound from the pool
    const randomSound =
      keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

    // Reset to the beginning — without this, holding a key would play nothing
    // because the audio would still be at the end from the previous press
    randomSound.currentTime = 0;

    // Play the sound — .play() returns a Promise so we catch errors
    // (browsers can block audio if the user hasn't interacted with the page yet)
    randomSound
      .play()
      .catch((error) => console.log("Audio play failed:", error));
  };

  // Expose only the play function — the sounds array is internal
  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;

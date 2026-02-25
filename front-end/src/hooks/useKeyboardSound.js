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
// audio setup
const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

/**
 * Provides a handler to play a random keystroke sound from the module's sound pool.
 *
 * @returns {{ playRandomKeyStrokeSound: function }} An object exposing `playRandomKeyStrokeSound`, a function that resets and plays a randomly selected keystroke audio and logs playback errors. 
 */
function useKeyboardSound() {
  const playRandomKeyStrokeSound = () => {
    const randomSound =
      keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

    randomSound.currentTime = 0; // this is for a better UX, def add this
    randomSound
      .play()
      .catch((error) => console.log("Audio play failed:", error));
  };

  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;

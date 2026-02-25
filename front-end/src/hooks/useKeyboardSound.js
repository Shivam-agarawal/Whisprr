// audio setup
const keyStrokeSounds = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

/**
 * Provides a function to play a random keystroke sound.
 *
 * The returned API includes a single action that selects one of the predefined
 * keystroke audio clips, ensures playback starts from the beginning, and plays it.
 *
 * @returns {{ playRandomKeyStrokeSound: () => void }} An object containing `playRandomKeyStrokeSound`, a function that plays a random keystroke sound.
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

/**
 * BorderAnimatedContainer.jsx — Animated Gradient Border Wrapper
 *
 * A purely visual wrapper component that renders its children inside a
 * container with a continuously rotating conic-gradient border animation.
 * Used as the outer shell for the LoginPage, SignUpPage, and ChatPage.
 *
 * How the animation works:
 *  A CSS custom property `--border-angle` is incremented by the `animate-border`
 *  Tailwind animation (defined in tailwind config / index.css). The container uses
 *  a two-layer background: a dark fill as the padding-box and the conic gradient
 *  as the border-box, creating the illusion of an animated glowing border.
 *
 * Reference: https://cruip-tutorials.vercel.app/animated-gradient-border/
 *
 * Props:
 *  children — any React nodes to render inside the animated border container.
 */
// How to make animated gradient border 👇
// https://cruip-tutorials.vercel.app/animated-gradient-border/

// This component just wraps its children in a div with the animated border styling.
// The long className string is a Tailwind/CSS trick: it sets up two backgrounds —
// one dark fill for the content area, and one conic-gradient for the border.
function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full [background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.cyan.500)_86%,_theme(colors.cyan.300)_90%,_theme(colors.cyan.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border  flex overflow-hidden">
      {children} {/* render whatever is passed between the component's opening and closing tags */}
    </div>
  );
}
export default BorderAnimatedContainer;

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.("(pointer: coarse)").matches) return;
    let frame;

    function handleMove(e) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ref.current?.style.setProperty("--x", `${e.clientX}px`);
        ref.current?.style.setProperty("--y", `${e.clientY}px`);
      });
    }

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at var(--x, 50vw) var(--y, 50vh), rgba(124, 58, 237, 0.07), transparent 40%)`,
      }}
      aria-hidden="true"
    />
  );
}

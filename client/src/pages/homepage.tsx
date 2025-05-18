import { useEffect, useState, useRef } from "react";
import Navigation from "../components/Navigation";
import MoodTracker from "../components/MoodTracker";
import Mascot from "../components/Mascot";
import "../styles/globals.css";
import { JournalButton } from "@/components/moodjournal";
import { EmotionExplore } from "@/components/emotionexplore";
import { MinusButton } from "@/components/minus";
import { PlusButton } from "@/components/plus";



const HIDE_DELAY_MS = 2000;

const HomePage = () => {
  // track the current window width
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // breakpoints by width
  const isMobile = width < 640;      // <640px
  const isTablet = width >= 640 && width < 1024; 
  const isDesktop = width >= 1024;   // ≥1024px

  // mascot sizes
  const MASCOT_MOBILE = 225;
  const MASCOT_TABLET = 275;
  const MASCOT_DESKTOP = 350;

  // pick your mascot size by width
  const mascotSize = isMobile
    ? MASCOT_MOBILE
    : isTablet
    ? MASCOT_TABLET
    : MASCOT_DESKTOP;

  // mood-tracker max-width classes
  // Tailwind has: max-w-md (28rem), lg: max-w-lg (32rem), xl: max-w-xl (36rem), 2xl: max-w-2xl (42rem), 3xl: max-w-3xl (48rem), 4xl: max-w-4xl (56rem), 5xl: max-w-5xl (64rem)
  // we’ll pick a bigger one on desktop:
  // pick your mood‐tracker max‐width as before
  const moodMaxWidthClass = isDesktop
    ? "max-w-4xl"
    : isTablet
    ? "max-w-2xl"
    : "max-w-md";

  // define a height class for desktop (and fall back on auto for smaller)
  const moodHeightClass = isDesktop
    ? "h-[600px]"   // ← pick whatever height you need
    : "h-auto";

  // new: is the bottom nav visible?
  const [navVisible, setNavVisible] = useState(true);

  // to keep track of the current timeout so we can clear it
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const scheduleHide = () => {
    // clear any existing timer
    if (hideTimer.current) clearTimeout(hideTimer.current);

    // schedule a new one
    hideTimer.current = setTimeout(() => {
      setNavVisible(false);
    }, HIDE_DELAY_MS);
  };

  useEffect(() => {
    const handleActivity = () => {
      setNavVisible(true);
      scheduleHide();
    };

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleActivity, { passive: true });
    }

    // on desktop: mouse & keyboard
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // on mobile: touch
    window.addEventListener("touchstart", handleActivity);

    // start the auto‐hide cycle
    scheduleHide();

    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", handleActivity);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  // SSR-guard
  if (typeof window === "undefined") return null;

  return (
    <div className="app-container flex flex-col h-screen">
      <div className="app-content flex flex-col flex-1 w-full p-0">
        <div
          ref={scrollRef}
          className={`
            flex-1 flex flex-col items-center overflow-y-auto
            pb-24          /* mobile: ~6rem = 96px */
            md:pb-32       /* tablet: ~8rem = 128px */
            lg:pb-40       /* desktop: ~10rem = 160px */
            ${isDesktop ? "gap-y-10" : isTablet ? "gap-y-8" : "gap-y-4"}
          `}
        >
      {/* Mascot + Corner Buttons */}
      <div className="mascot-section flex items-center justify-center overflow-visible">
        <div
          className="relative"
          style={{ width: `${mascotSize}px`, height: `${mascotSize}px` }}
        >
          <Mascot size={mascotSize} />

          {/* TOP-LEFT */}
          <div
            className={`
              absolute left-0 top-0
              mt-5
              transform
              -translate-x-full -translate-y-1/2    /* center on corner */
              sm:-translate-x-3 sm:-translate-y-3  /* extra 0.75rem outward on sm+ */
            `}
          >
            <JournalButton />
          </div>

          {/* TOP-RIGHT */}
          <div
            className={`
              mt-5
              absolute right-0 top-0
              transform
              translate-x-full -translate-y-1/2
              sm:translate-x-3 sm:-translate-y-3
            `}
          >
            <EmotionExplore />
          </div>

          {/* BOTTOM-LEFT */}
          <div
            className={`
              absolute left-0 bottom-0
              transform
              -translate-x-full translate-y-1/2
              sm:-translate-x-3 sm:translate-y-3
            `}
          >
            <MinusButton />
          </div>

          {/* BOTTOM-RIGHT */}
          <div
            className={`
              absolute right-0 bottom-0
              transform
              translate-x-full translate-y-1/2
              sm:translate-x-3 sm:translate-y-3
            `}
          >
            <PlusButton />
          </div>
        </div>
      </div>

          {/* Mood-tracker */}
          <div
            className={`
              mood-interface w-full flex items-center justify-center
              ${isDesktop ? "p-15" : isTablet ? "p-10" : "p-1"}
            `}
          >
            <div className={`w-full ${moodMaxWidthClass} ${moodHeightClass}`}>
              {/* Make sure MoodTracker spans full height of its container */}
              <div className="h-full">
              <MoodTracker />
              </div>
            </div>
          </div>
        </div>

      {/* Navigation bar */}
      <div
        className={`
          fixed inset-x-0 bottom-0 bg-black
          transform transition-transform duration-300
          ${navVisible ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <Navigation />
      </div>
      </div>
    </div>
  );
};

export default HomePage;
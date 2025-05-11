import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import MoodTracker from "../components/MoodTracker";
import Mascot from "../components/Mascot";
import "../styles/globals.css";

const HomePage = () => {
  // track the current window height
  const [height, setHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  useEffect(() => {
    const onResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    // cleanup
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // derive your two breakpoints
  const isShort900 = height < 900; // your existing logic
  const isShort700 = height < 700; // new mascot‐size logic

  // choose two mascot sizes
  const MASCOT_DEFAULT = 250;
  const MASCOT_SMALL = 225;

  // don't render on SSR
  if (typeof window === "undefined") return null;

  return (
    <div className="app-container flex flex-col h-screen">
      <div className="app-content flex flex-col flex-1 w-full p-0">
        <div
          className={`
            flex-1 flex flex-col items-center overflow-y-auto
            pb-[108.81px]
            ${isShort900 ? "gap-y-1" : "gap-y-6"}
          `}
        >
          <div className="mascot-section flex items-center justify-center">
            {/* only this changes when <700 */}
            <Mascot size={isShort700 ? MASCOT_SMALL : MASCOT_DEFAULT} />
          </div>

          <div
            className={`mood-interface w-full flex items-center justify-center ${
              isShort900 ? "p-1" : "p-2"
            }`}
          >
            <div className="w-full max-w-nav">
              <MoodTracker />
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 bg-black">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

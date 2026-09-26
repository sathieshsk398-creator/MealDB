import { useState, useEffect } from "react";
import { UtensilsCrossed, Sparkles } from "lucide-react";

const SplashScreen = ({ onFinish, duration = 2500 }) => {
  const [phase, setPhase] = useState("enter"); // 'enter' | 'active' | 'exiting'

  useEffect(() => {
    // Phase 1: Enter sequence triggers immediately
    const enterTimer = setTimeout(() => {
      setPhase("active");
    }, 200);

    // Phase 2: Start exit animations before duration ends
    const exitAnimTimer = setTimeout(() => {
      setPhase("exiting");
    }, Math.max(duration - 600, 1000));

    // Phase 3: Completely finish and unmount
    const finishTimer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitAnimTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  const brandWord1 = "Dish";
  const brandWord2 = "ly";

  return (
    <div
      id="app-splash-screen"
      onClick={onFinish}
      style={{
        zIndex: 999999,
        background: "radial-gradient(circle at center, #064e3b 0%, #022c22 45%, #020617 100%)",
      }}
      className={`fixed inset-0 flex flex-col items-center justify-center text-white select-none overflow-hidden transition-all duration-700 ease-in-out cursor-pointer ${
        phase === "exiting"
          ? "opacity-0 scale-105 blur-sm pointer-events-none"
          : "opacity-100 scale-100 blur-0 pointer-events-auto"
      }`}
      title="Click to enter"
    >
      {/* Background ambient glowing orbs */}
      <div
        className={`absolute w-80 h-80 sm:w-[32rem] sm:h-[32rem] rounded-full bg-emerald-500/20 blur-3xl pointer-events-none transition-all duration-700 ease-in-out ${
          phase === "exiting"
            ? "scale-150 opacity-0"
            : phase === "enter"
            ? "scale-50 opacity-20"
            : "scale-100 opacity-100 animate-pulse"
        }`}
      />
      <div
        className={`absolute w-64 h-64 rounded-full bg-teal-400/15 blur-2xl pointer-events-none transition-all duration-700 ease-in-out ${
          phase === "exiting" ? "scale-150 opacity-0" : "scale-100 opacity-100"
        }`}
      />

      {/* Main Brand Container */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 transition-all duration-700 ease-in-out transform ${
          phase === "exiting"
            ? "scale-90 -translate-y-6 opacity-0"
            : "scale-100 translate-y-0 opacity-100"
        }`}
      >
        {/* Animated Brand Icon */}
        <div
          className={`relative mb-6 transition-all duration-700 ease-out transform ${
            phase === "enter"
              ? "opacity-0 scale-50 -translate-y-6"
              : phase === "exiting"
              ? "opacity-0 scale-75 -translate-y-4 rotate-6"
              : "opacity-100 scale-100 translate-y-0 rotate-0"
          }`}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/50 border border-emerald-300/40 relative">
            <UtensilsCrossed className="w-10 h-10 sm:w-12 sm:h-12 text-white stroke-[2.5] drop-shadow-md" />
          </div>

          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="flex items-center justify-center gap-1 overflow-hidden py-1">
          <div className="flex items-center">
            {brandWord1.split("").map((char, index) => (
              <span
                key={`d1-${index}`}
                className="text-5xl sm:text-6xl font-black tracking-tight text-white inline-block drop-shadow-xl"
              >
                {char}
              </span>
            ))}
          </div>

          <div className="flex items-center ml-1">
            {brandWord2.split("").map((char, index) => (
              <span
                key={`d2-${index}`}
                className="text-5xl sm:text-6xl font-black tracking-tight text-emerald-400 inline-block drop-shadow-[0_2px_18px_rgba(52,211,153,0.7)]"
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Subtitle / "MEAL EXPLORER" Badge */}
        <div className="mt-3.5 flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <p className="text-xs font-black tracking-widest uppercase text-emerald-200">
              MEAL EXPLORER & RECIPES
            </p>
          </div>
          <p className="text-xs font-semibold text-emerald-300/80 tracking-wider">
            Authentic Regional Flavors & Global Cuisines
          </p>
        </div>

        {/* Highlights Row */}
        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-emerald-300/80 font-medium tracking-wide">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Exact Ingredients
          </span>
          <span className="text-emerald-500/40">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Cooking Steps
          </span>
          <span className="text-emerald-500/40">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Video Tutorials
          </span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

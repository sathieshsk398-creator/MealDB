import { useState, useEffect } from "react";
import { UtensilsCrossed, Sparkles } from "lucide-react";

const SplashScreen = ({ onFinish, duration = 10000 }) => {
  const [phase, setPhase] = useState("enter"); // 'enter' | 'active' | 'exiting'

  useEffect(() => {
    // Phase 1: Enter sequence triggers immediately
    const enterTimer = setTimeout(() => {
      setPhase("active");
    }, 400);

    // Phase 2: Start theatrical exit animations 1200ms before duration ends
    const exitAnimTimer = setTimeout(() => {
      setPhase("exiting");
    }, duration - 1200);

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
      style={{
        zIndex: 999999,
        background: "radial-gradient(circle at center, #064e3b 0%, #022c22 45%, #020617 100%)",
      }}
      className={`fixed inset-0 flex flex-col items-center justify-center text-white select-none overflow-hidden transition-all duration-1000 ease-in-out ${
        phase === "exiting"
          ? "opacity-0 scale-110 blur-sm pointer-events-none"
          : "opacity-100 scale-100 blur-0 pointer-events-auto"
      }`}
    >
      {/* Background ambient glowing orbs with exit zoom effect */}
      <div
        className={`absolute w-80 h-80 sm:w-[32rem] sm:h-[32rem] rounded-full bg-emerald-500/20 blur-3xl pointer-events-none transition-all duration-1000 ease-in-out ${
          phase === "exiting"
            ? "scale-150 opacity-0"
            : phase === "enter"
            ? "scale-50 opacity-20"
            : "scale-100 opacity-100 animate-pulse"
        }`}
      />
      <div
        className={`absolute w-64 h-64 rounded-full bg-teal-400/15 blur-2xl pointer-events-none transition-all duration-1000 ease-in-out ${
          phase === "exiting" ? "scale-150 opacity-0" : "scale-100 opacity-100"
        }`}
      />

      {/* Main Brand Container with Entrance & Exit animations */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 transition-all duration-1000 ease-in-out transform ${
          phase === "exiting"
            ? "scale-90 -translate-y-8 opacity-0"
            : "scale-100 translate-y-0 opacity-100"
        }`}
      >
        {/* Animated Brand Icon */}
        <div
          className={`relative mb-6 transition-all duration-1000 ease-out transform ${
            phase === "enter"
              ? "opacity-0 scale-50 -translate-y-8"
              : phase === "exiting"
              ? "opacity-0 scale-75 -translate-y-6 rotate-12"
              : "opacity-100 scale-100 translate-y-0 rotate-0"
          }`}
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/50 border border-emerald-300/40 relative">
            <UtensilsCrossed className="w-12 h-12 sm:w-14 sm:h-14 text-white stroke-[2.5] drop-shadow-md animate-pulse" />
          </div>

          {/* Accent Gold Badge */}
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center shadow-lg animate-bounce">
            <Sparkles className="w-4 h-4 text-slate-950 stroke-[3]" />
          </div>
        </div>

        {/* Brand Name Typography with Staggered Entrance & Exit animations */}
        <div className="flex items-center justify-center gap-1 overflow-hidden py-1">
          {/* "Dish" Word */}
          <div className="flex items-center">
            {brandWord1.split("").map((char, index) => (
              <span
                key={`d1-${index}`}
                style={{
                  transitionDelay:
                    phase === "exiting"
                      ? `${index * 60}ms`
                      : `${300 + index * 100}ms`,
                  transitionDuration: phase === "exiting" ? "600ms" : "800ms",
                }}
                className={`text-5xl sm:text-6xl font-black tracking-tight text-white inline-block drop-shadow-xl transform transition-all ease-out ${
                  phase === "enter"
                    ? "opacity-0 translate-y-10 scale-75 rotate-6"
                    : phase === "exiting"
                    ? "opacity-0 -translate-y-8 scale-90 -rotate-3"
                    : "opacity-100 translate-y-0 scale-100 rotate-0"
                }`}
              >
                {char}
              </span>
            ))}
          </div>

          {/* "ly" Word with glowing emerald gradient */}
          <div className="flex items-center ml-1">
            {brandWord2.split("").map((char, index) => (
              <span
                key={`d2-${index}`}
                style={{
                  transitionDelay:
                    phase === "exiting"
                      ? `${240 + index * 60}ms`
                      : `${700 + index * 120}ms`,
                  transitionDuration: phase === "exiting" ? "600ms" : "800ms",
                }}
                className={`text-5xl sm:text-6xl font-black tracking-tight text-emerald-400 inline-block drop-shadow-[0_2px_18px_rgba(52,211,153,0.7)] transform transition-all ease-out ${
                  phase === "enter"
                    ? "opacity-0 translate-y-10 scale-75 -rotate-6"
                    : phase === "exiting"
                    ? "opacity-0 -translate-y-8 scale-90 rotate-3"
                    : "opacity-100 translate-y-0 scale-100 rotate-0"
                }`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Animated Subtitle / "FOOD DELIVERY" Badge */}
        <div
          style={{
            transitionDelay: phase === "exiting" ? "150ms" : "950ms",
            transitionDuration: "800ms",
          }}
          className={`mt-4 transform transition-all ease-out flex flex-col items-center gap-2 ${
            phase === "enter"
              ? "opacity-0 translate-y-6 tracking-normal"
              : phase === "exiting"
              ? "opacity-0 translate-y-6 scale-90 tracking-widest"
              : "opacity-100 translate-y-0 tracking-widest scale-100"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <p className="text-xs sm:text-sm font-black tracking-widest uppercase text-emerald-200">
              FOOD DELIVERY
            </p>
          </div>
          <p className="text-[11px] sm:text-xs font-semibold text-emerald-300/80 tracking-wider uppercase">
            Authentic South Indian & Tamil Flavors
          </p>
        </div>

        {/* Animated Highlights Row */}
        <div
          style={{
            transitionDelay: phase === "exiting" ? "0ms" : "1250ms",
            transitionDuration: "700ms",
          }}
          className={`mt-6 flex items-center justify-center gap-4 text-xs text-emerald-300/80 font-medium tracking-wide transform transition-all ease-out ${
            phase === "enter"
              ? "opacity-0 translate-y-4"
              : phase === "exiting"
              ? "opacity-0 translate-y-4 scale-95"
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Freshly Made
          </span>
          <span className="text-emerald-500/40">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Hot & Crispy
          </span>
          <span className="text-emerald-500/40">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Speed Delivery
          </span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

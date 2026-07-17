import { useEffect, useRef, useState } from "react";

// Drop your splash videos at: public/ folder
const DESKTOP_VIDEO_SRC = "/public/splash.mp4"; // Window/Desktop screen video
const MOBILE_VIDEO_SRC = "/public/splash-mobile.mp4"; // Mobile screen video

// 6 minutes hard cap in milliseconds (6 * 60 * 1000)
const MAX_DURATION = 3600000;

export default function SplashScreen({ onFinish }) {
  const [fadingOut, setFadingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const finishedRef = useRef(false);

  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFadingOut(true);
    setTimeout(() => onFinish?.(), 400); // matches fade-out transition duration
  }

  useEffect(() => {
    // 1. Initial screen size check & listener loop setup
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    checkScreenSize(); // Initial check run setup
    window.addEventListener("resize", checkScreenSize);

    // 2. Hard timeout fallback timer
    timerRef.current = setTimeout(finish, MAX_DURATION);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Trigger video load logic on state change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.log("Autoplay blocked or load issue caught:", err);
      });
    }
  }, [isMobile]);

  return (
    <div
      onClick={finish}
      className={`fixed inset-0 z-[10000] bg-[#e2e2e2] flex items-center justify-center overflow-hidden transition-opacity duration-400 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-full h-full">
        {/* Dynamic Responsive Video component - Made Full Screen */}
        <video
          ref={videoRef}
          key={isMobile ? "mobile" : "desktop"} // Forces component re-mount to load source updates instantly
          className="absolute inset-0 w-full h-full object-cover z-10"
          src={isMobile ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC}
          autoPlay
          muted
          playsInline
          onEnded={finish}
          onError={finish}
        />
      </div>
    </div>
  );
}
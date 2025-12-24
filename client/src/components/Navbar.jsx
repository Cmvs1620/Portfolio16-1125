import { useEffect, useState, useRef } from "react";
import {
  Home,
  User,
  Briefcase,
  Mail,
  Sun,
  Moon,
  Linkedin,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "#hero", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Projects", href: "#projects", icon: Briefcase },
  { name: "Contact", href: "#contact", icon: Mail },
];

/* =======================
   Theme Toggle (plain JS)
======================= */
const ThemeToggle = ({ theme, setTheme }) => {
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", initial === "dark");
    setTheme(initial);
  }, [setTheme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

/* =======================
   Navbar (ALWAYS VISIBLE)
======================= */
export const Navbar = () => {
  const [activeSection, setActiveSection] = useState("#hero");
  const [theme, setTheme] = useState("light");

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioRef = useRef(null);

  const musicUrl = "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/music.mp3";

  // Ambient audio (plain JS)
  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = "auto";
    const onReady = () => setIsAudioReady(true);
    audio.addEventListener("canplaythrough", onReady);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", onReady);
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current || !isAudioReady) return;
    if (isMusicPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(console.error);
    setIsMusicPlaying((p) => !p);
  };

  // Track active section (for highlight)
  useEffect(() => {
    const handler = () => {
      const scrollPos = window.scrollY + 100;
      for (const { href } of navItems) {
        const el = document.querySelector(href); // <-- no TS cast
        if (!el) continue;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(href);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler(); // initial highlight
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Theme-aware logo
  const logoSrc = theme === "dark" ? "/logovit.svg" : "/logo.svg";

  return (
    <>
      {/* === TOP-LEFT LOGO === */}
      <motion.a
        href="#hero"
        className="fixed left-6 top-6 z-50"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        title="Back to top"
        aria-label="Back to top"
      >
        <img
          src={logoSrc}
          alt="Carl-Maurits logo"
          className="h-14 w-auto select-none"
          draggable="false"
        />
      </motion.a>

      {/* === TOP-RIGHT (LinkedIn + Music only) === */}
      <motion.div
        className="fixed top-4 right-4 z-50 flex gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* LinkedIn */}
        <motion.a
          href="https://www.linkedin.com/in/carl-maurits-von-schantz/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="LinkedIn"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </motion.a>

        {/* Music */}
        <motion.button
          onClick={toggleMusic}
          disabled={!isAudioReady}
          className={cn(
            "p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md",
            "text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
            "border border-gray-200 dark:border-gray-700 shadow-sm",
            "flex items-center justify-center",
            !isAudioReady && "opacity-50 cursor-not-allowed"
          )}
          whileHover={{ scale: isAudioReady ? 1.05 : 1 }}
          whileTap={{ scale: isAudioReady ? 0.95 : 1 }}
          title={isAudioReady ? (isMusicPlaying ? "Pause music" : "Play music") : "Loading music"}
          aria-label={isAudioReady ? (isMusicPlaying ? "Pause music" : "Play music") : "Loading music"}
        >
          {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>
      </motion.div>

      {/* === BOTTOM NAVBAR (ALWAYS VISIBLE) === */}
      <motion.div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      >
        <div className="flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg p-2 border border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1 items-center">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "p-2 rounded-full transition-colors flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  activeSection === item.href
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                )}
                aria-label={item.name}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1 hidden md:block">{item.name}</span>
              </a>
            ))}
            <div className="flex items-center px-2">
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;

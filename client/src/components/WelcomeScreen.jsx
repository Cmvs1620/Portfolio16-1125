import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

const WelcomeScreen = ({ onWelcomeComplete }) => {
  const [phase, setPhase] = useState(0);
  const [exitAnimation, setExitAnimation] = useState(false);
  const [typedText, setTypedText] = useState("");
  const { theme } = useTheme();

  // Theme-based colors
  const colors = {
    light: {
      primary: "hsl(222.2 47.4% 11.2%)",
      secondary: "hsla(262, 100%, 50%, 1)",
      background: "hsl(0 0% 100%)",
      muted: "hsl(215.4 16.3% 46.9%)",
      link: "hsl(221.2 83.2% 53.3%)",
    },
    dark: {
      primary: "hsl(210 40% 98%)",
      secondary: "hsla(263, 100%, 50%, 1)",
      background: "hsl(222.2 47.4% 11.2%)",
      muted: "hsl(215 20.2% 65.1%)",
      link: "hsl(217.2 91.2% 59.8%)",
    },
  };

  const currentColors = colors[theme] || colors.dark;
  const portfolioUrl = "Carl-Maurits von Schantz Portfolio";
  const welcomeMessages = ["Crafting digital experiences", "Creative designer", ""];

  // Looser pacing (slightly longer)
  useEffect(() => {
    const phase1 = setTimeout(() => setPhase(1), 900);
    const phase2 = setTimeout(() => setPhase(2), 1900);
    const phase3 = setTimeout(() => setPhase(3), 2900);
    const complete = setTimeout(() => {
      setExitAnimation(true);
      // allow exit animation to breathe
      setTimeout(onWelcomeComplete, 1100);
    }, 5600);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
      clearTimeout(complete);
    };
  }, [onWelcomeComplete]);

  // Type out the line with a slightly slower cadence
  useEffect(() => {
    if (phase >= 2) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i <= portfolioUrl.length) {
          setTypedText(portfolioUrl.substring(0, i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 45);
      return () => clearInterval(typingInterval);
    }
  }, [phase]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.15 },
    },
    exit: {
      y: "-8vh",
      opacity: 0,
      scale: 0.98,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const contentVariants = {
    hidden: { y: 28, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const underlineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const cursorVariants = {
    blinking: {
      opacity: [0, 0, 1, 1],
      transition: { duration: 1, repeat: Infinity, repeatDelay: 0 },
    },
  };

  // Prevent background scroll while welcome is visible
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div
        className="
          h-full w-full
          flex items-center justify-center
          px-6 md:px-10
          py-10 md:py-16
        "
        style={{ backgroundColor: currentColors.background }}
        variants={containerVariants}
        initial="hidden"
        animate={exitAnimation ? "exit" : "visible"}
      >
        {/* Ambient blobs */}
        <motion.div className="absolute inset-0 -z-10 overflow-hidden opacity-25">
          <motion.div
            className="absolute top-[18%] left-[18%] w-40 h-40 md:w-72 md:h-72 rounded-full blur-[60px] md:blur-[110px]"
            style={{
              background: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
            }}
            animate={{ x: [0, 26, 0], y: [0, -36, 0] }}
            transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[35%] right-[18%] w-44 h-44 md:w-80 md:h-80 rounded-full blur-[70px] md:blur-[130px]"
            style={{
              background: `linear-gradient(to right, ${currentColors.secondary}, #ec4899)`,
            }}
            animate={{ x: [0, -34, 0], y: [0, 44, 0] }}
            transition={{ duration: 21, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.div>

        <div className="w-full max-w-3xl lg:max-w-4xl mx-auto text-center">
          <motion.div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
            {/* Top pill */}
            {phase >= 0 && (
              <motion.div variants={contentVariants}>
                <motion.div
                  className="
                    inline-flex items-center gap-2
                    text-xs sm:text-sm md:text-base
                    font-mono
                    px-4 md:px-5
                    py-2 md:py-2.5
                    rounded-full border
                    mb-1 sm:mb-2 md:mb-3
                  "
                  style={{
                    color: currentColors.primary,
                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                    borderColor: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
                  }}
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Sparkles className="h-4 w-4" />
                  {welcomeMessages[phase % welcomeMessages.length]}
                </motion.div>
              </motion.div>
            )}

            {/* Headline */}
            {phase >= 1 && (
              <motion.h1
                className="
                  text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                  font-extrabold
                  tracking-tight
                  leading-[1.15] sm:leading-[1.12] md:leading-[1.08] lg:leading-[1.06]
                  px-2
                "
                style={{ color: currentColors.primary }}
                variants={contentVariants}
              >
                <span className="inline-block">Hello</span>
                <motion.span
                  className="inline-block ml-2 sm:ml-3 relative"
                  style={{ color: currentColors.secondary }}
                  variants={contentVariants}
                >
                  There&nbsp;!
                  <motion.span
                    className="absolute -bottom-1 sm:-bottom-2 left-0 h-0.5 sm:h-1 w-full"
                    style={{ backgroundColor: currentColors.secondary }}
                    variants={underlineVariants}
                  />
                </motion.span>
              </motion.h1>
            )}

            {/* Typed line + subcopy */}
            {phase >= 2 && (
              <motion.div
                className="
                  max-w-3xl mx-auto
                  text-base sm:text-lg md:text-xl lg:text-2xl
                  leading-relaxed md:leading-[1.75]
                  font-light
                  px-4
                "
                style={{ color: currentColors.muted }}
                variants={contentVariants}
              >
                <motion.div
                  className="
                    mt-6 sm:mt-7 md:mt-8
                    font-mono
                    text-sm sm:text-base md:text-lg
                    flex justify-center items-center
                  "
                  style={{ color: currentColors.link }}
                >
                  {typedText}
                  {phase >= 2 && (
                    <motion.span
                      className="ml-1 h-5 sm:h-6 md:h-7 w-0.5 sm:w-1 inline-block"
                      style={{ backgroundColor: currentColors.link }}
                      variants={cursorVariants}
                      animate="blinking"
                    />
                  )}
                </motion.div>

                <motion.p
                  className="mt-3 sm:mt-4 md:mt-5 text-xs sm:text-sm md:text-base opacity-90"
                  style={{ color: currentColors.muted }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  (This is my portfolio website)
                </motion.p>
              </motion.div>
            )}

            {/* Footer pulse */}
            {phase >= 3 && (
              <motion.div className="pt-6 sm:pt-8 md:pt-10" variants={contentVariants}>
                <motion.div
                  className="h-2 sm:h-2.5 w-20 sm:w-24 rounded-full mx-auto"
                  style={{ backgroundColor: currentColors.secondary + "80" }}
                  animate={{ scaleX: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                <motion.p
                  className="mt-3 sm:mt-4 text-xs sm:text-sm opacity-75"
                  style={{ color: currentColors.muted }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Loading my best work for you…
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;

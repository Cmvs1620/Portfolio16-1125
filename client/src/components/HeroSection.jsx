// src/components/HeroSection.jsx
// Targeted Ads stat cards (no numbers) + easy title spacing controls.

import React from "react";
import {
  MousePointerClick,
  Briefcase,
  TrendingUp,
  Download,
  Target,
  Lightbulb,
  Rocket,
  BarChart,
} from "lucide-react";
import { motion } from "framer-motion";
import Hero3D from "./Hero3D";

/* ──────────────────────────────────────────────────────────
   ✅ ONLY CHANGE THIS to swap your 3D object
   Put your Google/Firebase/Storage "direct .glb file link" here.
────────────────────────────────────────────────────────── */
const HERO_MODEL_URL =
  "https://storage.cloud.google.com/portfoli/torus3.glb";

/* ──────────────────────────────────────────────────────────
   TYPOGRAPHY KNOBS — tweak here only
────────────────────────────────────────────────────────── */
// Smaller value = tighter gap between the two lines
const TITLE_LINE_GAP = "clamp(0.12rem, 0.8vw, 0.5rem)";
// Lower value = tighter overall H1 leading
const TITLE_LINE_HEIGHT = 0.9;

/* Regular React error boundary outside the Canvas */
class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[HeroSection] render error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <section className="min-h-[60vh] grid place-items-center px-6">
          <div className="px-4 py-3 text-xs rounded-md border bg-background/80 backdrop-blur-sm">
            <span className="font-semibold">Hero error:</span>{" "}
            {String(this.state.error?.message || this.state.error)}
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

function HeroSection() {
  const handleViewResume = () =>
    window.open("/Carl-Maurits-Resume.pdf", "_blank", "noopener,noreferrer");

  // ── Targeted Ads stat set (NO NUMBERS)
  const stats = [
    { icon: <Target className="h-4 w-4" />, label: "Data-Driven Strategy" },
    { icon: <Lightbulb className="h-4 w-4" />, label: "Creative Concepts" },
    { icon: <Rocket className="h-4 w-4" />, label: "Launch & Scale" },
    { icon: <BarChart className="h-4 w-4" />, label: "Measurable Results" },
  ];

  return (
    <SectionErrorBoundary>
      <section
        id="hero"
        className="
          relative
          min-h-screen
          flex
          items-start lg:items-center
          justify-center
          px-6 sm:px-8 lg:px-10
          pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-24 lg:pb-24
          overflow-hidden
          bg-gradient-to-br from-background via-background/95 to-primary/10
        "
      >
        {/* MAIN CONTENT */}
        <div className="container max-w-6xl mx-auto w-full">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* LEFT */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0 space-y-6 md:space-y-8">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm"
                variants={itemVariants}
              >
                <Briefcase className="h-4 w-4" />
                <span>Hello and welcome!</span>
              </motion.div>

              {/* TITLE with spacing knobs */}
              <motion.h1
                className="
                  text-[2.35rem] sm:text-5xl md:text-6xl
                  font-extrabold
                  tracking-[0.03em]
                  uppercase
                "
                style={{ lineHeight: TITLE_LINE_HEIGHT }}
                variants={itemVariants}
              >
                {/* Line 1 */}
                <span
                  className="block text-foreground"
                  style={{ marginBottom: TITLE_LINE_GAP }}
                >
                  Carl-Maurits
                </span>

                {/* Line 2 */}
                <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Creative
                </span>
              </motion.h1>

              <motion.p
                className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1 sm:mt-2 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                variants={itemVariants}
              >
                Where form meets feeling <br />
                <span className="text-primary font-semibold">
                  Design Matters
                </span>
              </motion.p>

              {/* ── Targeted Ads stat cards (no numbers) */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6 sm:my-8"
                variants={itemVariants}
              >
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="text-center p-4 sm:p-6 rounded-2xl bg-background/60 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border/60">
                        {s.icon}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {s.label}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                variants={itemVariants}
              >
                <motion.a
                  href="#projects"
                  className="group relative overflow-hidden px-7 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>View Projects</span>
                  <TrendingUp className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </motion.a>

                <motion.button
                  onClick={handleViewResume}
                  className="group relative overflow-hidden px-6 py-3 rounded-xl font-semibold border border-border text-muted-foreground hover:border-primary/30 transition-all duration-300 bg-background/60 backdrop-blur-sm text-sm flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Download className="h-4 w-4" />
                  <span>View Resume</span>
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT (3D) */}
            <motion.div
              className="flex-1 flex justify-center lg:justify-end w-full mt-8 lg:mt-0"
              variants={itemVariants}
            >
              <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
                <Hero3D
                  model={{
                    src: HERO_MODEL_URL, // ✅ swap object by changing this const above
                    scale: 0.9,
                    position: [0, -0.28, 0],
                    rotation: [0, Math.PI * 0.0, 0],
                    autoRotate: { enabled: true, speed: 0.95, axis: "y" },
                  }}
                  environment="city"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* SCROLL HINT */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, 6, 0, -6] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
        >
          <motion.div
            className="text-[0.7rem] sm:text-xs text-primary mb-3 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <MousePointerClick className="h-3 w-3" />
            <span>Explore Portfolio</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 border-2 border-primary/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>
    </SectionErrorBoundary>
  );
}

export { HeroSection };
export default HeroSection;

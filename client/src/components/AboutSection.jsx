import React, { useState, useEffect } from "react";
import {
  Sparkles,
  MapPin,
  Linkedin,
  Mail,
  Palette,
  Type,
  Film,
  LayoutGrid,
  Target,
  Briefcase,
  Instagram,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

function AboutSectionInner() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const AVATAR_SRC = "/cmvspic.png"; // PLACEHOLDER (restored per request)

  const PROFILE = {
    name: "Carl-Maurits von Schantz",
    location: "Stockholm, Sweden · Sverige",
    paragraph: (
      <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed text-left space-y-4">
       I design with purpose — translating strategy into form through type, rhythm, and motion. Every detail is intentional, every choice rooted in meaning. My work begins with a clear objective: to create design that endures beyond a first impression and communicates with lasting clarity.
         <br />
        <br />
My approach has been shaped by experience across disciplines — from fashion to digital design — and by living in places like Paris, Sweden, and Spain.
        <br />
        <br />
         Each culture and industry has influenced how I think about aesthetics, function, and emotion — how design behaves, not just how it looks.
For me, design is intent made visible. It guides, informs, and connects in ways words alone cannot.
        <br />
        <br />
        I work where precision meets personality — where systems tell stories, and emotion brings purpose to form.
      </p>
    ),
  };

  const PILLARS = [
    { icon: <Palette className="h-5 w-5" />, label: "Brand Identity" },
    { icon: <LayoutGrid className="h-5 w-5" />, label: "Art Direction" },
    { icon: <Type className="h-5 w-5" />, label: "Typography" },
    { icon: <Film className="h-5 w-5" />, label: "CTR Targeted Ads" },
  ];

  const APPROACH = [
    {
      title: "Discover",
      copy:
        "Immerse in brand and audience. Define the feeling, not just the features. Identify story, tone, and visual edges.",
      icon: <Target className="h-4 w-4 text-primary" />,
    },
    {
      title: "Design",
      copy:
        "Build a visual system—type, rhythm, color, composition. Create assets that scale across formats and screens.",
      icon: <Palette className="h-4 w-4 text-primary" />,
    },
    {
      title: "Targeted",
      copy:
        "Translate design into measurable outcomes — crafting visuals that increase engagement, clarity, and conversion.",
      icon: <Briefcase className="h-4 w-4 text-primary" />,
    },
  ];

  const IMPACT = [
    "Distilled complex products into clear visual narratives.",
    "Defined typographic and motion systems for consistency & feel.",
    "Bridged creative and production for faster, higher-quality delivery.",
    "Elevated brand presence across web, social, and product surfaces.",
  ];

  // ====== CONTACT / EMAIL ======
  const EMAIL = "Maurits.vonschantz@gmail.com";
  const SUBJECT = "Portfolio inquiry";
  const BODY =
    "Hi Carl-Maurits,%0D%0A%0D%0AI’m reaching out about your work.%0D%0A%0D%0ABest,%0D%0A";
  const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${BODY}`;

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (!el) return;
    // Use Lenis if present, else native smooth scroll
    // @ts-ignore
    const lenis = window?.lenis || window?.Lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(el, { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEmailClick = (e) => {
    e.preventDefault();
    // Trigger the user's default mail client
    window.location.href = MAILTO;

    // If the tab stays visible (no mail app took focus), guide user to contact
    setTimeout(() => {
      if (document.visibilityState === "visible") {
        scrollToContact();
      }
    }, 350);
  };

  const SOCIALS = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/mauritsvonschantz",
      icon: <Instagram className="h-5 w-5" />,
      external: true,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/carl-maurits-von-schantz",
      icon: <Linkedin className="h-5 w-5" />,
      external: true,
    },
    // Email handled specially in the render for reliability
    {
      label: "Email",
      href: MAILTO,
      icon: <Mail className="h-5 w-5" />,
      email: true,
    },
  ];

  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="about"
      className="relative py-16 md:py-28 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden"
      aria-label="About me / Om mig"
    >
      {/* Grain Overlay — resilient loader: try src/assets first, fall back to public `/assets` path */}
      {(() => {
        let grainUrl;
        try {
          // Prefer a build-time import if the texture is present under src/assets
          grainUrl = new URL(`../assets/textures/grain-light.png`, import.meta.url).href;
        } catch (e) {
          // Fallback to the public folder path (served at runtime)
          grainUrl = "/assets/textures/grain-light.png";
        }

        return (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
            style={{
              backgroundImage: grainUrl ? `url('${grainUrl}')` : undefined,
              backgroundSize: "auto",
            }}
          />
        );
      })()}

      {/* Background Motion */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-primary/5 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            transform: `translate(${mouse.x * 0.02}px, ${mouse.y * 0.02}px)`,
          }}
        />
        <div
          className="absolute w-60 sm:w-80 h-60 sm:h-80 bg-secondary/5 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            transform: `translate(${mouse.x * -0.03}px, ${mouse.y * -0.03}px)`,
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 px-2 sm:px-6">
          <motion.h1
            {...fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
          >
            About — Carl-Maurits
          </motion.h1>

          <motion.div
            {...fadeUp}
            transition={{ delay: 0.08 }}
            className="mt-4 inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-primary/10 border border-primary/20 transition-all duration-500 hover:bg-primary/15 hover:scale-105 group"
          >
            <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
            <span className="text-sm sm:text-base font-medium text-primary tracking-wide">
              About me
            </span>
          </motion.div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* LEFT CARD */}
          <motion.div
            {...fadeUp}
            className="bg-card/50 border border-border rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:border-primary/40 hover:bg-card/60"
          >
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl md:text-[1.6rem] font-medium tracking-tight text-foreground">
                {PROFILE.name}
              </h2>
              <div className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{PROFILE.location}</span>
              </div>
            </div>

            <div className="mt-5 md:mt-6 flex flex-col md:flex-row items-start gap-6 md:gap-8">
              <div className="relative flex-shrink-0 group transition-all duration-700 ease-out">
                <div className="relative w-[7.5rem] sm:w-[8.5rem] md:w-[9rem] rounded-2xl overflow-hidden border-4 border-primary/20 shadow-2xl">
                  <img
                    src={AVATAR_SRC}
                    alt="Portrait of Carl-Maurits von Schantz"
                    className="w-full h-full object-cover object-center transition-transform duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4">
                {PILLARS.map((p, i) => (
                  <div
                    key={i}
                    className="p-3 sm:p-4 rounded-xl bg-background/50 border border-border text-left transition-all duration-300 hover:scale-[1.02] hover:border-primary/30"
                  >
                    <div className="flex items-center gap-2 text-foreground">
                      {p.icon}
                      <div className="text-sm sm:text-base font-medium">{p.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {PROFILE.paragraph}
          </motion.div>

          {/* RIGHT CARD — FIXED for light/dark */}
          <motion.div
            {...fadeUp}
            className="bg-card/50 border border-border rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:border-primary/40 hover:bg-card/60"
          >
            {/* Approach */}
            <h3 className="text-lg sm:text-2xl font-medium mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-left text-foreground">
              <Briefcase className="h-4 sm:h-6 w-4 sm:w-6 text-primary" />
              Approach
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
              {APPROACH.map((step, i) => (
                <div
                  key={i}
                  className="bg-background/50 border border-border rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 hover:border-primary/30 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      {step.icon}
                    </span>
                    {step.title}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>

            {/* Impact */}
            <h3 className="text-lg sm:text-2xl font-medium mt-8 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-left text-foreground">
              <Target className="h-4 sm:h-6 w-4 sm:w-6 text-primary" />
              Impact
            </h3>
            <ul className="space-y-2 text-left">
              {IMPACT.map((line, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/70" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* Socials */}
            <div className="mt-8 p-3 sm:p-4 bg-background/50 rounded-xl border border-border text-center">
              <h4 className="font-medium mb-2 text-sm sm:text-base text-foreground">
                Quick connect
              </h4>
              <div className="flex justify-center gap-4">
                {SOCIALS.map((s, i) =>
                  s.email ? (
                    // Email: use a button to ensure onClick works across browsers
                    <button
                      key={i}
                      type="button"
                      onClick={handleEmailClick}
                      className="p-2 bg-background rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                      aria-label={s.label}
                      title={EMAIL}
                    >
                      {s.icon}
                    </button>
                  ) : (
                    <a
                      key={i}
                      href={s.href}
                      className="p-2 bg-background rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                      target={s.external ? "_blank" : undefined}
                      rel={s.external ? "noopener noreferrer" : undefined}
                      aria-label={s.label}
                      title={s.label}
                    >
                      {s.icon}
                    </a>
                  )
                )}
              </div>

              {/* Optional helper link to jump down */}
              <button
                type="button"
                onClick={scrollToContact}
                className="mt-3 text-xs underline underline-offset-4 text-muted-foreground hover:text-primary transition"
              >
                Go to contact section
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export const AboutSection = AboutSectionInner;
export default AboutSectionInner;

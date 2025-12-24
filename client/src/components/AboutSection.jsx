// src/components/AboutSection.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  const reduce = useReducedMotion();

  // ====== PLACEHOLDER AVATAR ======
  // TODO(Carl-Maurits): Replace with your own image
  const AVATAR_SRC =
    "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/cmvspic.png";

  // ====== CONTENT ======
  const PROFILE = useMemo(
    () => ({
      name: "Carl-Maurits von Schantz",
      location: "Stockholm, Sweden · Sverige",
      paragraph: (
        <div className="mt-6 sm:mt-8 space-y-4 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed text-left">
          <p>
            I design with a clear purpose. I turn ideas and strategy into visual
            form using typography, layout, and motion. Every detail is
            considered, and every choice is made for a reason.
          </p>
          <p>
            My goal is to create design that lasts and communicates clearly —
            not just something that looks good at first glance.
          </p>
          <p>
            My approach comes from working across different fields, from fashion
            to digital design, and from living in places like Paris, Sweden, and
            Spain. These experiences have shaped how I think about design — how
            it should work, how it should feel, and how people interact with it.
          </p>
        </div>
      ),
    }),
    []
  );

  const PILLARS = useMemo(
    () => [
      { icon: <Palette className="h-5 w-5" />, label: "Brand Identity" },
      { icon: <LayoutGrid className="h-5 w-5" />, label: "Art Direction" },
      { icon: <Type className="h-5 w-5" />, label: "Typography" },
      { icon: <Film className="h-5 w-5" />, label: "CTR Targeted Ads" },
    ],
    []
  );

  const APPROACH = useMemo(
    () => [
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
    ],
    []
  );

  const IMPACT = useMemo(
    () => [
      "Distilled complex products into clear visual narratives.",
      "Defined typographic and motion systems for consistency & feel.",
      "Bridged creative and production for faster, higher-quality delivery.",
      "Elevated brand presence across web, social, and product surfaces.",
    ],
    []
  );

  // ====== CONTACT / EMAIL ======
  const EMAIL = "Maurits.vonschantz@gmail.com";
  const SUBJECT = "Portfolio inquiry";
  const BODY =
    "Hi Carl-Maurits,%0D%0A%0D%0AI’m reaching out about your work.%0D%0A%0D%0ABest,%0D%0A";
  const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
    SUBJECT
  )}&body=${BODY}`;

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (!el) return;

    // Use Lenis if present, else native smooth scroll
    // @ts-ignore
    const lenis = window?.lenis || window?.Lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(el, {
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEmailClick = (e) => {
    e.preventDefault();
    window.location.href = MAILTO;

    setTimeout(() => {
      if (document.visibilityState === "visible") scrollToContact();
    }, 350);
  };

  const SOCIALS = useMemo(
    () => [
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
      {
        label: "Email",
        href: MAILTO,
        icon: <Mail className="h-5 w-5" />,
        email: true,
      },
    ],
    [MAILTO]
  );

  // ====== MOBILE / PERF FRIENDLY BACKGROUND MOTION ======
  // - Only track mouse on devices that have a fine pointer (desktop)
  // - On touch devices, keep the background subtle & static (saves battery / feels calmer)
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setHasFinePointer(!!mq.matches);
    update();

    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  useEffect(() => {
    if (!hasFinePointer || reduce) return;

    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setMouse({ x: e.clientX, y: e.clientY })
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [hasFinePointer, reduce]);

  // ====== MOTION VARIANTS (better rhythm) ======
  const fadeUp = {
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const stagger = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: reduce ? 0 : 0.06,
        delayChildren: reduce ? 0 : 0.04,
      },
    },
  };

  // ====== GRAIN OVERLAY URL (resilient) ======
  const grainUrl = useMemo(() => {
    try {
      return new URL(`../assets/textures/grain-light.png`, import.meta.url).href;
    } catch (e) {
      return "/assets/textures/grain-light.png";
    }
  }, []);

  return (
    <section
      id="about"
      aria-label="About me / Om mig"
      className="
        relative overflow-hidden
        py-14 sm:py-16 md:py-24 lg:py-28
        px-4 sm:px-6 lg:px-12
        bg-gradient-to-br from-background via-background to-primary/5
      "
      style={{
        // Better iOS safe-area behavior without requiring extra libs
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      {/* Grain Overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.075] mix-blend-soft-light"
        style={{
          backgroundImage: grainUrl ? `url('${grainUrl}')` : undefined,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      />

      {/* Soft Background Motion (desktop only) */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="
            absolute -top-10 -left-10
            h-72 w-72 sm:h-96 sm:w-96
            rounded-full blur-3xl
            bg-primary/6
            will-change-transform
            transition-transform duration-[1400ms] ease-out
          "
          style={{
            transform:
              hasFinePointer && !reduce
                ? `translate3d(${mouse.x * 0.02}px, ${mouse.y * 0.02}px, 0)`
                : "translate3d(0,0,0)",
          }}
        />
        <div
          className="
            absolute -bottom-10 -right-10
            h-64 w-64 sm:h-80 sm:w-80
            rounded-full blur-3xl
            bg-secondary/6
            will-change-transform
            transition-transform duration-[1400ms] ease-out
          "
          style={{
            transform:
              hasFinePointer && !reduce
                ? `translate3d(${mouse.x * -0.03}px, ${mouse.y * -0.03}px, 0)`
                : "translate3d(0,0,0)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 px-1 sm:px-6">
          <motion.h1
            {...fadeUp}
            className="
              font-medium tracking-tight
              text-[clamp(2.05rem,4.3vw,3.75rem)]
              leading-[1.05]
              bg-gradient-to-r from-foreground to-primary
              bg-clip-text text-transparent
            "
          >
            About — Carl-Maurits
          </motion.h1>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.animate.transition, delay: reduce ? 0 : 0.08 }}
            className="
              mt-4 inline-flex items-center gap-3
              rounded-2xl border border-primary/20
              bg-primary/10 px-4 sm:px-6 py-2.5 sm:py-3
              transition-all duration-500
              hover:bg-primary/15 hover:scale-[1.02]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
            "
          >
            <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
            <span className="text-sm sm:text-base font-medium text-primary tracking-wide">
              About me · Om mig
            </span>
          </motion.div>

          <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
            Minimal · Cinematic · Clear
          </p>
        </div>

        {/* Layout */}
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
        >
          {/* LEFT CARD */}
          <motion.div
            variants={fadeUp}
            className="
              rounded-3xl border border-border
              bg-card/50 backdrop-blur-xl
              p-5 sm:p-7 md:p-8
              shadow-2xl
              transition-all duration-500
              hover:bg-card/60 hover:border-primary/35
            "
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

            {/* Avatar + Pillars */}
            <div className="mt-5 md:mt-6 flex flex-col md:flex-row items-start gap-6 md:gap-8">
              <div className="relative flex-shrink-0">
                <div
                  className="
                    relative overflow-hidden rounded-2xl
                    w-[7.25rem] sm:w-[8.25rem] md:w-[9rem]
                    border border-primary/25 shadow-2xl
                    bg-background/40
                  "
                >
                  <img
                    src={AVATAR_SRC}
                    alt="Portrait of Carl-Maurits von Schantz"
                    className="
                      block w-full h-full object-cover object-center
                      transition-transform duration-[1600ms]
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      hover:scale-[1.05]
                    "
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4">
                {PILLARS.map((p, i) => (
                  <div
                    key={i}
                    className="
                      rounded-xl border border-border
                      bg-background/45
                      p-3 sm:p-4
                      text-left
                      transition-all duration-300
                      hover:scale-[1.01] hover:border-primary/30
                      focus-within:ring-2 focus-within:ring-primary/30
                    "
                  >
                    <div className="flex items-center gap-2 text-foreground">
                      {p.icon}
                      <div className="text-sm sm:text-base font-medium leading-tight">
                        {p.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {PROFILE.paragraph}
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div
            variants={fadeUp}
            className="
              rounded-3xl border border-border
              bg-card/50 backdrop-blur-xl
              p-5 sm:p-7 md:p-8
              shadow-2xl
              transition-all duration-500
              hover:bg-card/60 hover:border-primary/35
            "
          >
            {/* Approach */}
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg sm:text-2xl font-medium flex items-center gap-2 sm:gap-3 text-left text-foreground">
                <Briefcase className="h-4 sm:h-6 w-4 sm:w-6 text-primary" />
                Approach
              </h3>

              {/* Small bilingual microcopy */}
              <span className="hidden sm:inline text-xs text-muted-foreground">
                Steps · Steg
              </span>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
              {APPROACH.map((step, i) => (
                <div
                  key={i}
                  className="
                    rounded-2xl border border-border
                    bg-background/45
                    p-4 sm:p-5
                    transition-all duration-300
                    hover:border-primary/30 hover:scale-[1.01]
                  "
                >
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      {step.icon}
                    </span>
                    <span className="text-sm sm:text-base">{step.title}</span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>

            {/* Impact */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <h3 className="text-lg sm:text-2xl font-medium flex items-center gap-2 sm:gap-3 text-left text-foreground">
                <Target className="h-4 sm:h-6 w-4 sm:w-6 text-primary" />
                Impact
              </h3>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                Results · Resultat
              </span>
            </div>

            <ul className="mt-4 sm:mt-6 space-y-2 text-left">
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
            <div className="mt-8 rounded-2xl border border-border bg-background/45 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <h4 className="font-medium text-sm sm:text-base text-foreground">
                  Quick connect
                </h4>
                <span className="text-xs text-muted-foreground">· Snabb kontakt</span>
              </div>

              <div className="mt-3 flex justify-center gap-3">
                {SOCIALS.map((s, i) =>
                  s.email ? (
                    <button
                      key={i}
                      type="button"
                      onClick={handleEmailClick}
                      className="
                        inline-flex items-center justify-center
                        h-10 w-10 rounded-xl
                        border border-border bg-background/60
                        text-muted-foreground
                        transition-all duration-300
                        hover:text-primary hover:border-primary/30 hover:bg-primary/10 hover:scale-[1.03]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                      "
                      aria-label={s.label}
                      title={EMAIL}
                    >
                      {s.icon}
                    </button>
                  ) : (
                    <a
                      key={i}
                      href={s.href}
                      className="
                        inline-flex items-center justify-center
                        h-10 w-10 rounded-xl
                        border border-border bg-background/60
                        text-muted-foreground
                        transition-all duration-300
                        hover:text-primary hover:border-primary/30 hover:bg-primary/10 hover:scale-[1.03]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                      "
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

              <button
                type="button"
                onClick={scrollToContact}
                className="
                  mt-3 text-xs underline underline-offset-4
                  text-muted-foreground hover:text-primary transition
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                "
              >
                Go to contact
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export const AboutSection = AboutSectionInner;
export default AboutSectionInner;

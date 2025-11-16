// src/components/SkillsSection.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ===========================================================
   Robust icon loader (no alias, no static imports)
   If a file is misnamed/missing, we gracefully fallback.
=========================================================== */
const iconUrl = (filename) => {
  try {
    // icons live at: src/assets/icons/<filename>
    return new URL(`../assets/icons/${filename}`, import.meta.url).href;
  } catch {
    return undefined;
  }
};

/* ===== ICON MAPPING (key → file) ===== */
const iconImages = {
  // Design & Direction
  figma: iconUrl("figma.png"),
  photoshop: iconUrl("photoshop.png"),
  illustrator: iconUrl("illustrator.png"),
  indesign: iconUrl("indesign.png"),

  // Motion & Video
  aftereffects: iconUrl("aftereffects.png"),
  premiere: iconUrl("premiere.png"),
  blender: iconUrl("blender.png"),

  // Color & Finishing
  davinci: iconUrl("davinci.png"),

  // Marketing & Ads
  meta: iconUrl("meta.png"),
  snapads: iconUrl("snapads.png"),


  // AI & Emerging
  midjourney: iconUrl("midjourney.png"),
  bambulabs: iconUrl("bambulabs.png"),
  nanobanana: iconUrl("nanobanana.png"),

  // Interactive / Dev & CMS
  react: iconUrl("react.png"),
  sanity: iconUrl("sanity.png"),
  shopify: iconUrl("shopify.png"),
  threejs: iconUrl("threejs.png"), // <- this was throwing; URL loader is resilient

  // Collaboration / Management
  notion: iconUrl("notion.png"),
  slides: iconUrl("slides.png"),
  jira: iconUrl("jira.png"),
  trello: iconUrl("trello.png"),
};

/* ===== SKILLS DATA ===== */
const skills = [
  // Design & Direction
  { name: "Figma", level: 95, category: "design", icon: "figma" },
  { name: "Photoshop", level: 95, category: "design", icon: "photoshop" },
  { name: "Illustrator", level: 95, category: "design", icon: "illustrator" },
  { name: "InDesign", level: 90, category: "design", icon: "indesign" },

  // Motion & Video
  { name: "After Effects", level: 90, category: "motion", icon: "aftereffects" },
  { name: "Premiere Pro", level: 72, category: "motion", icon: "premiere" },
  { name: "Blender", level: 60, category: "motion", icon: "blender" },

  // Color & Finishing
  { name: "DaVinci Resolve", level: 45, category: "color", icon: "davinci" },

  // Marketing & Ads
  { name: "Meta Ads Manager", level: 85, category: "marketing", icon: "meta" },
  { name: "Snapchat Ads", level: 80, category: "marketing", icon: "snapads" },

  // AI & New tech
  { name: "Midjourney", level: 87, category: "ai", icon: "midjourney" },
  { name: "Bambu Labs", level: 89, category: "ai", icon: "bambulabs" },
  { name: "Nanobanana", level: 85, category: "ai", icon: "nanobanana" }, 

  // Interactive / Dev & CMS
  { name: "React", level: 42, category: "interactive", icon: "react" },
  { name: "Sanity", level: 58, category: "interactive", icon: "sanity" },
  { name: "Shopify", level: 62, category: "interactive", icon: "shopify" },
  { name: "Three.js", level: 30, category: "interactive", icon: "threejs" },

  // Collaboration / Management
  { name: "Notion", level: 72, category: "collab", icon: "notion" },
  { name: "Google Slides", level: 85, category: "collab", icon: "slides" },
  { name: "Jira", level: 75, category: "collab", icon: "jira" },
  { name: "Trello", level: 95, category: "collab", icon: "trello" },
];


/* ===== CATEGORIES ===== */
const categories = [
  { id: "all", label: "All Tools", color: "bg-gradient-to-r from-primary to-purple-600" },
  { id: "design", label: "Design & Direction", color: "bg-primary/15 text-primary border border-primary/25" },
  { id: "motion", label: "Motion & Video", color: "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-400/20" },
  { id: "color", label: "Color & Finishing", color: "bg-amber-500/10 text-amber-400 border border-amber-400/20" },
  { id: "marketing", label: "Marketing & Ads", color: "bg-pink-500/10 text-pink-400 border border-pink-400/20" },
  { id: "ai", label: "AI & New tech", color: "bg-blue-500/10 text-blue-400 border border-blue-400/20" },
  { id: "interactive", label: "Interactive / Dev", color: "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20" },
  { id: "collab", label: "Collaboration", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20" },
];

/* ===== UI HELPERS ===== */
const LetterBadge = ({ name }) => (
  <div className="w-12 h-12 rounded-full bg-card border-2 border-primary/50 grid place-items-center">
    <span className="font-bold text-sm">{name?.[0]?.toUpperCase() ?? "?"}</span>
  </div>
);

const ToolIcon = ({ iconKey, name, size = 24 }) => {
  const src = iconImages[iconKey];
  return src ? (
    <div className="w-12 h-12 rounded-full bg-card border-2 border-primary/50 grid place-items-center">
      <img src={src} alt={name} className="w-6 h-6 object-contain" width={size} height={size} />
    </div>
  ) : (
    <LetterBadge name={name} />
  );
};

const SkillBar = ({ level }) => (
  <div className="w-full h-3 bg-secondary/20 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${level}%` }}
      transition={{ duration: 1.2, delay: 0.15 }}
      className={`h-full rounded-full ${
        level > 75
          ? "bg-gradient-to-r from-green-400 to-emerald-500"
          : level > 50
          ? "bg-gradient-to-r from-yellow-400 to-amber-500"
          : "bg-gradient-to-r from-red-400 to-pink-500"
      }`}
    />
  </div>
);

/* ===== MARQUEE ===== */
const InfiniteScrollSkills = ({ items }) => {
  const dup = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden py-8">
      <motion.div
        className="flex gap-8 mb-8"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {dup.map((skill, i) => (
          <div key={`${skill.name}-${i}`} className="flex-shrink-0 flex flex-col items-center gap-2">
            <ToolIcon iconKey={skill.icon} name={skill.name} />
            <span className="text-sm font-medium text-center">{skill.name}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="flex gap-8"
        animate={{ x: ["-100%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...dup].reverse().map((skill, i) => (
          <div key={`${skill.name}-rev-${i}`} className="flex-shrink-0 flex flex-col items-center gap-2">
            <ToolIcon iconKey={skill.icon} name={skill.name} />
            <span className="text-sm font-medium text-center">{skill.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ===== MAIN ===== */
export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const filtered = skills.filter((s) => activeCategory === "all" || s.category === activeCategory);

  return (
    <section id="skills" className="py-28 px-4 bg-gradient-to-br from-background via-secondary/5 to-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Creative Suite
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            My core tools across design, motion, color, marketing, AI, and delivery.
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((c) => {
            const active = activeCategory === c.id;
            return (
              <motion.button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-6 py-2.5 rounded-full font-medium border transition-all ${
                  active
                    ? `${c.color}`
                    : "bg-secondary/50 text-foreground border-border/40 hover:bg-secondary/70"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {c.label}
              </motion.button>
            );
          })}
        </div>

        {activeCategory === "all" ? (
          <InfiniteScrollSkills items={skills} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((skill) => (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card p-6 rounded-2xl border border-border/30 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg group"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <ToolIcon iconKey={skill.icon} name={skill.name} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {skill.name}
                        </h3>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            skill.level > 75
                              ? "bg-emerald-500/10 text-emerald-500"
                              : skill.level > 50
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-pink-500/10 text-pink-500"
                          }`}
                        >
                          {skill.level}%
                        </span>
                      </div>
                      <SkillBar level={skill.level} />
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>Basic</span>
                        <span>Advanced</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;

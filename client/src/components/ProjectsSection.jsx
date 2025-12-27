// src/components/ProjectsSection.jsx
// NOTE: projects array and all links kept EXACTLY as you provided.

import React, { useRef, useState } from "react";
import { ArrowRight, ChevronUp, Star, Sparkles, Eye, MapPin } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ProjectDetailsModal from "./ProjectDetails";

/* ---------------------------------------------------------
   CONTENT — edit per project:
   - title, description, details, highlights, tags, location  ← NEW
   - image (card hero), gallery (modal)
   - accentColor (bottom gradient bar)
   - Supports nested media under /public/projects/
   - NEW: description/details support <br> and multi-line text
--------------------------------------------------------- */

// Same normalize helper here so cards can also show line breaks.
const normalizeText = (t) =>
  String(t ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

// NOTE: Fill in correct locations per project.
// TODO(Carl-Maurits): Replace any placeholder locations with real ones.
const projects = [
  // ====== PAF ======
  {
    id: 8,
    title: "Paf",
    category: "Design · Gaming",
    location: "Stockholm, Sweden", // TODO(Carl-Maurits): adjust
    description:
      "Graphic designer & digital content creator for Paf (Swedish market) under a multibrand strategy.",
    details: 
      "PAF\nDesigner\n\nAt Paf, At Paf, I work as a graphic designer and digital content creator for the Swedish market, collaborating closely with CRM and Digital Marketing teams under a multibrand strategy. I design and produce brand assets, motion graphics, and localized campaign content, translating market insights and brand direction into consistent, high-quality visuals while balancing creativity, efficiency, and tight deadlines.",
    highlights: [
      "Multibrand CRM & campaign assets",
      "Localized design & motion graphics",
      "Process + feedback loop improvements",
    ],
    tags: ["Graphic Design", "Motion", "CRM", "iGaming", "Branding"],
    image: "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/paf/bill.png",
    gallery: [
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/paf/Intropaf.gif",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/paf/3d%20copy.gif",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/paf/website2.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/paf/Apps.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/paf/bill.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/paf/gonz.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/paf/2.png",
    ],
    accentColor: "from-rose-500 to-red-600",
    demoUrl: "#"
  },

  {
    id: 7,
    title: "Givenchy",
    category: "Fashion · Luxury",
    location: "Paris, France", // TODO(Carl-Maurits): adjust
    description: "Shaping high-end footwear collections with a focus on detail, quality, and bold design.",
    details:
      "At Givenchy, my role involved contributing to the development and realization of our creative vision. This included responsibilities such as sketching, choosing material, and print renderings to meet the brand's exacting standards, as well as preparing presentation boards. This position required meticulous attention to detail and a deep understanding of luxury aesthetics. During this time, I refined my technical skills, developed a keen eye for design, and stayed updated with the latest footwear trends, seamlessly blending them with Givenchy’s timeless elegance. <br> <br> A key project during my tenure was the development of the Sharklock and Voyou footwear lines, from initial concepts to final production. I played a crucial role in mood board creation, color selection, and design detailing, helping to define the collection’s tone. Seeing my designs come to life was immensely satisfying and underscored the importance of precision and quality in luxury fashion. My experience at Givenchy was not only a professional milestone but also a transformative phase that significantly influenced my design perspective and creativity. It enhanced my expertise in high-end footwear, ignited my passion for innovation, and provided invaluable insights that continue to inspire and guide my career in fashion. With that said, here are some of the shoes I've had the pleasure of working on.",
    highlights: ["Product design", "Hands-on development", "Detail-driven craftsmanship", "Collaboration across teams"],
    tags: ["photoshop", "Leather/canvas", "nomad"],
    image: "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/amalia.png",
    gallery: [
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/amalia.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/bunny.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/cowboy.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/giv1.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/jeans.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/giv2.jpg",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/giv3.jpg",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/shark.png"
    ],
    accentColor: "from-emerald-500 to-teal-600",
    demoUrl: "https://nauracare.vercel.app"
  },
  {
    id: 6,
    title: "1X2",
    category: "Gaming",
    location: "Åland", // TODO(Carl-Maurits): add
    description: "Creating a national brand in the real money gambling industry.",
    details:
      "I led the creation of the complete brand and visual identity for 1x2, Paf’s sports-betting–focused brand. My responsibility covered the full brand lifecycle — from early positioning and conceptual direction to a fully implemented visual system across web, app, and marketing channels. <br> <br> The brand is built around the classic sports betting notation (1–X–2), intentionally leaning into clarity, heritage, and trust. Instead of casino-style hype, 1x2 is designed to feel confident, rational, and focused — targeting bettors who value odds, information, and match-day flow over entertainment-led visuals. <br> ",
    highlights: ["Lead Designer", "Multy platform coherench", "Application system"],
    tags: ["Figma", "Photoshop","Illustrator"],
    image: "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/1x2/cover.png",
    gallery: [
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/1x2/cover.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/1x2/Main.mp4",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/1x2/app.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/1x2/ATP.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/1x2/cover3%20(1).png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/1x2/LAPTOP%20WEBSITE2.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/1x2/NHL.png"
    ],
    accentColor: "from-orange-500 to-red-600",
    demoUrl: "#"
  },
  {
    id: 1,
    title: "Yono Sabo",
    category: "Restaurant",
    location: "Stockholm, Sweden", // TODO(Carl-Maurits): adjust
    description: "Clean geometry and subtle playfulness capture the energy of YONO SABO’s fusion concept.",
    details:
`Restaurant in the heart of Stockholm Welcome to YONO SABO, the vibrant heart of Stockholm where the colorful streets of Asia meet the lively spirit of Mexican street food. YONO SABO promises an unforgettable culinary journey with a unique fusion of Asian and Mexican flavors. 

Nestled in the heart of the city, we invite you to dive into an authentic feast, where every bite is a tradition reimagined with a twist. Whether you crave the spicy kicks of Mexico or the subtle spices of Asia, we have something to satisfy your cravings. Visit us for an experience as eclectic and adventurous as our menu. Let YONO SABO be your go-to place for unforgettable culinary gatherings! Our logo stands out for its simplicity and personality. The double 'O's mimic eyes, making the logo memorable and engaging. 

The well-spaced letters create a clear and balanced readability, while the minimalist style with rounded forms adds a modern touch. The logo serves both as a distinctive mark and an icon, practical for various uses. It reflects our restaurant's fusion of Asian and Mexican street food and appeals to a wide audience seeking a unique dining experience.`,
    highlights: ["Brand concept blending Asian and Mexican street food culture", "Modern, versatile mark adaptable across digital and print", "Visual identity built on simplicity, warmth, and character"],
    tags: ["Photoshop", "Branding", "aftereffects", "wordpress"],
    image: "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/yono/bag.png",
    gallery: [
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/yono/bag.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/yono/Burito.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/yono/chair.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/yono/meny.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/yono/OTTO.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/yono/shirt.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/yono/phone.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/yono/sign.png"
    ],
    accentColor: "from-purple-500 to-indigo-600",
    demoUrl: "https://yonosabo.se"
  },
  {
    id: 2,
    title: "Lundi",
    category: "Branding",
    location: "Paris", // TODO(Carl-Maurits): add
    description: "A minimal identity that mirrors Lundi’s philosophy — simple, effective, and quietly confident.",
    details:
`A Product for every day of the week In the Lundi skincare project, my goal was to create a design that showed off the brand's main ideas: simplicity, effectiveness, and a sense of new beginnings for those important Monday mornings. 

The challenge was to make the brand look fresh and clear through its packaging and advertising designs. Project Design ApproachI chose a minimalist and practical design style for Lundi. The brand is all about straightforward skincare solutions, so it was important that the design reflected this. The packaging needed to be simple yet elegant, showing how effective the product is without any fuss.Using natural textures like crumpled paper and rock formations in their visuals, I played with the contrast between the ruggedness of nature and the smooth, clean lines of their bottles. It's a nod to use of natural ingredients without getting lost in the typical "green" aesthetic.`,
    highlights: ["Minimal, functional packaging", "Natural textures", "Visual storytelling"],
    tags: ["Ads and marketing", "Graphical profile", "Product photos"],
    image: "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Lundi/gras.png",
    gallery: [
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Lundi/babapapper.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Lundi/Creme.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Lundi/gras.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Lundi/Logo.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Lundi/Melisrocks.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Lundi/rocks.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Lundi/stock.png"
    ],
    accentColor: "from-blue-500 to-cyan-600",
    demoUrl: ""
  },
  {
    id: 3,
    title: "Corniche",
    category: "Product design and marketing",
    location: "Nice, France", // TODO(Carl-Maurits): add
    description: "Design and marketing to bring products to life through visuals and digital storytelling.",
details: `During my time at Corniche, I immersed myself in a creative environment, enhancing the brand’s marketing and social media presence. 


I developed visual content, designed campaigns and been apart of the design process as well as produced digital media for various platforms. A major achievement was the "Heritage Chronograph" campaign, where I utilized Keyshot and Adobe Creative Suite to integrate artistic elements into our marketing. 
I also created fresh social media content that increased engagement and drove website traffic.

This experience taught me to navigate a high-pressure work environment while maintaining creative integrity. I honed my technical skills, improved my communication, and learned valuable lessons in time management and resilience. Overall, my time at Corniche significantly contributed to my professional growth in graphic design and marketing.`,
    highlights: ["Performance-focused design", "campaigns for digital platforms", "Heritage Chronograph marketing assets"],
    tags: ["Watchworld"],
    image: "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/corniche/cornichecover.png",
    gallery: [
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/corniche/cornichecover.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/corniche/1.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/corniche/content.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/corniche/box.jpg",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/corniche/insta1.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/corniche/sides.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/corniche/story.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/corniche/insta4.png"
    ],
    accentColor: "from-amber-500 to-orange-600",
    demoUrl: "https://blogni.vercel.app"
  },
  {
    id: 4,
    title: "Betula",
    category: "Graphical chart",
    location: "Helsinki", // TODO(Carl-Maurits): add
    description: "Betula Hotel converts unconventional locations into sustainable hotels in the middle of the city.",
    details:
      "The color palette of our visual identity is inspired by the earthy tones of nature, with shades of green and brown. The typography is simple and modern, conveying our commitment to simplicity and clarity. Our mission is to create sustainable and close to home travel guides.",
    highlights: ["Expense tracking", "Data visualization", "Budget planning"],
    tags: ["React", "Chart.js", "Node.js", "Firebase"],
    image: "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Betula/Sign2.png",
    gallery: [
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Betula/graphical.gif",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Betula/cover.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Betula/LOGO.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Betula/open1.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/Betula/Sign2.png"
    ],
    accentColor: "from-rose-500 to-pink-600",
    demoUrl: "https://spendlix.vercel.app/login"
  },
  {
    id: 5,
    title: "Dank",
    category: "branding",
    location: "Copenhagen, Denmark", // TODO(Carl-Maurits): adjust
    description: "Branding for a music festival.",
    details:
      "I worked with the team behind Dankness Festival to shape a fresh visual identity that captures the feeling of movement, sound, and community. The goal was to create something playful yet refined — where bold typography and soft, sculptural 3D forms could express the energy of the festival. From the logo to the 3D visuals, every element was designed to feel alive and connected to the atmosphere of Copenhagen’s creative scene. It was about building a world around the music — one that feels both digital and human at the same time.",
    highlights: ["Restaurant listings", "Order system", "Location services"],
    tags: ["React", "Redux", "Mapbox", "Stripe"],
    image: "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/dank/Red1.jpg",
    gallery: [
       "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/dank/glas.gif",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/dank/2.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/dank/blom.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/dank/fest.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/dank/logo.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/dank/Red1.jpg",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/dank/tshirt.png"
    ],
    accentColor: "from-violet-500 to-purple-600",
    demoUrl: "https://eattoo-food-delivery-website-frontend.onrender.com/"
  },
  {
    id: 6,
    title: "Zuru",
    category: "IOT System",
    location: "Paris", // TODO(Carl-Maurits): add
    description: "Job matching with candidate tracking.",
    details:
      "ZURU Tech, a cool and user-friendly IoT system was brought to life. The big idea? To make everyday home tasks a breeze and add a personal touch to the way we use our home gadgets.",
    highlights: ["Job matching", "Candidate tracking", "Application system"],
    tags: ["Next.js", "Figma"],
    image: "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/zuru/Screenshot%202025-12-15%20at%2022.57.24.png",
    gallery: [
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/zuru/Screenshot%202025-12-15%20at%2022.57.24.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/zuru/ipad1.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/zuru/ipad2.png",
      "https://hlzzteeryrwfhnpwhjiv.supabase.co/storage/v1/object/public/Portfolio%20test/zuru/p1.png"
    ],
    accentColor: "from-orange-500 to-red-600",
    demoUrl: "#"
  }
];

export const ProjectsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [detailsProject, setDetailsProject] = useState(null);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.5, 1], [0.12, 0.18, 0.12]);
  const shown = showAll ? projects : projects.slice(0, 3);

  const ProjectHighlights = ({ highlights }) => (
    <div className="space-y-2 text-left">
      {highlights.map((h, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          <span className="text-muted-foreground">{h}</span>
        </div>
      ))}
    </div>
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background"
          style={{ y: yBg, opacity: opacityBg }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative">
        {/* ===== HEADER — centered ===== */}
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-4 w-4" />
            Projects
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Project <span className="text-primary">Portfolio</span>
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Curent and previous works
          </motion.p>
        </motion.div>

        {/* ===== GRID — left-aligned project cards ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 text-left">
          <AnimatePresence mode="wait">
            {shown.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 100
                }}
                className="group"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative bg-background border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                  {/* Image — crop view (object-cover) */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Hover overlay */}
                    <motion.div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        hoveredProject === project.id
                          ? "opacity-100 pointer-events-auto bg-black/50"
                          : "opacity-0 pointer-events-none"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    >
                      <motion.button
                        onClick={() => setDetailsProject(project)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-sm"
                      >
                        <Eye size={18} />
                        See More
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col text-left">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-xl font-bold text-foreground">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <motion.div
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          <Star size={12} className="fill-amber-400" />
                          Featured
                        </motion.div>
                      )}
                    </div>

                    {/* NEW: Location line */}
                    {project.location && (
                      <div className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 opacity-80" />
                        <span>{project.location}</span>
                      </div>
                    )}

                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1 whitespace-pre-line">
                      {normalizeText(project.description)}
                    </p>

                    {project.highlights?.length > 0 && (
                      <div className="mb-4">
                        <ProjectHighlights highlights={project.highlights} />
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                      <motion.button
                        onClick={() => setDetailsProject(project)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Eye size={16} />
                        See More
                      </motion.button>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className={`h-1 bg-gradient-to-r ${project.accentColor}`} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {projects.length > 3 && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                showAll
                  ? "bg-muted text-foreground border border-border"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {showAll ? (
                <>
                  <ChevronUp size={18} />
                  Show Less
                </>
              ) : (
                <>
                  View More Projects
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <ProjectDetailsModal
        open={!!detailsProject}
        project={detailsProject}
        onClose={() => setDetailsProject(null)}
      />
    </section>
  );
};

export default ProjectsSection;

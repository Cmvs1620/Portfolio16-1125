import { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

/**
 * ProjectDetailsModal
 * -----------------------------------------------------
 * ✅ All text left-aligned
 * ✅ Images cropped to 16:9 ratio
 * ✅ Click media → fullscreen zoom
 * ✅ Swap images with arrows in both normal + zoom mode
 * ✅ Supports JPG / PNG / GIF / MP4 / WEBM
 * ✅ Supports <br> and multi-line text
 * ✅ NEW: shows project.location
 */

// Converts HTML <br> tags to newlines so whitespace-pre-line can render breaks.
const normalizeText = (t) =>
  String(t ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

export default function ProjectDetailsModal({ open, project, onClose }) {
  const [index, setIndex] = useState(0);
  const [zoomSrc, setZoomSrc] = useState(null);

  // Prefix correct Vite base path
  const withBase = useCallback((p) => {
    if (!p) return p;
    if (/^(https?:)?\/\//.test(p) || /^data:/.test(p)) return p;
    const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
    const clean = String(p).replace(/^\/+/, "");
    return `${base}/${clean}`;
  }, []);

  const media = useMemo(() => {
    if (!project) return [];
    const list =
      Array.isArray(project.gallery) && project.gallery.length > 0
        ? project.gallery.flat()
        : [project.image];
    return list.filter(Boolean).map(withBase);
  }, [project, withBase]);

  useEffect(() => setIndex(0), [project?.id]);

  // keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        zoomSrc ? setZoomSrc(null) : onClose();
      }
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % media.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + media.length) % media.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, media.length, zoomSrc]);

  const goPrev = () => setIndex((i) => (i - 1 + media.length) % media.length);
  const goNext = () => setIndex((i) => (i + 1) % media.length);

  const renderMedia = (src) => {
    const lower = String(src).toLowerCase();
    const isVideo = lower.endsWith(".mp4") || lower.endsWith(".webm");
    if (isVideo) {
      return (
        <video
          key={src}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded-lg cursor-zoom-in"
          onClick={() => setZoomSrc(src)}
        />
      );
    }
    return (
      <img
        key={src}
        src={src}
        alt={project?.title || ""}
        className="absolute inset-0 w-full h-full object-cover rounded-lg cursor-zoom-in"
        onClick={() => setZoomSrc(src)}
        loading="lazy"
      />
    );
  };

  return (
    <AnimatePresence>
      {open && project && (
        <>
          {/* ---------- Main Modal ---------- */}
          <motion.div
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-6xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden text-left"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", damping: 22, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 py-5 border-b border-border bg-card/60 backdrop-blur">
                <div className="min-w-0 text-left">
                  <h3 className="text-xl md:text-2xl font-bold">{project.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    {project.category && <span>{project.category}</span>}
                    {project.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 opacity-80" />
                        {project.location}
                      </span>
                    )}
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Body */}
              <div className="grid md:grid-cols-5 gap-0 md:gap-6">
                {/* Left-aligned text */}
                <div className="md:col-span-2 p-6 md:pl-6 md:pr-0 order-2 md:order-1 text-left">
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    <div>
                      <h4 className="text-lg font-semibold">Overview</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line text-left">
                        {normalizeText(project.details || project.description)}
                      </p>
                    </div>

                    {project.highlights?.length > 0 && (
                      <div className="text-left">
                        <h5 className="text-sm font-medium mb-2">
                          Highlights
                        </h5>
                        <ul className="grid gap-2">
                          {project.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex gap-2"
                            >
                              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Media (16x9) */}
                <div className="md:col-span-3 order-1 md:order-2">
                  <div className="relative w-full aspect-[16/9] bg-black overflow-hidden rounded-lg">
                    <AnimatePresence mode="wait">{renderMedia(media[index])}</AnimatePresence>

                    {/* Swap arrows */}
                    {media.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goPrev();
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur"
                          aria-label="Previous"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goNext();
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur"
                          aria-label="Next"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {media.length > 1 && (
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
                      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />
                      <div
                        className="p-4 flex gap-2 overflow-x-auto scroll-smooth"
                        style={{ scrollSnapType: "x mandatory" }}
                      >
                        {media.map((src, i) => (
                          <button
                            key={src + i}
                            onClick={() => setIndex(i)}
                            className={`border rounded-lg overflow-hidden h-16 w-28 shrink-0 bg-muted scroll-ml-4 ${
                              i === index
                                ? "border-primary ring-2 ring-primary/30"
                                : "border-border"
                            }`}
                            style={{ scrollSnapAlign: "start" }}
                          >
                            <img
                              src={src}
                              alt={`thumb ${i + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border text-sm text-muted-foreground text-left">
                Press{" "}
                <kbd className="px-1.5 py-0.5 border border-border rounded">Esc</kbd> to
                close / Stäng.
              </div>
            </motion.div>
          </motion.div>

          {/* ---------- Fullscreen Zoom Lightbox (with arrows) ---------- */}
          <AnimatePresence>
            {zoomSrc && (
              <motion.div
                className="fixed inset-0 z-[90] bg-black/95 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setZoomSrc(null)}
              >
                <motion.img
                  key={zoomSrc}
                  src={zoomSrc}
                  alt="Zoomed media"
                  className="max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 160, damping: 20 }}
                />
                {media.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                        setZoomSrc(media[(index - 1 + media.length) % media.length]);
                      }}
                      className="absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                        setZoomSrc(media[(index + 1) % media.length]);
                      }}
                      className="absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur"
                      aria-label="Next"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

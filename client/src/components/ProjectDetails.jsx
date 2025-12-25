// src/components/ProjectDetails.jsx
// Modal with true mobile-first layout, vertical scrolling, and touch-friendly media

import { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

/**
 * ProjectDetailsModal
 * -----------------------------------------------------
 * ✅ Mobile-first: stacked image + text, full-height scroll
 * ✅ Desktop: split layout (media + copy)
 * ✅ Images cropped to 16:9 ratio
 * ✅ Touch-friendly: scrolling doesn't accidentally zoom
 * ✅ Tap "Tap to zoom / Zooma" → fullscreen lightbox
 * ✅ Swap images with arrows in both normal + zoom mode
 * ✅ Supports JPG / PNG / GIF / MP4 / WEBM
 * ✅ Supports <br> and multi-line text
 * ✅ Shows project.location
 */

// Converts HTML <br> tags to newlines so whitespace-pre-line can render breaks.
const normalizeText = (t) =>
  String(t ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

const cleanUrl = (src) => String(src || "").split("?")[0].toLowerCase();
const isVideoSrc = (src) => {
  const lower = cleanUrl(src);
  return lower.endsWith(".mp4") || lower.endsWith(".webm");
};

const videoMime = (src) => (cleanUrl(src).endsWith(".webm") ? "video/webm" : "video/mp4");

export default function ProjectDetailsModal({ open, project, onClose }) {
  const [index, setIndex] = useState(0);
  const [zoomSrc, setZoomSrc] = useState(null);
  const [isTouch, setIsTouch] = useState(false);

  // Detect touch / coarse pointer – used to avoid "tap = zoom" on mobile.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
  }, []);

  // Prefix correct Vite base path (unchanged)
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
    const isVideo = isVideoSrc(src);

    const commonClass =
      "absolute inset-0 w-full h-full object-cover rounded-lg" + (isTouch ? "" : " cursor-zoom-in");

    if (isVideo) {
      return (
        <video
          key={src}
          className={commonClass}
          onClick={isTouch ? undefined : () => setZoomSrc(src)}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          // Helpful for cross-origin storage/CDNs (won’t break if same-origin)
          crossOrigin="anonymous"
        >
          <source src={src} type={videoMime(src)} />
        </video>
      );
    }

    return (
      <img
        key={src}
        src={src}
        className={commonClass}
        onClick={isTouch ? undefined : () => setZoomSrc(src)}
        alt={project?.title || ""}
        loading="lazy"
      />
    );
  };

  const renderThumb = (src, i) => {
    const isVideo = isVideoSrc(src);

    // Keep your exact thumbnail button layout/classes, just swap the inner renderer.
    if (isVideo) {
      return (
        <div className="relative w-full h-full">
          <video
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
          >
            <source src={src} type={videoMime(src)} />
          </video>

          {/* Tiny badge so you can tell it's a video */}
          <div className="absolute left-1.5 top-1.5 px-2 py-0.5 rounded-md bg-black/55 text-[10px] text-white border border-white/20 backdrop-blur-sm">
            MP4
          </div>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={`thumb ${i + 1}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    );
  };

  const renderZoomed = (src) => {
    const isVideo = isVideoSrc(src);

    if (isVideo) {
      return (
        <motion.video
          key={src}
          className="max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          controls
          playsInline
          autoPlay
          loop
          muted
          preload="metadata"
          crossOrigin="anonymous"
          onClick={() => setZoomSrc(null)}
        >
          <source src={src} type={videoMime(src)} />
        </motion.video>
      );
    }

    return (
      <motion.img
        key={src}
        src={src}
        alt="Zoomed media"
        className="max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        onClick={() => setZoomSrc(null)}
      />
    );
  };

  return (
    <AnimatePresence>
      {open && project && (
        <>
          {/* ---------- Main Modal ---------- */}
          <motion.div
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm p-0 sm:p-4 flex items-stretch justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="
                relative
                w-full max-w-6xl
                h-full
                max-h-[100vh] sm:max-h-[90vh]
                bg-background border border-border
                rounded-none sm:rounded-2xl
                shadow-2xl overflow-hidden text-left
                flex flex-col
              "
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", damping: 22, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-card/60 backdrop-blur">
                <div className="min-w-0 text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                    {project.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground">
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

              {/* Body — full-height scroll on mobile */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-6 md:space-y-0 md:grid md:grid-cols-5 md:gap-6">
                  {/* Media block */}
                  <div className="md:col-span-3 order-1">
                    <div className="relative w-full rounded-lg overflow-hidden bg-black max-h-[50vh] md:max-h-none">
                      <div className="relative aspect-[16/9] w-full">
                        <AnimatePresence mode="wait">
                          {renderMedia(media[index])}
                        </AnimatePresence>
                      </div>

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

                      {/* Zoom button – works on touch + desktop */}
                      {media.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomSrc(media[index]);
                          }}
                          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/55 text-xs text-white border border-white/30 backdrop-blur-sm"
                        >
                          Tap to zoom / Zooma
                        </button>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {media.length > 1 && (
                      <div className="relative mt-3 sm:mt-4">
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />
                        <div
                          className="p-2 sm:p-3 flex gap-2 overflow-x-auto scroll-smooth"
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
                              {renderThumb(src, i)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text block */}
                  <div className="md:col-span-2 order-2 text-left">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-1">
                          Overview
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {normalizeText(project.details || project.description)}
                        </p>
                      </div>

                      {project.highlights?.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Highlights</h5>
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
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border text-xs sm:text-sm text-muted-foreground text-left">
                Press{" "}
                <kbd className="px-1.5 py-0.5 border border-border rounded">Esc</kbd>{" "}
                to close / Stäng.
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
                {renderZoomed(zoomSrc)}

                {media.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextIndex = (index - 1 + media.length) % media.length;
                        goPrev();
                        setZoomSrc(media[nextIndex]);
                      }}
                      className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextIndex = (index + 1) % media.length;
                        goNext();
                        setZoomSrc(media[nextIndex]);
                      }}
                      className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur"
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

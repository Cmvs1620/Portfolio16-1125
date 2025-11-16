import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

// ✅ Formspree form ID
const FORMSPREE_FORM_ID = "xanawbqo";

export const ContactSection = () => {
  const { toast } = useToast();
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);

  const [sensitiveTriggered, setSensitiveTriggered] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  // Typing this anywhere triggers privacy clear
  const SENSITIVE_REGEX = /maurits\.vonschantz/i;

  useEffect(() => {
    if (state.succeeded) {
      toast({
        title: "Message sent! 🎉",
        description: "I'll get back to you within 24 hours.",
        variant: "success",
        className:
          "bg-green-600 text-white dark:bg-green-500 border border-green-700 shadow-lg"
      });
      setFormData({ name: "", email: "", message: "" });
      setSensitiveTriggered(false);
    }
    if (state.errors && state.errors.length > 0) {
      toast({
        title: "Could not send",
        description: state.errors[0]?.message || "Please try again.",
        variant: "destructive"
      });
    }
  }, [state.succeeded, state.errors, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (SENSITIVE_REGEX.test(value)) {
      setSensitiveTriggered(true);
      setFormData((prev) => ({ ...prev, message: "" }));
      toast({
        title: "Privacy filter active",
        description: "Message cleared.",
        variant: "success",
        className:
          "bg-green-600 text-white dark:bg-green-500 border border-green-700 shadow-lg"
      });
      if (name === "message") return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative bg-background"
    >
      <div className="container mx-auto max-w-6xl">
        {/* ===== Header — CENTER aligned ===== */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-primary/10 text-primary mb-3 sm:mb-4">
            Let's Connect
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Get In Touch
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or just want to say hi? My inbox is always open.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* ===== LEFT: Contact Information (text left of icons) ===== */}
          <div className="space-y-8 p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-secondary/20 to-background border border-border">
            <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <span className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-primary" />
              Contact Details
            </h3>
<br></br>
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5">Email</p>
                  <a
                    href="mailto:maurits.vonschantz@gmail.com"
                    className={cn(
                      "text-sm sm:text-base font-medium transition-all duration-300 hover:text-primary",
                      sensitiveTriggered
                        ? "opacity-0 select-none pointer-events-none"
                        : "opacity-100"
                    )}
                    aria-hidden={sensitiveTriggered ? "true" : "false"}
                  >
                    Maurits.vonschantz@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5">Phone</p>
                  <a
                    href="tel:+46701484910"
                    className="text-sm sm:text-base font-medium hover:text-primary transition-colors"
                  >
                    +46701484910
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5">Location</p>
                  <span className="text-sm sm:text-base font-medium">Europe <br></br> <br></br><br></br> <br></br></span>
                </div>
              </div>
            </div>

            {/* Social — CENTER */}
            <div className="pt-8 text-center">
              <h4 className="font-medium mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                Find me on
              </h4>
              <div className="flex justify-center gap-3">
                {[
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    url: "https://www.linkedin.com/in/carl-maurits-von-schantz/"
                  },
                  { icon: Twitter, label: "Twitter", url: "#" },
                  {
                    icon: Instagram,
                    label: "Instagram",
                    url: "https://www.instagram.com/mauritsvonschantz/"
                  }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-accent hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Contact Form (labels left-aligned) ===== */}
          <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-card border border-border shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-primary" />
              Shoot Me a Message
            </h3>

            <form className="space-y-6 text-left" onSubmit={handleSubmit} noValidate>
              {/* Honeypot */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Name */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-xs sm:text-sm font-medium text-muted-foreground"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="John Doe"
                />
                <ValidationError prefix="Name" field="name" errors={state.errors} />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-xs sm:text-sm font-medium text-muted-foreground"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="john@example.com"
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label
                  htmlFor="message"
                  className="text-xs sm:text-sm font-medium text-muted-foreground"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none text-sm sm:text-base",
                    sensitiveTriggered && "placeholder:italic"
                  )}
                  placeholder={
                    sensitiveTriggered
                      ? "Message cleared for privacy."
                      : "Hey, I'd love to collaborate on..."
                  }
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} />
                {sensitiveTriggered && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Privacy filter: typing “maurits.vonschantz” clears the message and hides the email.
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={state.submitting}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20 text-sm sm:text-base",
                  state.submitting && "opacity-80 cursor-not-allowed"
                )}
              >
                {state.submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>

              {/* Mailto fallback */}
              <div className="text-left">
                <a
                  href={`mailto:codewithkinu@gmail.com?subject=${encodeURIComponent(
                    "Website contact"
                  )}&body=${encodeURIComponent(
                    `${formData.name} <${formData.email}>\n\n${formData.message}`
                  )}`}
                  className="inline-block text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
                >
                  Trouble sending? Email me instead.
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

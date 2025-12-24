import { Navbar } from "../components/Navbar";
import { StarBackground } from "@/components/StarBackground";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { SkillsSection } from "../components/SkillsSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { TestimonialSection } from "../components/Testimonial";

export const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <StarBackground />
      <Navbar />

      <main>
        <HeroSection />

        <AboutSection />

        {/* DESKTOP: Skills here (original position) */}
        <div className="hidden lg:block">
          <SkillsSection />
        </div>

        <ProjectsSection />

        {/* MOBILE: Skills moved under Projects */}
        <div className="block lg:hidden">
          <SkillsSection />
        </div>

        <TestimonialSection />

        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

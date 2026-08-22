import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { QuestionBankShowcase } from "@/components/landing/QuestionBankShowcase";
import { ExamExperience } from "@/components/landing/ExamExperience";
import { QualificationGrid } from "@/components/landing/QualificationGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { PlatformPreview } from "@/components/landing/PlatformPreview";
import { TrustSection } from "@/components/landing/TrustSection";
import { RoadmapSection } from "@/components/landing/RoadmapSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    // Add scroll reveal observer for elements with [data-reveal]
    const reveals = document.querySelectorAll("[data-reveal]");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Navbar />
      
      <main>
        <div data-reveal>
          <HeroSection />
        </div>
        
        <div data-reveal>
          <TrustStrip />
        </div>
        
        <div data-reveal>
          <ProblemSection />
        </div>
        
        <div data-reveal>
          <SolutionSection />
        </div>
        
        <div data-reveal>
          <FeatureGrid />
        </div>
        
        <div data-reveal>
          <QuestionBankShowcase />
        </div>
        
        <div data-reveal>
          <ExamExperience />
        </div>
        
        <div data-reveal>
          <QualificationGrid />
        </div>
        
        <div data-reveal>
          <HowItWorks />
        </div>
        
        <div data-reveal>
          <BenefitsSection />
        </div>
        
        <div data-reveal>
          <PlatformPreview />
        </div>
        
        <div data-reveal>
          <TrustSection />
        </div>
        
        <div data-reveal>
          <RoadmapSection />
        </div>
        
        <div data-reveal>
          <FAQSection />
        </div>
        
        <div data-reveal>
          <FinalCTA />
        </div>
      </main>

      <Footer />
    </div>
  );
}

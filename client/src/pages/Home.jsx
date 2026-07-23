import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import CursorGlow from "../components/ui/CursorGlow";
import ScrollProgress from "../components/ui/ScrollProgress";
import PremiumHero from "../components/ui/PremiumHero";
import FeaturesSection from "../components/ui/FeaturesSection";
import ProductShowcase from "../components/ui/ProductShowcase";
import StatsSection from "../components/ui/StatsSection";
import TestimonialsMarquee from "../components/ui/TestimonialsMarquee";
import ToolPreviews from "../components/ui/ToolPreviews";
import FAQSection from "../components/ui/FAQSection";
import PremiumFooter from "../components/ui/PremiumFooter";
import MagneticButton from "../components/ui/MagneticButton";
import PremiumNav from "../components/ui/PremiumNav";

export default function Home() {
  return (
    <main className="bg-[#050505] text-white min-h-screen">
      <CursorGlow />
      <ScrollProgress />
      <PremiumNav />
      
      {/* Phase 2: Premium Hero */}
      <PremiumHero />

      {/* Phase 4: Social Proof */}
      <StatsSection />

      {/* Phase 3: Features & Product Showcase */}
      <ProductShowcase />
      <FeaturesSection />

      {/* Phase 4: More Previews and Social Proof */}
      <ToolPreviews />
      <TestimonialsMarquee />

      {/* Phase 5: FAQ & Footer */}
      <FAQSection />

      {/* Final CTA */}
      <section className="py-32 px-6 bg-[#050505] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/20 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-violet-400 font-semibold tracking-wide uppercase text-sm mb-4">Ready when you are</p>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-display">
              Send the version <br /> that gets <em>read.</em>
            </h2>
            <p className="text-xl text-zinc-400 mb-10">
              Join thousands of professionals who stopped guessing what a hiring system wants — and started writing for it.
            </p>
            <MagneticButton variant="glow" to="/register?mode=register" className="px-10 py-5 text-lg">
              Start building for free <ArrowRight className="w-5 h-5" />
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}
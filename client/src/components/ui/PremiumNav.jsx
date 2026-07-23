import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PremiumNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Showcase", href: "#showcase" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-3 group relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-display text-white shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-cyan-500/30">
            R
          </div>
          <span className="tracking-tight">
            Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200 group rounded-full"
            >
              <span className="relative z-10">{link.name}</span>
              <span className="absolute inset-0 bg-white/10 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out"></span>
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 relative z-10">
          <Link
            to="/register?mode=login"
            className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
          >
            Sign in
          </Link>
          <Link
            to="/register?mode=register"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Get started</span>
            <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-200 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

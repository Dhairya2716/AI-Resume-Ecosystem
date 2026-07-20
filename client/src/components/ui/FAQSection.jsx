import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { question: "How does the ATS reader work?", answer: "Our ATS reader simulates exactly how standard applicant tracking systems (like Workday or Greenhouse) parse your resume. It flags unreadable sections, missing keywords, and formatting issues that would normally cause automatic rejection." },
  { question: "Is the AI just generating generic bullets?", answer: "No. Unlike tools that output generic text, our editor analyzes your specific background and suggests improvements that elevate your actual experience, ensuring your unique voice is never lost." },
  { question: "Can I use this for multiple job applications?", answer: "Yes. Our Job Matcher allows you to duplicate your base resume and tailor it specifically for each job description you upload, optimizing the keywords for every single application." },
  { question: "Is it free to start?", answer: "Yes, you can build your first resume, use the core editor, and get an initial ATS score completely free. We offer premium tiers for advanced AI rewrites, unlimited tailoring, and interview prep." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-32 px-6 bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            Common questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-colors hover:bg-white/10"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-6 flex items-center justify-between text-left"
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                {openIndex === i ? (
                  <Minus className="w-5 h-5 text-violet-400 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

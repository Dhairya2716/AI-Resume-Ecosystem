import { Link } from "react-router-dom";
import { Mail, Globe, MessageCircle } from "lucide-react";

export default function PremiumFooter() {
  return (
    <footer className="relative pt-32 pb-12 bg-[#050505] overflow-hidden border-t border-white/10">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-t from-violet-600/20 to-transparent blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          
          <div className="lg:col-span-2">
            <Link to="/" className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-display text-white">
                R
              </div>
              Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span>
            </Link>
            <p className="text-zinc-400 mb-8 max-w-sm leading-relaxed">
              The workspace for resumes that get read — by the person deciding, and the system in front of them.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:hello@resumeai.app" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-1"></div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Resume builder</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">ATS reader</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Job matcher</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Templates</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Help center</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Resume examples</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Cover letter guide</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Interview prep</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>

        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-sm text-zinc-500">
          <p>© 2026 Resume AI. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link to="/register?mode=login" className="hover:text-white transition-colors">Sign in</Link>
            <Link to="/register?mode=register" className="hover:text-white transition-colors">Create account</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

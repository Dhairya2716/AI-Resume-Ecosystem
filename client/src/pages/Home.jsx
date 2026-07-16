// import { Link } from "react-router-dom";
// import { ArrowRight, Check, FileText, ScanSearch, Sparkles, Target } from "lucide-react";
// import HeroAnimation from "../components/ui/HeroAnimation";
// import styles from "./Home.module.css";

// const tools = [
//   { icon: FileText, title: "Build with clarity", text: "Shape every part of your story in a focused, intelligent editor that brings out your best." },
//   { icon: ScanSearch, title: "See what ATS sees", text: "Surface the details that affect how your resume is read and ranked by hiring systems." },
//   { icon: Target, title: "Tailor with intent", text: "Align your experience to every role without losing your authentic point of view." },
// ];

// export default function Home() {
//   return (
//     <main className={styles.page}>
//       <div className={styles.canvasContainer}><HeroAnimation /></div>

//       <nav className={styles.nav}>
//         <div className={styles.navInner}>
//           <Link to="/" className={styles.brand}>
//             <span className={styles.brandMark}>R</span>
//             Resume<span style={{ color: 'var(--indigo)' }}>AI</span>
//           </Link>
//           <div className={styles.navActions}>
//             <Link to="/register?mode=login" className={styles.signIn}>Sign in</Link>
//             <Link to="/register?mode=register" className={styles.navCta}>Get started <ArrowRight size={14} /></Link>
//           </div>
//         </div>
//       </nav>

//       <section className={styles.hero}>
//         <div className={styles.eyebrow}><Sparkles size={13} /> Your career, supercharged by AI</div>
//         <h1>Make your next<br /><em>move</em> remarkable.</h1>
//         <p className={styles.heroSub}>
//           One intelligent workspace to build a resume that makes your experience impossible to overlook.
//         </p>
//         <div className={styles.heroActions}>
//           <Link to="/register?mode=register" className={styles.primaryCta}>
//             Create your resume <ArrowRight size={17} />
//           </Link>
//           <a href="#how-it-works" className={styles.textCta}>
//             See how it works ↓
//           </a>
//         </div>
//         <div className={styles.trust}>
//           <Check size={13} /> Free to start
//           <i /> No credit card
//           <i /> Built for every career stage
//         </div>
//       </section>

//       <section className={styles.product}>
//         <div className={styles.productFrame}>
//           <div className={styles.windowBar}>
//             <span /><span /><span />
//             <div>resume.ai / dashboard</div>
//           </div>
//           <div className={styles.workspace}>
//             <aside>
//               <b>R.</b>
//               <span className={styles.active}>Overview</span>
//               <span>My resumes</span>
//               <span>ATS insights</span>
//               <span>Job matcher</span>
//             </aside>
//             <div className={styles.previewMain}>
//               <div className={styles.previewHeading}>
//                 <div>
//                   <small>Tuesday, July 16</small>
//                   <h2>Good morning, Alex.</h2>
//                 </div>
//                 <button>+ New resume</button>
//               </div>
//               <div className={styles.previewGrid}>
//                 <div className={styles.resumePreview}>
//                   <div className={styles.docTop}><b>Alex Morgan</b><span>Product Designer</span></div>
//                   <div className={styles.docLine} />
//                   <div className={styles.docLine} />
//                   <div className={styles.docLabel}>Experience</div>
//                   <div className={styles.docLine} />
//                   <div className={`${styles.docLine} ${styles.short}`} />
//                 </div>
//                 <div className={styles.scoreCard}>
//                   <small>Latest ATS score</small>
//                   <strong>92<span>/100</span></strong>
//                   <div className={styles.progress}><i /></div>
//                   <p>Excellent. Your profile is ready to stand out.</p>
//                 </div>
//               </div>
//               <div className={styles.insight}>
//                 <span><Sparkles size={17} /></span>
//                 <div><small>AI insight</small><p>Your experience is strong. Add one measurable outcome to make it more compelling.</p></div>
//                 <ArrowRight size={17} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className={styles.intro} id="how-it-works">
//         <p className={styles.kicker}>Designed for momentum</p>
//         <h2>Everything you need.<br />Nothing in your way.</h2>
//         <p className={styles.introText}>A thoughtful set of tools that keeps the work focused — and helps your best work speak for itself.</p>
//       </section>

//       <section className={styles.tools}>
//         {tools.map(({ icon: Icon, title, text }, i) => (
//           <article key={title} className={styles.tool}>
//             <span className={styles.toolNo}>0{i + 1}</span>
//             <div className={styles.toolIcon}><Icon size={22} /></div>
//             <h3>{title}</h3>
//             <p>{text}</p>
//             <ArrowRight size={18} className={styles.toolArrow} />
//           </article>
//         ))}
//       </section>

//       <section className={styles.closing}>
//         <p className={styles.kicker}>The next chapter starts here</p>
//         <h2>Put your best work<br /><em>forward.</em></h2>
//         <p className={styles.closingSubText}>Join thousands of professionals who landed their dream role using ResumeAI.</p>
//         <Link to="/register?mode=register" className={styles.primaryCta}>
//           Start building for free <ArrowRight size={17} />
//         </Link>
//       </section>

//       <footer className={styles.footer}>
//         <Link to="/" className={styles.brand}><span className={styles.brandMark}>R</span> Resume AI</Link>
//         <p>© 2026 Resume AI. All rights reserved.</p>
//         <div>
//           <a href="#how-it-works">How it works</a>
//           <Link to="/register?mode=login">Sign in</Link>
//         </div>
//       </footer>
//     </main>
//   );
// }

//
//
//
//
//
//
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Globe,
  Mail,
  MessageCircle,
  ScanSearch,
  Target,
} from "lucide-react";
import ParticleField from "../components/ui/ParticleField";
import styles from "./Home.module.css";

const tools = [
  {
    tag: "write",
    icon: FileText,
    title: "Build with clarity",
    text: "Shape every part of your story in a focused editor that brings out your strongest lines.",
  },
  {
    tag: "scan",
    icon: ScanSearch,
    title: "See what the machine sees",
    text: "Surface exactly how applicant tracking systems parse, rank, and sometimes misread your resume.",
  },
  {
    tag: "aim",
    icon: Target,
    title: "Tailor with intent",
    text: "Match your experience to each role's language, without losing your own voice.",
  },
];

// Real before/after resume lines — the page's signature moment: an editor's
// red pen, live. A weak line gets struck through, a sharper one is inserted.
const edits = [
  {
    before: "Responsible for managing a team of people.",
    after: "Led a 12-person team to ship releases 30% faster.",
  },
  {
    before: "Worked on improving customer satisfaction.",
    after: "Raised NPS from 42 to 61 in two quarters.",
  },
  {
    before: "Helped with the launch of a new product.",
    after: "Launched a product that reached 10k users in month one.",
  },
];

function RedlineCard() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % edits.length), 4200);
    return () => clearInterval(id);
  }, []);

  const current = edits[i];

  return (
    <div className={styles.redlineCard} aria-live="polite">
      <div className={styles.redlineHead}>
        <span>manuscript.pdf — line {i + 1}</span>
        <span className={styles.redlineDot} />
      </div>
      <p key={`before-${i}`} className={styles.redlineBefore}>
        {current.before}
      </p>
      <p key={`after-${i}`} className={styles.redlineAfter}>
        <span className={styles.caret}>⌃</span>
        {current.after}
      </p>
      <div className={styles.redlineFoot}>
        <span>rewritten by ResumeAI</span>
        <div className={styles.redlineDots}>
          {edits.map((_, idx) => (
            <i key={idx} data-active={idx === i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandMark}>R</span>
            Resume<span className={styles.brandAccent}>AI</span>
          </Link>
          <div className={styles.navActions}>
            <Link to="/register?mode=login" className={styles.signIn}>Sign in</Link>
            <Link to="/register?mode=register" className={styles.navCta}>
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>Read by humans. Parsed by machines.</div>
          <h1>
            Say more,
            <br />
            with <em>less.</em>
          </h1>
          <p className={styles.heroSub}>
            ResumeAI rewrites every line until a hiring manager — and the
            software in front of them — has no reason to look away.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register?mode=register" className={styles.primaryCta}>
              Start writing — free <ArrowRight size={17} />
            </Link>
            <a href="#how-it-works" className={styles.textCta}>
              See how it works ↓
            </a>
          </div>
          <div className={styles.trust}>
            <span>Free to start</span>
            <i />
            <span>No credit card</span>
            <i />
            <span>Every career stage</span>
          </div>
        </div>

        <div className={styles.heroDemo}>
          <div className={styles.heroDemoField}>
            <ParticleField />
          </div>
          <RedlineCard />
        </div>
      </section>

      <section className={styles.product}>
        <div className={styles.productFrame}>
          <div className={styles.windowBar}>
            <span /><span /><span />
            <div>resumeai.app — draft</div>
          </div>
          <div className={styles.workspace}>
            <aside>
              <b>[R]</b>
              <span className={styles.active}>Overview</span>
              <span>My résumés</span>
              <span>ATS reader</span>
              <span>Job matcher</span>
            </aside>
            <div className={styles.previewMain}>
              <div className={styles.previewHeading}>
                <div>
                  <small>Tuesday, July 16</small>
                  <h2>Good morning, Alex.</h2>
                </div>
                <button>+ New résumé</button>
              </div>
              <div className={styles.previewGrid}>
                <div className={styles.resumePreview}>
                  <div className={styles.docTop}>
                    <b>Alex Morgan</b>
                    <span>Product Designer</span>
                  </div>
                  <div className={styles.docLine} />
                  <div className={styles.docLine} />
                  <div className={styles.docLabel}>Experience</div>
                  <div className={styles.docLine} />
                  <div className={`${styles.docLine} ${styles.short}`} />
                </div>
                <div className={styles.scoreCard}>
                  <small>Machine-read score</small>
                  <strong>92<span>/100</span></strong>
                  <div className={styles.progress}><i /></div>
                  <p>Every section parses cleanly. Ready to send.</p>
                </div>
              </div>
              <div className={styles.insight}>
                <span className={styles.insightMark}>note</span>
                <div>
                  <small>AI insight</small>
                  <p>Strong bones. One measurable outcome would make this undeniable.</p>
                </div>
                <ArrowUpRight size={17} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.intro} id="how-it-works">
        <p className={styles.kicker}>The workspace</p>
        <h2>
          Everything earns
          <br />
          its place on the page.
        </h2>
        <p className={styles.introText}>
          Three tools that work the way a good editor would — cutting what
          doesn't serve the reader, keeping what does.
        </p>
      </section>

      <section className={styles.tools}>
        {tools.map(({ icon: Icon, title, text, tag }) => (
          <article key={title} className={styles.tool}>
            <span className={styles.toolTag}>{tag}</span>
            <div className={styles.toolIcon}><Icon size={20} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
            <ArrowRight size={18} className={styles.toolArrow} />
          </article>
        ))}
      </section>

      <section className={styles.closing}>
        <p className={styles.kicker}>Ready when you are</p>
        <h2>
          Send the version
          <br />
          that gets <em>read.</em>
        </h2>
        <p className={styles.closingSubText}>
          Join professionals who stopped guessing what a hiring system wants —
          and started writing for it.
        </p>
        <Link to="/register?mode=register" className={styles.primaryCta}>
          Start building — free <ArrowRight size={17} />
        </Link>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.brand}>
              <span className={styles.brandMark}>R</span>
              Resume<span className={styles.brandAccent}>AI</span>
            </Link>
            <p>
              The workspace for resumes that get read — by the person
              deciding, and the system in front of them.
            </p>
            <div className={styles.footerSocial}>
              <a href="mailto:hello@resumeai.app" aria-label="Email ResumeAI"><Mail size={16} /></a>
              <a href="#" aria-label="ResumeAI blog"><Globe size={16} /></a>
              <a href="#" aria-label="ResumeAI community"><MessageCircle size={16} /></a>
            </div>
          </div>

          <nav className={styles.footerCol} aria-label="Product">
            <h4>Product</h4>
            <a href="#how-it-works">Resume builder</a>
            <a href="#how-it-works">ATS reader</a>
            <a href="#how-it-works">Job matcher</a>
            <a href="#">Templates</a>
          </nav>

          <nav className={styles.footerCol} aria-label="Company">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </nav>

          <nav className={styles.footerCol} aria-label="Resources">
            <h4>Resources</h4>
            <a href="#">Help center</a>
            <a href="#">Resume examples</a>
            <a href="#">Cover letter guide</a>
            <a href="#">Interview prep</a>
          </nav>

          <nav className={styles.footerCol} aria-label="Legal">
            <h4>Legal</h4>
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
            <a href="#">Security</a>
          </nav>
        </div>

        <div className={styles.footerBottom}>
          <span>© 2026 Resume AI, Inc. All rights reserved.</span>
          <Link to="/register?mode=login">Sign in</Link>
        </div>
      </footer>
    </main>
  );
}
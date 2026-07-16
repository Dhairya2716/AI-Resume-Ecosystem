import { Link } from "react-router-dom";
import { ArrowRight, Check, FileText, ScanSearch, Sparkles, Target } from "lucide-react";
import HeroAnimation from "../components/ui/HeroAnimation";
import styles from "./Home.module.css";

const tools = [
  { icon: FileText,   title: "Build with clarity",   text: "Shape every part of your story in a focused, intelligent editor that brings out your best." },
  { icon: ScanSearch, title: "See what ATS sees",    text: "Surface the details that affect how your resume is read and ranked by hiring systems." },
  { icon: Target,     title: "Tailor with intent",   text: "Align your experience to every role without losing your authentic point of view." },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.canvasContainer}><HeroAnimation /></div>

      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandMark}>R</span>
            Resume<span style={{ color: 'var(--indigo)' }}>AI</span>
          </Link>
          <div className={styles.navActions}>
            <Link to="/register?mode=login"    className={styles.signIn}>Sign in</Link>
            <Link to="/register?mode=register" className={styles.navCta}>Get started <ArrowRight size={14}/></Link>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.eyebrow}><Sparkles size={13}/> Your career, supercharged by AI</div>
        <h1>Make your next<br/><em>move</em> remarkable.</h1>
        <p className={styles.heroSub}>
          One intelligent workspace to build a resume that makes your experience impossible to overlook.
        </p>
        <div className={styles.heroActions}>
          <Link to="/register?mode=register" className={styles.primaryCta}>
            Create your resume <ArrowRight size={17}/>
          </Link>
          <a href="#how-it-works" className={styles.textCta}>
            See how it works ↓
          </a>
        </div>
        <div className={styles.trust}>
          <Check size={13}/> Free to start
          <i/> No credit card
          <i/> Built for every career stage
        </div>
      </section>

      <section className={styles.product}>
        <div className={styles.productFrame}>
          <div className={styles.windowBar}>
            <span/><span/><span/>
            <div>resume.ai / dashboard</div>
          </div>
          <div className={styles.workspace}>
            <aside>
              <b>R.</b>
              <span className={styles.active}>Overview</span>
              <span>My resumes</span>
              <span>ATS insights</span>
              <span>Job matcher</span>
            </aside>
            <div className={styles.previewMain}>
              <div className={styles.previewHeading}>
                <div>
                  <small>Tuesday, July 16</small>
                  <h2>Good morning, Alex.</h2>
                </div>
                <button>+ New resume</button>
              </div>
              <div className={styles.previewGrid}>
                <div className={styles.resumePreview}>
                  <div className={styles.docTop}><b>Alex Morgan</b><span>Product Designer</span></div>
                  <div className={styles.docLine}/>
                  <div className={styles.docLine}/>
                  <div className={styles.docLabel}>Experience</div>
                  <div className={styles.docLine}/>
                  <div className={`${styles.docLine} ${styles.short}`}/>
                </div>
                <div className={styles.scoreCard}>
                  <small>Latest ATS score</small>
                  <strong>92<span>/100</span></strong>
                  <div className={styles.progress}><i/></div>
                  <p>Excellent. Your profile is ready to stand out.</p>
                </div>
              </div>
              <div className={styles.insight}>
                <span><Sparkles size={17}/></span>
                <div><small>AI insight</small><p>Your experience is strong. Add one measurable outcome to make it more compelling.</p></div>
                <ArrowRight size={17}/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.intro} id="how-it-works">
        <p className={styles.kicker}>Designed for momentum</p>
        <h2>Everything you need.<br/>Nothing in your way.</h2>
        <p className={styles.introText}>A thoughtful set of tools that keeps the work focused — and helps your best work speak for itself.</p>
      </section>

      <section className={styles.tools}>
        {tools.map(({ icon: Icon, title, text }, i) => (
          <article key={title} className={styles.tool}>
            <span className={styles.toolNo}>0{i + 1}</span>
            <div className={styles.toolIcon}><Icon size={22}/></div>
            <h3>{title}</h3>
            <p>{text}</p>
            <ArrowRight size={18} className={styles.toolArrow}/>
          </article>
        ))}
      </section>

      <section className={styles.closing}>
        <p className={styles.kicker}>The next chapter starts here</p>
        <h2>Put your best work<br/><em>forward.</em></h2>
        <p className={styles.closingSubText}>Join thousands of professionals who landed their dream role using ResumeAI.</p>
        <Link to="/register?mode=register" className={styles.primaryCta}>
          Start building for free <ArrowRight size={17}/>
        </Link>
      </section>

      <footer className={styles.footer}>
        <Link to="/" className={styles.brand}><span className={styles.brandMark}>R</span> Resume AI</Link>
        <p>© 2026 Resume AI. All rights reserved.</p>
        <div>
          <a href="#how-it-works">How it works</a>
          <Link to="/register?mode=login">Sign in</Link>
        </div>
      </footer>
    </main>
  );
}

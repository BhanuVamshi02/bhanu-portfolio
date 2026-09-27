import { useEffect, useState } from "react";
import content from "./content.json";
import ArticlesPage from "./Articles.jsx";
import "./App.css";

const chapters = [
  ["hero", "PROLOGUE"],
  ["protagonist", "01 / PROTAGONIST"],
  ["quests", "02 / QUEST LOG"],
  ["cinema", "03 / CINEMA"],
  ["system", "04 / SYSTEM MODE"],
  ["origin", "05 / ORIGIN STORY"],
  ["other", "06 / OTHER ME"],
  ["next", "07 / NEXT QUEST"],
];
const roles = [...content.professional.roles].reverse();
const skillGroups = Object.keys(content.professional.skills);
const stats = [
  ["WEB BUILDING", "90%", 9],
  ["DESIGN CURIOSITY", "82%", 8],
  ["AI EXPERIMENTATION", "85%", 8],
  ["CINEMATIC OBSESSION", "90%", 9],
  ["ANIME KNOWLEDGE", "94%", 9],
  ["SLEEP SCHEDULE", "18%", 2],
];

function ChapterHead({ number, title, note }) {
  return (
    <div className="chapter-head">
      <span>
        {number} — {title}
      </span>
      <span>{note}</span>
    </div>
  );
}

function PortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(2);
  const [activeSkill, setActiveSkill] = useState(skillGroups[0]);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [chapterLabel, setChapterLabel] = useState("PROLOGUE");
  const [loaderLine, setLoaderLine] = useState(0);
  const [loaderPhase, setLoaderPhase] = useState("entering");
  const [coffeeClicks, setCoffeeClicks] = useState(0);

  useEffect(() => {
    const lines = [
      "Initializing human.exe...",
      "Loading creativity...",
      "Loading questionable ideas...",
      "Loading coffee...",
      "Coffee not found.",
      "Continuing anyway.",
      "Human detected.",
    ];
    let index = 0;
    const lineTimer = window.setInterval(() => {
      index += 1;
      setLoaderLine(Math.min(index, lines.length - 1));
    }, 170);
    const leaveTimer = window.setTimeout(() => setLoaderPhase("leaving"), 1350);
    const removeTimer = window.setTimeout(() => setLoaderPhase("hidden"), 2150);
    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.remove("reveal"));
      return undefined;
    }
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));

    const chapterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapter = chapters.find(([id]) => id === entry.target.id);
            if (chapter) setChapterLabel(chapter[1]);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    chapters.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) chapterObserver.observe(section);
    });
    return () => {
      revealObserver.disconnect();
      chapterObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const progress = document.querySelector(".chapter-progress i");
    let frame = 0;
    const updateProgress = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progress.style.height = `${amount}%`;
      });
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    const cursor = document.querySelector(".cursor");
    const moveCursor = (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.toggle(
        "active",
        Boolean(event.target.closest("a, button")),
      );
    };
    window.addEventListener("pointermove", moveCursor);
    return () => window.removeEventListener("pointermove", moveCursor);
  }, []);

  const handleBrandClick = () => {
    setCoffeeClicks((clicks) => {
      const nextCount = clicks + 1;
      if (nextCount === 5) window.alert("Okay. We get it. You like coffee.");
      return nextCount;
    });
  };
  const currentRole = roles[activeRole];
  const trailerUrl = content.creative.trailerUrl;

  return (
    <>
      {loaderPhase !== "hidden" && (
        <div
          className={`preloader ${loaderPhase === "leaving" ? "is-leaving" : ""}`}
          aria-label="Loading portfolio"
        >
          <div className="loader-orbit" />
          <p>
            {
              [
                "Initializing human.exe...",
                "Loading creativity...",
                "Loading questionable ideas...",
                "Loading coffee...",
                "Coffee not found.",
                "Continuing anyway.",
                "Human detected.",
              ][loaderLine]
            }
          </p>
          <span>THE OTHER SIDE OF ME</span>
        </div>
      )}
      <div className="grain" aria-hidden="true" />
      <div className="cursor" aria-hidden="true">
        <span />
      </div>
      <div className="chapter-progress" aria-hidden="true">
        <i />
      </div>

      <header className="topbar">
        <a
          className="brand magnetic"
          href="#hero"
          aria-label="Back to top"
          onClick={handleBrandClick}
        >
          BV<span>✦</span>
        </a>
        <div className="top-status">
          <span className="status-dot" />
          {chapterLabel}
        </div>
        <button
          className="menu-btn magnetic"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menuPanel"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "CLOSE" : "MENU"} <span>{menuOpen ? "×" : "↗"}</span>
        </button>
      </header>
      <div
        className={`menu-panel ${menuOpen ? "open" : ""}`}
        id="menuPanel"
        aria-hidden={!menuOpen}
      >
        <div className="menu-inner">
          <div className="menu-kicker">NAVIGATION / 08</div>
          <nav aria-label="Chapter navigation">
            {chapters.slice(1).map(([id], index) => {
              const names = [
                "THE PROTAGONIST",
                "THE QUEST LOG",
                "THE CINEMA",
                "SYSTEM MODE",
                "ORIGIN STORY",
                "THE OTHER ME",
                "THE NEXT QUEST",
              ];
              return (
                <a
                  href={`#${id}`}
                  data-menu
                  key={id}
                  onClick={() => setMenuOpen(false)}
                >
                  {String(index + 1).padStart(2, "0")} <b>{names[index]}</b>
                  <span>↗</span>
                </a>
              );
            })}
            <a href="/articles" data-menu onClick={() => setMenuOpen(false)}>
              08 <b>FIELD NOTES</b>
              <span>↗</span>
            </a>
          </nav>
          <div className="menu-foot">
            HUMAN DETECTED <span>·</span> SOUND: OFF
          </div>
        </div>
      </div>

      <main>
        <section className="hero" id="hero">
          <div className="hero-anime">
            <img
              src="/asset/Anime-banner-img2.png"
              alt="Anime-inspired character artwork"
            />
          </div>
          <div className="hero-glow hero-glow-a" />
          <div className="hero-glow hero-glow-b" />
          <div className="hero-shape shape-a" />
          <div className="hero-shape shape-b" />
          <div className="hero-shape shape-c" />
          <div className="hero-copy reveal">
            <p className="eyebrow">
              {content.profile.eyebrow} <span>✦</span>
            </p>
            <h1>
              BHANU
              <br />
              <em>VAMSHI</em>
            </h1>
            <p className="hero-sub">
              I build systems by day.
              <br />
              <strong>I build worlds when I can.</strong>
            </p>
            <div className="hero-meta">
              <span>SERVICENOW</span>
              <span>{content.profile.experience.toUpperCase()} IN IT</span>
              <span>M.SC. COMPUTER SCIENCE</span>
              <span>WEB / DESIGN / AI CINEMA</span>
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary magnetic" href="#protagonist">
                ▶ ENTER THE WORLD
              </a>
              <a className="btn btn-ghost magnetic" href="#quests">
                VIEW MY WORK ↘
              </a>
            </div>
          </div>
          <div className="hero-side">
            <span>01 / 07</span>
            <span>THE OTHER SIDE OF ME</span>
          </div>
          <div className="hero-note">
            scroll to enter
            <br />
            <span>↓</span>
          </div>
          <div className="hero-caption">
            “An ordinary human with too many side quests.”
          </div>
        </section>

        <section className="chapter intro-panel" id="protagonist">
          <ChapterHead
            number="01"
            title="THE PROTAGONIST"
            note="CHARACTER PROFILE"
          />
          <div className="split-profile">
            <div className="portrait-card">
              <div className="portrait-placeholder">
                <img
                  src="/asset/shades-img-faded.png"
                  alt="Portrait of Bhanu Vamshi"
                />
              </div>
              <div className="portrait-stamp">
                PLAYER
                <br />
                ONE
              </div>
            </div>
            <div className="profile-copy reveal">
              <p className="section-kicker">
                Before the side quests, there was just a curious human.
              </p>
              <h2>
                THE PROTAGONIST<span>✦</span>
              </h2>
              <p className="lead">
                A ServiceNow professional who somehow keeps finding excuses to
                make websites, experiment with AI, obsess over cinematic visuals
                and disappear into anime, manga, manhwa and movies.
              </p>
              <div className="profile-grid">
                <div>
                  <small>NAME</small>
                  <strong>BHANU VAMSHI</strong>
                </div>
                <div>
                  <small>CLASS</small>
                  <strong>CREATOR / TECHNOLOGIST</strong>
                </div>
                <div>
                  <small>ROLE</small>
                  <strong>SERVICENOW PROFESSIONAL</strong>
                </div>
                <div>
                  <small>EXPERIENCE</small>
                  <strong>{content.profile.experience.toUpperCase()}</strong>
                </div>
                <div>
                  <small>EDUCATION</small>
                  <strong>M.SC. COMPUTER SCIENCE</strong>
                </div>
                <div>
                  <small>CURRENT QUEST</small>
                  <strong>BUILD THINGS WORTH REMEMBERING</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="fake-stats">
            {stats.map(([label, percent, level]) => (
              <div key={label}>
                <span>{label}</span>
                <b>
                  {"█".repeat(level)}
                  {"░".repeat(10 - level)}
                </b>
                <i>{percent}</i>
              </div>
            ))}
          </div>
          <p className="tiny-note">
            * Fictional character stats. Not a scientific measurement.
            Obviously.
          </p>
        </section>

        <section className="chapter quests" id="quests">
          <ChapterHead
            number="02"
            title="THE QUEST LOG"
            note="THINGS BUILT WHILE REFUSING TO SIT STILL"
          />
          <div className="section-title">
            <p>QUEST LOG</p>
            <h2>
              Things I built while
              <br />
              <em>apparently refusing to sit still.</em>
            </h2>
          </div>
          <article className="quest quest-one">
            <div className="quest-art art-web">
              <span className="art-label">WEB / 001</span>
              <div className="art-window">
                <i />
                <i />
                <i />
                <strong>
                  YOUR NEXT
                  <br />
                  IDEA<span>.</span>
                </strong>
                <small>design → build → ship</small>
              </div>
            </div>
            <div className="quest-copy">
              <span className="quest-number">QUEST 001</span>
              <h3>
                THE WEB
                <br />
                FORGE
              </h3>
              <p>{content.creative.web.description}</p>
              <div className="tag-row">
                <span>WEB</span>
                <span>DESIGN</span>
                <span>EXPERIMENTS</span>
              </div>
              <a
                className="text-link"
                href={content.creative.oldPortfolio}
                target="_blank"
                rel="noreferrer"
              >
                OPEN THE OLD CHAPTER ↗
              </a>
            </div>
          </article>
          <article className="quest quest-two">
            <div className="quest-copy">
              <span className="quest-number">QUEST 002</span>
              <h3>
                THE DESIGN
                <br />
                ARC
              </h3>
              <p>
                Layouts, interface ideas, visual hierarchy and the slightly
                unreasonable belief that software should be nice to look at.
              </p>
              <div className="tag-row">
                <span>UI</span>
                <span>UX</span>
                <span>VISUALS</span>
              </div>
              <a className="text-link" href="#other">
                ENTER THE OTHER SIDE ↘
              </a>
            </div>
            <div className="quest-art art-design">
              <span className="art-label">DESIGN / 002</span>
              <div className="poster">
                <b>
                  MAKE IT
                  <br />
                  FEEL
                  <br />
                  ALIVE.
                </b>
                <small>BHANU / CREATIVE MODE</small>
              </div>
            </div>
          </article>
          <article className="quest quest-three">
            <div className="quest-art art-cinema">
              <span className="art-label">CINEMA / 003</span>
              <div className="film-title">
                THE
                <br />
                AI
                <br />
                <em>CINEMA</em>
              </div>
              <div className="film-scan" />
            </div>
            <div className="quest-copy">
              <span className="quest-number">QUEST 003</span>
              <h3>
                THE AI
                <br />
                CINEMA
              </h3>
              <p>{content.creative.cinema.description}</p>
              <div className="tag-row">
                <span>AI</span>
                <span>STORY</span>
                <span>FILM</span>
              </div>
              <a className="text-link" href="#cinema">
                PLAY THE TRAILER ↘
              </a>
            </div>
          </article>
        </section>

        <section className="cinema" id="cinema">
          <div className="cinema-backdrop" />
          <div className="letterbox top" />
          <div className="letterbox bottom" />
          <div className="cinema-content">
            <span className="film-kicker">03 — THE CINEMA</span>
            <h2>
              WHAT IF A<br />
              DEVELOPER
              <br />
              <em>MADE A MOVIE?</em>
            </h2>
            <p>An AI cinematic experiment.</p>
            <button
              className="play-btn magnetic"
              type="button"
              onClick={() => setTrailerOpen(true)}
            >
              ▶{" "}
              <span>{trailerOpen ? "TRAILER READY" : "PLAY THE TRAILER"}</span>
            </button>
            <div className={`trailer-placeholder ${trailerOpen ? "show" : ""}`}>
              {trailerOpen && trailerUrl && trailerUrl !== "[TRAILER URL]" ? (
                <div className="trailer-frame">
                  <iframe
                    src={trailerUrl}
                    title="Bhanu Vamshi — AI Cinema Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div>
                  <span>TRAILER SOURCE</span>
                  <strong>
                    {trailerOpen ? "TRAILER NOT CONFIGURED" : "[TRAILER URL]"}
                  </strong>
                  <small>
                    {trailerOpen
                      ? "Add a YouTube embed URL to the creative trailer field."
                      : "Select play to open the AI cinema trailer."}
                  </small>
                </div>
              )}
            </div>
          </div>
          <div className="cinema-credit">
            <span>DIRECTED BY CURIOSITY.</span>
            <span>WRITTEN WITH QUESTIONS.</span>
            <span>POWERED BY AI.</span>
          </div>
        </section>

        <section className="chapter system" id="system">
          <ChapterHead
            number="04"
            title="SYSTEM MODE"
            note="OKAY. ENOUGH NONSENSE."
          />
          <div className="system-intro">
            <div>
              <p className="section-kicker">I actually work in IT.</p>
              <h2>
                SYSTEM
                <br />
                <em>MODE.</em>
              </h2>
            </div>
            <p>
              ServiceNow development, implementation, troubleshooting,
              requirements, solutioning and client-facing technical work — now
              with considerably fewer explosions.
            </p>
          </div>
          <div className="career-console">
            <div className="console-sidebar">
              <span>CAREER ARC</span>
              {roles.map((role, index) => (
                <button
                  className={`role-tab ${activeRole === index ? "active" : ""}`}
                  type="button"
                  key={role.title}
                  onClick={() => setActiveRole(index)}
                >
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {role.title.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="role-detail">
              <div className="role-top">
                <span>{currentRole.period.toUpperCase()}</span>
                <span>{currentRole.tone.toUpperCase()} ARC</span>
              </div>
              <h3>{currentRole.title}</h3>
              <p>{currentRole.description}</p>
              <div className="highlight-list">
                {currentRole.highlights.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="skills-system">
            <div
              className="skill-tabs"
              role="tablist"
              aria-label="Professional skills"
            >
              {skillGroups.map((group) => (
                <button
                  className={`skill-tab ${activeSkill === group ? "active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={activeSkill === group}
                  key={group}
                  onClick={() => setActiveSkill(group)}
                >
                  {group.toUpperCase().replace(" & ", " / ")}
                </button>
              ))}
            </div>
            <div className="skill-items">
              {content.professional.skills[activeSkill].map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
          <div className="credentials">
            <div>
              <span>CREDENTIALS</span>
              <h3>
                Certified.
                <br />
                Curious.
                <br />
                Still learning.
              </h3>
            </div>
            <ul>
              {content.professional.certifications.map((certification) => (
                <li key={certification}>
                  {certification}
                  <b>
                    {certification.includes("System Administrator")
                      ? "CSA"
                      : certification.includes("Implementation")
                        ? "CIS-ITSM"
                        : "+"}
                  </b>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="origin" id="origin">
          <div className="origin-bg" />
          <ChapterHead number="05" title="ORIGIN STORY" note="THE TIMELINE" />
          <div className="origin-title">
            <p>ORIGIN STORY</p>
            <h2>
              FROM LEARNING
              <br />
              TO <em>OWNERSHIP.</em>
            </h2>
          </div>
          <div className="timeline">
            <div className="timeline-line" />
            <article>
              <span>01</span>
              <small>SEP 2021</small>
              <h3>B.SC. COMPUTER SCIENCE</h3>
              <p>Osmania University</p>
            </article>
            <article>
              <span>02</span>
              <small>OCT 2023</small>
              <h3>M.SC. COMPUTER SCIENCE</h3>
              <p>Osmania University</p>
            </article>
            <article>
              <span>03</span>
              <small>FEB 2024</small>
              <h3>ASSOCIATE DEVELOPER</h3>
              <p>
                ServiceNow foundation → ITSM → certifications → implementation
                exposure.
              </p>
            </article>
            <article>
              <span>04</span>
              <small>OCT 2024</small>
              <h3>PLATFORM DEVELOPER</h3>
              <p>
                Hands-on development across ITSM, CSM, portals, workspaces,
                automation and custom applications.
              </p>
            </article>
            <article>
              <span>05</span>
              <small>APR 2026</small>
              <h3>ASSOCIATE TECHNICAL CONSULTANT</h3>
              <p>
                Development + requirements + troubleshooting + client
                communication + solutioning.
              </p>
            </article>
            <article>
              <span>06</span>
              <small>NEXT</small>
              <h3>THE NEXT QUEST</h3>
              <p>Still loading. Probably something interesting.</p>
            </article>
          </div>
        </section>

        <section className="other" id="other">
          <ChapterHead
            number="06"
            title="THE OTHER ME"
            note="NON-WORK ACTIVITIES DETECTED"
          />
          <div className="other-hero">
            <p>
              WHEN THE LAPTOP
              <br />
              ISN'T BEING USED
              <br />
              FOR WORK.
            </p>
            <h2>
              THE
              <br />
              <em>OTHER ME.</em>
            </h2>
          </div>
          <div className="worlds">
            <article className="world anime-world">
              <div className="world-art">
                <span>ARC 01</span>
                <strong>ANIME</strong>
                <i>✦</i>
              </div>
              <div className="world-copy">
                <small>ANIME FAVORITES</small>
                <h3>FAN FAVORITES</h3>
                <p>
                  “One more episode.”
                  <br />
                  <em>Famous last words.</em>
                </p>
                <div className="placeholder-list">
                  {content.interests.animes.map((anime) => (
                    <span key={anime}>{anime}</span>
                  ))}
                </div>
              </div>
            </article>
            <article className="world manga-world">
              <div className="world-copy">
                <small>THE PANEL ARC</small>
                <h3>MANHWA</h3>
                <p>
                  Big panels. Dramatic typography. Scroll slowly. Pretend there
                  is background music.
                </p>
                <div className="panel-strip">
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>
                </div>
                <div className="placeholder-list">
                  {content.interests.manhwa.map((title) => (
                    <span key={title}>{title}</span>
                  ))}
                </div>
              </div>
              <div className="world-art">
                <span>ARC 02</span>
                <strong>READ</strong>
                <i>↘</i>
              </div>
            </article>
            <article className="world movie-world">
              <div className="world-art">
                <span>ARC 03</span>
                <strong>
                  MOVIE
                  <br />
                  NIGHT
                </strong>
                <i>▶</i>
              </div>
              <div className="world-copy">
                <small>THE CINEMA SHELF</small>
                <h3>
                  ROLL
                  <br />
                  CREDITS.
                </h3>
                <div className="poster-row">
                  {content.interests.movies.map((movie) => (
                    <span key={movie}>{movie}</span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="quiet">
          <div className="quiet-stars" />
          <p>AFTER ALL THE NOISE...</p>
          <h2>
            I LIKE
            <br />
            <em>BUILDING THINGS.</em>
          </h2>
          <div className="quiet-lines">
            <span>Sometimes websites.</span>
            <span>Sometimes systems.</span>
            <span>Sometimes stories.</span>
            <span>Sometimes experiments.</span>
            <span>And sometimes...</span>
            <strong>
              I just want to watch anime and forget what time it is.
            </strong>
          </div>
        </section>

        <section className="next" id="next">
          <div className="next-orb" />
          <ChapterHead number="07" title="THE NEXT QUEST" note="PARTY OPEN" />
          <div className="next-content">
            <p>QUEST ACCEPTANCE WINDOW</p>
            <h2>
              WHAT'S YOUR
              <br />
              <em>NEXT QUEST?</em>
            </h2>
            <span>Maybe we should build something.</span>
            <div className="next-actions">
              <a
                className="btn btn-light magnetic"
                href={`mailto:${content.profile.email}`}
              >
                LET'S TALK ↗
              </a>
              <a className="btn btn-outline-light magnetic" href="#quests">
                VIEW MY WORK
              </a>
              <button
                className="btn btn-outline-light magnetic"
                type="button"
                onClick={() => {
                  document
                    .getElementById("cinema")
                    .scrollIntoView({ behavior: "smooth" });
                  setTrailerOpen(true);
                }}
              >
                WATCH THE TRAILER AGAIN
              </button>
            </div>
            <div className="contact-strip">
              <a href={`mailto:${content.profile.email}`}>
                {content.profile.email}
              </a>
              <a href={`tel:${content.profile.phone.replaceAll(" ", "")}`}>
                {content.profile.phone}
              </a>
              <a
                href={content.profile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LINKEDIN ↗
              </a>
              <a href={content.profile.github} target="_blank" rel="noreferrer">
                GITHUB ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div>
          <b>BHANU VAMSHI</b>
          <span>
            Built with React, curiosity and an unreasonable number of side
            quests.
          </span>
        </div>
        <div>
          © <span>{new Date().getFullYear()}</span> BHANU VAMSHI{" "}
          <a href="#hero">BACK TO TOP ↑</a>
        </div>
      </footer>
    </>
  );
}

function App() {
  const isArticlesPage =
    window.location.pathname.replace(/\/+$/, "") === "/articles";
  return isArticlesPage ? <ArticlesPage /> : <PortfolioPage />;
}

export default App;

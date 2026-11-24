import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  bookingUrl,
  contact,
  faqs,
  processSteps,
  projects,
  socialLinks,
  stats,
  whatsappUrl,
} from "./data.js";
import { sendMessage } from "./contact.js";
import { projectStore } from "./project-store.js";
import portrait from "../assets/portraits/axel-outdoor-600.webp";
import portraitLarge from "../assets/portraits/axel-outdoor-1200.webp";
import headshot from "../assets/portraits/axel-studio-320.webp";
import headshotLarge from "../assets/portraits/axel-studio-640.webp";
import { track, trackOnce } from "./analytics.js";

function Arrow({ diagonal = false, ...props }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      {...props}
    >
      {diagonal ? (
        <path d="M5 19 19 5M5 5h14v14" />
      ) : (
        <path d="M4 12h16m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

function WhatsAppIcon({ size = 17, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

function ExternalLink({ href, children, ...props }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToContact() {
  document
    .getElementById("contact")
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

function trackExternal(name, props) {
  return () => track(name, props);
}

const NAV = [
  ["work", "Work"],
  ["about", "About"],
  ["process", "Process"],
  ["expertise", "Expertise"],
  ["faq", "FAQ"],
];

// Highlights the nav link for whichever section sits in the middle band of
// the viewport.
function useActiveSection(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS = [...NAV.map(([id]) => id), "contact"];

function Header() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark",
  );
  const toggle = useRef(null);
  function toggleTheme(event) {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    const apply = () => {
      document.documentElement.dataset.theme = next;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", next === "dark" ? "#171715" : "#f5f3ec");
    };
    // The new theme grows out of the toggle as a circle where supported.
    if (document.startViewTransition && !prefersReducedMotion()) {
      const box = event.currentTarget.getBoundingClientRect();
      const root = document.documentElement.style;
      root.setProperty("--vt-x", `${box.left + box.width / 2}px`);
      root.setProperty("--vt-y", `${box.top + box.height / 2}px`);
      document.startViewTransition(apply);
    } else {
      apply();
    }
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      /* Storage can be disabled by the browser. */
    }
  }
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="header">
      <div className="header-inner wrap">
        <a className="wordmark" href="#home" aria-label="Axel Asa home">
          axel asa<span>.</span>
        </a>
        <div className="header-controls">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              {theme === "dark" ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
                </>
              ) : (
                <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
              )}
            </svg>
          </button>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-controls="navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Menu"}
            <span aria-hidden="true">{open ? "−" : "+"}</span>
          </button>
        </div>
        <nav
          id="navigation"
          className={open ? "navigation open" : "navigation"}
          aria-label="Main navigation"
        >
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={
                id === "process" || id === "faq" ? "nav-secondary" : ""
              }
              aria-current={active === id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="nav-contact"
            href="#contact"
            onClick={() => setOpen(false)}
          >
            Let’s talk <Arrow diagonal />
          </a>
        </nav>
      </div>
      <span className="scroll-progress" aria-hidden="true" />
    </header>
  );
}

// Live time in Kenya, so visitors in other timezones know when I'm around.
function LocalTime() {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Nairobi",
    }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const timer = setInterval(() => setTime(format()), 20000);
    return () => clearInterval(timer);
  }, []);
  return <time className="local-time">{time}</time>;
}

// Feeds the cursor position to the card's CSS glow.
function spotlight(event) {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--mx",
    `${event.clientX - box.left}px`,
  );
  event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
}

function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      <div className="wrap hero-inner">
        <p className="hero-meta">
          <span>
            <span className="status-dot" /> Taking on new projects
          </span>
          <span>
            Mobile &amp; web developer · Kenya,&nbsp;
            <LocalTime />
          </span>
        </p>
        <div className="hero-main">
          <h1 id="hero-heading">
            <span className="line">I build apps people</span>
            <span className="line">
              actually <em>keep</em> on
            </span>
            <span className="line">their phones.</span>
          </h1>
          <img
            className="hero-portrait"
            src={headshotLarge}
            srcSet={`${headshot} 320w, ${headshotLarge} 640w`}
            sizes="(max-width: 600px) 150px, 280px"
            alt="Axel Asa in a white shirt"
            width="640"
            height="800"
          />
        </div>
        <div className="hero-foot">
          <p className="hero-description">
            I’m Axel. Four of my apps are live right now, for a radio station, a
            health insurer, a telehealth service and a skincare brand. Together
            they have passed 55K downloads. I write mostly Flutter and work with
            clients wherever they are.
          </p>
          <div className="hero-actions">
            <a
              href="#work"
              className="button primary"
              onClick={trackExternal("hero_cta_click")}
            >
              See the work <Arrow />
            </a>
            <a href="#contact" className="text-link">
              Tell me about your project <Arrow diagonal />
            </a>
          </div>
        </div>
      </div>
      <div className="hero-reel">
        {[0, 1].map((copy) => (
          <div
            className="hero-reel-track"
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {projects.map((project, index) => (
              <img
                key={project.slug}
                className="hero-reel-image"
                src={project.image}
                srcSet={`${project.imageSmall} 960w, ${project.image} 1400w`}
                sizes="(max-width: 625px) 520px, 84vw"
                alt={copy === 0 ? `${project.title} ${project.website ? "website" : "app"} screens` : ""}
                width="1400"
                height="400"
                fetchPriority={copy === 0 && index === 0 ? "high" : undefined}
                loading={copy === 1 ? "lazy" : undefined}
                decoding="async"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ id, label, children, aside }) {
  return (
    <div className="section-heading reveal">
      <div>
        <p className="eyebrow">{label}</p>
        <h2 id={id}>{children}</h2>
      </div>
      {aside && <p>{aside}</p>}
    </div>
  );
}

function Work({ onOpenCase }) {
  const [filter, setFilter] = useState("All work");
  const visible = projects.filter(
    (project) => filter === "All work" || project.category === filter,
  );
  const filterOptions = [
    { label: "All work", count: projects.length },
    ...Array.from(new Set(projects.map((project) => project.category))).map(
      (category) => ({
        label: category,
        count: projects.filter((project) => project.category === category)
          .length,
      }),
    ),
  ];
  return (
    <section
      id="work"
      className="work section wrap"
      aria-labelledby="work-heading"
    >
      <SectionHeading
        id="work-heading"
        label="Selected work"
        aside="All of these are in the stores today. Open one for the story behind it."
      >
        Things I’ve <em>shipped.</em>
      </SectionHeading>
      <div className="work-toolbar reveal">
        <div className="filters" role="group" aria-label="Filter projects">
          {filterOptions.map(({ label, count }) => (
            <button
              key={label}
              aria-pressed={filter === label}
              className={filter === label ? "active" : ""}
              onClick={() => setFilter(label)}
            >
              {label}
              <span>{count}</span>
            </button>
          ))}
        </div>
        <span className="project-count" role="status">
          {visible.length} {visible.length === 1 ? "project" : "projects"}
        </span>
      </div>
      <div className="project-list">
        {visible.map((project, index) => (
          <article
            className={`project tone-${project.color}`}
            key={project.title}
            style={{ "--i": index }}
            onPointerMove={spotlight}
          >
            <button
              type="button"
              className="project-image"
              aria-label={`Read the ${project.title} case study`}
              onClick={() => onOpenCase(project)}
            >
              <img
                src={project.image}
                srcSet={`${project.imageSmall} 960w, ${project.image} 1400w`}
                sizes="(max-width: 800px) 680px, 1200px"
                alt={`${project.title} ${project.website ? "website screens" : "app screens from its store listing"}`}
                width="1400"
                height="400"
                loading="lazy"
                decoding="async"
              />
              <span className="project-open">
                Read the story <Arrow diagonal />
              </span>
            </button>
            <div className="project-body">
              <div className="project-title">
                <img
                  className="project-icon"
                  src={project.icon}
                  alt=""
                  width="160"
                  height="160"
                  loading="lazy"
                />
                <div>
                  <h3>
                    <button
                      type="button"
                      className="project-title-button"
                      onClick={() => onOpenCase(project)}
                    >
                      {project.title}
                    </button>
                  </h3>
                  <span className="project-detail">{project.detail}</span>
                </div>
              </div>
              <p>{project.description}</p>
              <div className="project-links">
                {project.store?.downloads && (
                  <span className="project-stat">
                    {project.store.downloads} downloads
                    {project.store.rating && ` · ★ ${project.store.rating}`}
                  </span>
                )}
                <ExternalLink
                  className="project-store"
                  href={projectStore(project).url}
                  onClick={trackExternal("store_link_click", {
                    project: project.title,
                  })}
                >
                  View on {projectStore(project).name} <Arrow diagonal />
                </ExternalLink>
              </div>
            </div>
          </article>
        ))}
      </div>
      <ExternalLink className="text-link work-github" href={socialLinks[0][1]}>
        More of my code is on GitHub <Arrow diagonal />
      </ExternalLink>
    </section>
  );
}

const STATEMENT =
  "Most apps get opened once and forgotten. I build the other kind: apps that do the job the moment you open them, so people come back tomorrow, and the day after.";

// Words light up one by one as the paragraph scrolls through the viewport.
function Statement() {
  const words = STATEMENT.split(" ");
  return (
    <section className="statement wrap" aria-label="How I think about apps">
      <p className="statement-text">
        {words.map((word, index) => (
          <span key={index} style={{ "--p": index / words.length }}>
            {word}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}

// Counts a stat like "55K+" up from zero the first time it scrolls into view.
function CountUp({ value }) {
  const ref = useRef(null);
  const [text, setText] = useState(value);
  useEffect(() => {
    const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match || prefersReducedMotion()) return;
    const [, number, suffix] = match;
    const target = Number(number);
    const decimals = number.split(".")[1]?.length || 0;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / 1400, 1);
        const eased = 1 - (1 - t) ** 3;
        setText((target * eased).toFixed(decimals) + suffix);
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return <strong ref={ref}>{text}</strong>;
}

function Proof() {
  return (
    <section className="proof wrap" aria-label="Published work in numbers">
      {stats.map(([value, label]) => (
        <div className="proof-item reveal" key={label}>
          <CountUp value={value} />
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}

function About() {
  return (
    <section
      id="about"
      className="about section"
      aria-labelledby="about-heading"
    >
      <div className="wrap about-grid">
        <figure className="about-art">
          <div className="portrait-frame">
            <img
              className="about-portrait"
              src={portrait}
              srcSet={`${portrait} 480w, ${portraitLarge} 900w`}
              sizes="(max-width: 800px) min(460px, calc(100vw - 40px)), 40vw"
              alt="Axel Asa outdoors in a wide-brimmed hat"
              width="900"
              height="1200"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption>Off the clock, somewhere with no Wi-Fi.</figcaption>
        </figure>
        <div className="about-copy">
          <p className="eyebrow reveal">About</p>
          <h2 id="about-heading" className="reveal">
            Hi, I’m <em>Axel.</em>
          </h2>
          <div className="about-description">
            <p className="reveal">
              Most of my projects start with something mildly annoying.
              Insurance members phoning an office just to check their cover.
              Radio listeners jumping between three apps to follow one station.
              I like turning that into an app that does the job the moment you
              open it.
            </p>
            <p className="reveal">
              Day to day I write Flutter. I reach for Kotlin or Swift when the
              platform asks for it, and I build the backend myself with
              Firebase, Supabase or Spring Boot. You deal with the person
              writing the code from the first call to the store release.
            </p>
            <a href="#contact" className="text-link reveal">
              Say hello <Arrow diagonal />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section
      id="process"
      className="process section wrap"
      aria-labelledby="process-heading"
    >
      <SectionHeading
        id="process-heading"
        label="Process"
        aside="Four steps. You’ll always know which one we’re on."
      >
        How a project <em>runs.</em>
      </SectionHeading>
      <div className="process-list">
        <span className="process-rail" aria-hidden="true" />
        {processSteps.map(([number, title, description]) => (
          <article className="process-step reveal" key={number}>
            <span className="process-number">{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <div className="process-cta reveal">
        <span>It all starts with a free 15-minute call.</span>
        <a
          className="text-link"
          href={bookingUrl}
          onClick={trackExternal("cal_click", { from: "process" })}
        >
          Book an intro call <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}

const SERVICES = [
  [
    "Mobile apps",
    "Android and iOS from one Flutter codebase, or native Kotlin and Swift when that is the better call.",
    "Flutter, Dart, Kotlin, Swift",
  ],
  [
    "Websites",
    "Fast, responsive sites and web apps that explain your business clearly. This one included.",
    "React, responsive layouts, web apps",
  ],
  [
    "Backend and integrations",
    "Sign-in, databases, push notifications and the APIs your app talks to.",
    "Firebase, Supabase, Spring Boot",
  ],
];

const TOOLS = [
  "Flutter",
  "Dart",
  "Kotlin",
  "Swift",
  "Firebase",
  "Spring Boot",
  "Supabase",
];

function Expertise() {
  return (
    <section
      id="expertise"
      className="expertise section wrap"
      aria-labelledby="expertise-heading"
    >
      <SectionHeading
        id="expertise-heading"
        label="Expertise"
        aside="One person, the whole stack."
      >
        What I can <em>help with.</em>
      </SectionHeading>
      <div className="service-list">
        {SERVICES.map(([title, description, tools], index) => (
          <article className="service reveal" key={title}>
            <span className="service-number">0{index + 1}</span>
            <h3>{title}</h3>
            <div>
              <p>{description}</p>
              <span>{tools}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="toolkit" aria-hidden="true">
        <div className="toolkit-track">
          {[...TOOLS, ...TOOLS].map((tool, index) => (
            <span key={index} aria-hidden={index >= TOOLS.length || undefined}>
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section
      id="faq"
      className="faq section wrap"
      aria-labelledby="faq-heading"
    >
      <div className="faq-grid">
        <SectionHeading id="faq-heading" label="FAQ">
          Things people ask <em>before the first call.</em>
        </SectionHeading>
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details className="faq-item" key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROJECT_TYPES = ["Mobile app", "Website", "Backend", "Not sure yet"];
const BUDGETS = [
  "Under $2k",
  "$2k to $5k",
  "$5k to $10k",
  "$10k+",
  "Need a quote",
];
const TIMELINES = ["ASAP", "1 to 3 months", "3 to 6 months", "Just exploring"];

function ChipGroup({ legend, options, value, onChange }) {
  return (
    <fieldset className="chip-group-field">
      <legend>{legend}</legend>
      <div className="chip-group" role="group" aria-label={legend}>
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className="chip"
            aria-pressed={value === option}
            onClick={() => onChange(value === option ? "" : option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function composeSubject({ type, budget, timeline }) {
  const parts = [type, budget, timeline].filter(Boolean);
  return parts.length
    ? `Project inquiry: ${parts.join(", ")}`
    : "New project inquiry";
}

function Contact({ preselect }) {
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const sending = useRef(false);
  useEffect(() => {
    if (preselect?.type && PROJECT_TYPES.includes(preselect.type)) {
      setType(preselect.type);
    }
  }, [preselect]);
  async function handleSubmit(event) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    if (!values.name || !values.email || !values.message) {
      setError("Please complete every field before sending.");
      setState("error");
      return;
    }
    values.subject = composeSubject({ type, budget, timeline });
    sending.current = true;
    setState("sending");
    setError("");
    try {
      await sendMessage(values);
      track("contact_form_submitted", { type, budget, timeline });
      setState("success");
      form.reset();
    } catch {
      track("contact_form_failed", { type });
      setState("error");
      setError(
        "Your message couldn’t send. Please try again, or reach me on LinkedIn. Your message is still here.",
      );
    } finally {
      sending.current = false;
    }
  }
  return (
    <section
      id="contact"
      className="contact section"
      aria-labelledby="contact-heading"
    >
      <div className="wrap contact-grid">
        <div className="contact-copy">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-heading">
            Got something in mind? <em>Let’s talk it through.</em>
          </h2>
          <p>
            Tell me a little about it. I read every message myself and reply
            within a day.
          </p>
          <div className="contact-channels">
            <ExternalLink
              href={whatsappUrl()}
              onClick={trackExternal("whatsapp_click", { from: "contact" })}
            >
              <WhatsAppIcon /> Chat on WhatsApp
            </ExternalLink>
            <a
              href={bookingUrl}
              onClick={trackExternal("cal_click", { from: "contact" })}
            >
              Book a call
            </a>
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent("Project inquiry")}`}
              onClick={trackExternal("email_click", { from: "contact" })}
            >
              {contact.email}
            </a>
          </div>
          <ExternalLink
            href={socialLinks[1][1]}
            className="text-link"
            onClick={trackExternal("linkedin_click")}
          >
            Connect on LinkedIn <Arrow diagonal />
          </ExternalLink>
        </div>
        <form
          className="contact-form"
          onSubmit={handleSubmit}
          aria-label="Project inquiry"
          onFocus={(event) => {
            if (event.target.matches("input, textarea")) {
              trackOnce("contact_form_started", {
                source: preselect?.source || "direct",
              });
            }
          }}
        >
          <ChipGroup
            legend="What do you need?"
            options={PROJECT_TYPES}
            value={type}
            onChange={setType}
          />
          <div className="chip-row">
            <ChipGroup
              legend="Rough budget"
              options={BUDGETS}
              value={budget}
              onChange={setBudget}
            />
            <ChipGroup
              legend="Timeline"
              options={TIMELINES}
              value={timeline}
              onChange={setTimeline}
            />
          </div>
          <div className="form-row">
            <label>
              Your name
              <input
                name="name"
                autoComplete="name"
                placeholder="What should I call you?"
                maxLength="100"
                required
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                maxLength="254"
                required
              />
            </label>
          </div>
          <label>
            A little about your project
            <textarea
              name="message"
              placeholder="Tell me about your idea, goals, and what you need help with."
              rows="4"
              maxLength="5000"
              required
            />
          </label>
          <div className="form-bottom">
            <span>Goes straight to my inbox.</span>
            <button
              className="button primary"
              disabled={state === "sending"}
              type="submit"
            >
              {state === "sending" ? "Sending…" : "Send message"}
              <Arrow diagonal />
            </button>
          </div>
          <div
            className={`form-feedback ${state}`}
            role="status"
            aria-live="polite"
          >
            {state === "success"
              ? "Thanks, your message is in. I’ll get back to you within 24 hours."
              : error}
            {state === "error" && (
              <>
                {" "}
                <ExternalLink href={socialLinks[1][1]}>
                  Open LinkedIn <Arrow diagonal />
                </ExternalLink>
              </>
            )}
          </div>
          {state === "success" && (
            <div className="success-next">
              <span>If you’d rather not wait:</span>
              <a
                className="button primary"
                href={bookingUrl}
                onClick={trackExternal("cal_click", { from: "form-success" })}
              >
                Book a call <Arrow diagonal />
              </a>
              <ExternalLink
                className="text-link"
                href={whatsappUrl()}
                onClick={trackExternal("whatsapp_click", {
                  from: "form-success",
                })}
              >
                <WhatsAppIcon /> Chat on WhatsApp
              </ExternalLink>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Dialog({ onClose, labelledBy, className = "", children }) {
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  useEffect(() => {
    restoreRef.current = document.activeElement;
    const panel = panelRef.current;
    const focusables = () =>
      panel.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
    (focusables()[0] || panel).focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = [...focusables()];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      // preventScroll: moving to the next case study must not jump the page behind.
      restoreRef.current?.focus?.({ preventScroll: true });
    };
  }, [onClose]);
  return createPortal(
    <>
      <div className="dialog-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`dialog ${className}`}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

function CaseStudyDialog({ project, next, onClose, onStart, onNext }) {
  return (
    <Dialog
      onClose={onClose}
      labelledBy="case-study-title"
      className="case-dialog"
    >
      <div className="dialog-top">
        <p className="eyebrow">Case study · {project.category}</p>
        <button
          type="button"
          className="dialog-close"
          aria-label="Close case study"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className={`case-hero ${project.color}`}>
        <img
          src={project.image}
          alt={`${project.title} ${project.website ? "website screens" : "app screens from its store listing"}`}
          width="1400"
          height="400"
        />
      </div>
      <h2 id="case-study-title">{project.title}</h2>
      <p className="case-lede">{project.description}</p>
      <div className="case-grid">
        <div>
          <span className="case-label">The problem</span>
          <p>{project.challenge}</p>
        </div>
        <div>
          <span className="case-label">What I built</span>
          <p>{project.approach}</p>
        </div>
        <div>
          <span className="case-label">Where it is now</span>
          <p>{project.outcome}</p>
        </div>
      </div>
      <div className="case-meta">
        <ul className="case-stack" aria-label="Built with">
          {project.stack.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        {project.store && (
          <div className="case-proof">
            {project.store.release && <span>New release on Google Play</span>}
            {project.store.downloads && (
              <span>{project.store.downloads} downloads on Google Play</span>
            )}
            {project.store.rating && (
              <span>
                ★ {project.store.rating} from {project.store.reviews} reviews
              </span>
            )}
          </div>
        )}
      </div>
      <div className="dialog-actions">
        <ExternalLink
          className="text-link"
          href={projectStore(project).url}
          onClick={trackExternal("store_link_click", {
            project: project.title,
            source: "case-study",
          })}
        >
          View on {projectStore(project).name} <Arrow diagonal />
        </ExternalLink>
        <button
          type="button"
          className="button primary"
          onClick={() => onStart(project)}
        >
          Want {project.website ? "a site" : "an app"} like this? Let’s talk <Arrow diagonal />
        </button>
      </div>
      {next && (
        <button type="button" className="case-next" onClick={onNext}>
          <img src={next.icon} alt="" width="160" height="160" />
          <span>
            <span className="case-next-label">Next case study</span>
            {next.title}
          </span>
          <Arrow />
        </button>
      )}
    </Dialog>
  );
}

function LeadShortcuts() {
  const [pinned, setPinned] = useState(true);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("wa-pill-dismissed") === "1";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const contactSection = document.getElementById("contact");
    if (!contactSection) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(contactSection);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <div className={pinned ? "sticky-cta" : "sticky-cta hidden"}>
        <a
          className="button primary"
          href="#contact"
          onClick={trackExternal("sticky_cta_click")}
        >
          Start your project <Arrow />
        </a>
        <ExternalLink
          className="sticky-wa"
          href={whatsappUrl()}
          aria-label="Chat on WhatsApp"
          onClick={trackExternal("whatsapp_click", { from: "sticky-bar" })}
        >
          <WhatsAppIcon size={19} />
        </ExternalLink>
      </div>
      {pinned && !dismissed && (
        <div className="wa-pill">
          <ExternalLink
            href={whatsappUrl()}
            onClick={trackExternal("whatsapp_click", { from: "desktop-pill" })}
          >
            <WhatsAppIcon /> WhatsApp me
          </ExternalLink>
          <button
            type="button"
            className="wa-pill-close"
            aria-label="Hide WhatsApp shortcut"
            onClick={() => {
              setDismissed(true);
              try {
                localStorage.setItem("wa-pill-dismissed", "1");
              } catch {
                /* storage can be disabled */
              }
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [preselect, setPreselect] = useState(null);
  useEffect(() => {
    const slug = decodeURIComponent(location.hash.replace("#case-", ""));
    const match = projects.find(
      (project) => location.hash.startsWith("#case-") && project.slug === slug,
    );
    if (match) setActiveProject(match);
  }, []);
  const nextProject =
    activeProject && projects.length > 1
      ? projects[(projects.indexOf(activeProject) + 1) % projects.length]
      : null;
  function openCase(project) {
    setActiveProject(project);
    track("case_study_open", { project: project.title });
    history.replaceState(null, "", `#case-${project.slug}`);
  }
  function closeCase() {
    setActiveProject(null);
    if (location.hash.startsWith("#case-")) {
      history.replaceState(null, "", `${location.pathname}${location.search}`);
    }
  }
  function startFromCase(project) {
    setPreselect({ type: "Mobile app", source: project.title });
    track("case_study_cta", { project: project.title });
    closeCase();
    requestAnimationFrame(() => {
      scrollToContact();
      const section = document.getElementById("contact");
      section?.setAttribute("tabindex", "-1");
      section?.focus({ preventScroll: true });
    });
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Statement />
        <Work onOpenCase={openCase} />
        <Proof />
        <About />
        <Process />
        <Expertise />
        <Faq />
        <Contact preselect={preselect} />
      </main>
      <footer className="footer wrap">
        <a
          href="#home"
          className="footer-mark"
          aria-label="Axel Asa, back to top"
        >
          axel asa<span>.</span>
        </a>
        <span>
          © {new Date().getFullYear()} Axel Asa. Designed and built by me.
        </span>
        <div className="footer-socials">
          {socialLinks.map(([name, href]) => (
            <ExternalLink key={name} href={href}>
              {name}
              <Arrow diagonal width="12" height="12" />
            </ExternalLink>
          ))}
        </div>
        <a href="#home" className="back-top" aria-label="Back to top">
          ↑
        </a>
      </footer>
      {activeProject && (
        <CaseStudyDialog
          // Remount per project so the dialog scrolls to the top and replays its entrance.
          key={activeProject.slug}
          project={activeProject}
          next={nextProject}
          onClose={closeCase}
          onStart={startFromCase}
          onNext={() => openCase(nextProject)}
        />
      )}
      <LeadShortcuts />
    </>
  );
}

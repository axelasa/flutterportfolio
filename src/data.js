// Screens are cropped from the Play listings with scripts/make-webp.mjs.
import capitalfm from "../assets/projects/capital_fm.webp";
import craftmyskin from "../assets/projects/craftmyskin.webp";
import lct from "../assets/projects/lct.webp";
import health from "../assets/projects/my_1health.webp";
import capitalfmIcon from "../assets/projects/capital_fm-icon.webp";
import craftmyskinIcon from "../assets/projects/craftmyskin-icon.webp";
import lctIcon from "../assets/projects/lct-icon.webp";
import healthIcon from "../assets/projects/my_1health-icon.webp";
import capitalfmSmall from "../assets/projects/capital_fm-960.webp";
import craftmyskinSmall from "../assets/projects/craftmyskin-960.webp";
import lctSmall from "../assets/projects/lct-960.webp";
import healthSmall from "../assets/projects/my_1health-960.webp";
import cougars from "../assets/projects/cougars.webp";
import cougarsSmall from "../assets/projects/cougars-960.webp";
import cougarsIcon from "../assets/projects/cougars-icon.webp";
import cargo from "../assets/projects/dafric_cargo_flow.png";
import tracker from "../assets/projects/dafric_tracker.png";
import driver from "../assets/projects/dafric_driver.png";
import partner from "../assets/projects/dafric_partner.png";

export const socialLinks = [
  ["GitHub", "https://github.com/axelasa"],
  ["LinkedIn", "https://www.linkedin.com/in/axel-asa-855203141/"],
  ["Instagram", "https://www.instagram.com/codewithaxel/"],
  ["X", "https://x.com/AxelAsa2"],
  ["TikTok", "https://www.tiktok.com/@axelasa0"],
];

// ---------------------------------------------------------------------------
// Contact shortcuts. Confirm the WhatsApp number:
//   whatsapp: digits only, with country code, e.g. '254712345678'
// ---------------------------------------------------------------------------
export const contact = {
  whatsapp: "254755485006",
  email: "asaaxel84@gmail.com",
};

export const bookingUrl = "https://cal.com/axel-asa-vakuh1";

export const whatsappUrl = (
  message = "Hi Axel, I would like to discuss a project with you.",
) => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;

// Projects shown in the work section. Counts and filters derive from this
// list, so adding or removing an entry updates the whole page automatically.
//
// TODO: confirm the `stack` for the projects marked below. Empty arrays hide
// the technology chips inside the case study dialog.
export const projects = [
  {
    title: "Capital FM",
    slug: "capital-fm",
    category: "Entertainment",
    description:
      "The official Capital FM Kenya app. Live radio, DJ downloads, breaking local and international news, sport, and lifestyle in one place.",
    image: capitalfm,
    imageSmall: capitalfmSmall,
    icon: capitalfmIcon,
    app: "com.capitalfm.capitalfm",
    color: "sand",
    detail: "Live radio & news · Mobile development",
    // TODO: confirm this stack.
    stack: ["Flutter", "Dart", "Firebase"],
    challenge:
      "Listeners had to juggle several places to follow the station: one app for live radio, another for music and downloads, and social feeds for news and sport.",
    approach:
      "One app for the whole audience: live streaming, DJ downloads, breaking local and international news, sport, and lifestyle updates, wrapped in an interface that gets out of the way.",
    outcome:
      "A new release that puts the station’s full lineup in listeners’ pockets, from the morning show to the latest headlines.",
    store: { release: true },
  },
  {
    title: "My1Health",
    slug: "my1health",
    category: "Healthcare",
    description:
      "A simpler path to better care. Helping people find the right medical specialist and access healthcare services.",
    image: health,
    imageSmall: healthSmall,
    icon: healthIcon,
    app: "com.my1health.health",
    color: "aqua",
    detail: "Healthcare access · Mobile development",
    stack: ["Flutter", "Dart", "Firebase"],
    challenge:
      "Finding the right specialist and arranging care usually means phone calls, guesswork, and records scattered across providers.",
    approach:
      "A patient-first app with secure medical records, video consultations, family health management, and specialist search in one place.",
    outcome:
      "5K+ downloads and care that starts in minutes: patients find specialists, consult by video, and keep records in one secure place.",
    store: { downloads: "5K+" },
  },
  {
    title: "CraftMySkin",
    slug: "craftmyskin",
    category: "Beauty",
    description:
      "A personal beauty organizer. Build daily cosmetic routines, keep a digital vanity, and stay consistent with simple self-care logs.",
    image: craftmyskin,
    imageSmall: craftmyskinSmall,
    icon: craftmyskinIcon,
    app: "com.craftmyskin.craftmyskin",
    appStore: "https://apps.apple.com/us/app/craftmyskin/id6764001837",
    color: "lavender",
    detail: "Beauty routines & self-care · Mobile development",
    // TODO: confirm this stack.
    stack: ["Flutter", "Dart", "Firebase"],
    challenge:
      "Beauty lovers track products, routines, and habits across notes, screenshots, and memory, so consistent routines rarely stick.",
    approach:
      "A clean mobile organizer with custom morning and evening routines, a digital vanity for saved products, daily habit logging, and personalised inspiration.",
    outcome:
      "A 4.8 star rating from early users who now keep their routines consistent and their product collections organised in one place.",
    store: { downloads: "10+", rating: 4.8, reviews: 5 },
  },
  {
    title: "LCT Africa",
    slug: "lct-africa",
    category: "Healthcare",
    description:
      "Health insurance, easier to navigate. Giving members a convenient way to keep track of their cover.",
    image: lct,
    imageSmall: lctSmall,
    icon: lctIcon,
    app: "net.lctafrica",
    appStore: "https://apps.apple.com/us/app/lct-africa/id1641866282",
    color: "blue",
    detail: "Health insurance · Mobile development",
    // TODO: confirm this stack.
    stack: ["Flutter", "Dart", "Firebase"],
    challenge:
      "Members had to call the insurer to check their cover, follow up on claims, or confirm policy details.",
    approach:
      "A member app that keeps policy details, cover, and claims in one clear place, easy to reach from any phone.",
    outcome:
      "50K+ downloads and a 4.2 star rating from members who now check their cover without calling an office.",
    store: { downloads: "50K+", rating: 4.2, reviews: 116 },
  },
  {
    title: "JKUAT Cougars RFC",
    slug: "cougars-rfc",
    category: "Sports",
    description:
      "The official website of JKUAT Cougars Rugby Club. Fixtures and live scores, matchday squads, player profiles, club news, and the kit shop.",
    image: cougars,
    imageSmall: cougarsSmall,
    icon: cougarsIcon,
    website: "https://cougarsrfc.com",
    color: "blue",
    detail: "Rugby club website · Web development",
    stack: ["React", "TypeScript", "Tailwind CSS", "Go", "Fiber", "PostgreSQL"],
    challenge:
      "Fans followed the club through scattered social posts, with no single home for fixtures, results, squad news, or official merchandise.",
    approach:
      "A fast, mobile-first club site: fixtures and results with live scores, matchday selection, squad and technical bench profiles, honours, news, a fan zone, and a kit shop.",
    outcome:
      "Live at cougarsrfc.com for the 2026/27 season, giving fans and sponsors one official place to follow the club.",
  },
];

// The four Dafric apps were retired from the live Google Play listings, so
// they no longer appear in the work section. Nothing is deleted: move any
// entry back into `projects` (and re-add its import above) to restore it.
export const archivedProjects = [
  {
    title: "Dafric Cargo",
    slug: "dafric-cargo",
    category: "Logistics",
    description:
      "Bringing the moving parts of logistics together. A client app for managing cargo orders, from booking to delivery.",
    image: cargo,
    app: "dafric.africa.app.client",
    color: "sage",
    detail: "Order management · Mobile development",
    stack: ["Flutter", "Dart", "Firebase"],
    challenge:
      "Coordinating cargo orders across phone calls, emails, and paperwork left customers unsure where their shipments stood at any moment.",
    approach:
      "A Flutter client app where businesses book cargo, upload documents, and follow every order on one clear timeline, from pickup to delivery.",
    outcome:
      "Customers manage bookings end to end without calling an office, and both sides share the same live status for every shipment.",
    store: null,
  },
  {
    title: "Dafric Tracker",
    slug: "dafric-tracker",
    category: "Logistics",
    description:
      "Keeping fleets in view. A vehicle tracking app that helps partners stay connected to their vehicles.",
    image: tracker,
    app: "com.dafric.dafrictracker",
    color: "sand",
    detail: "Fleet tracking · Mobile development",
    stack: ["Flutter", "Dart", "Firebase"],
    challenge:
      "Fleet owners relied on phone check-ins to know where vehicles were and whether jobs were on schedule.",
    approach:
      "A tracking app that puts live vehicle positions and job status in partners’ hands, any time of day, on any phone.",
    outcome:
      "Partners see their fleet at a glance and answer customer questions instantly, without a single phone call.",
    store: null,
  },
  {
    title: "Dafric Driver",
    slug: "dafric-driver",
    category: "Logistics",
    description:
      "Supporting the people behind every delivery, with tools to manage drivers and their allocated vehicles.",
    image: driver,
    app: "dafric.africa.app.driver",
    color: "lavender",
    detail: "Driver operations · Mobile development",
    stack: ["Flutter", "Dart", "Firebase"],
    challenge:
      "Dispatchers and drivers coordinated assignments through calls and messages, so details got lost between trips.",
    approach:
      "A driver app that receives assignments, vehicle details, and trip updates directly, so every job starts with the full picture.",
    outcome:
      "Drivers pick up work from the app instead of the phone, and dispatch spends less time chasing updates.",
    store: null,
  },
  {
    title: "Dafric Partner",
    slug: "dafric-partner",
    category: "Logistics",
    description:
      "A clearer picture of every job. Helping logistics partners keep track of job progress and payments.",
    image: partner,
    app: "dafric.africa.app.partner",
    color: "peach",
    detail: "Partner operations · Mobile development",
    stack: ["Flutter", "Dart", "Firebase"],
    challenge:
      "Partners had no simple view of active jobs, completed work, or what they were owed, making reconciliation slow.",
    approach:
      "A partner app that tracks every job from acceptance to payment, with a clear record of earnings and history.",
    outcome:
      "Partners check job progress and payments on their phones, and disputes shrink because everyone sees the same record.",
    store: null,
  },
];

// Proof shown in the numbers bar. App count is derived from `projects`; the
// download and rating figures come from the live Google Play listings
// (LCT Africa 50K+ and 4.2, My1Health 5K+, CraftMySkin 10+ and 4.8).
export const stats = [
  [String(projects.length), "apps live in the stores right now"],
  ["55K+", "downloads between them"],
  ["4.5", "average rating where people left one"],
  ["3", "industries: media, beauty and healthcare"],
];

export const processSteps = [
  [
    "01",
    "Intro call",
    "Fifteen minutes, free. You tell me what you want to build and who it is for, I ask a lot of questions.",
  ],
  [
    "02",
    "Scope and a fixed quote",
    "A written scope, a timeline and one fixed price, before I write a line of code.",
  ],
  [
    "03",
    "Weekly builds",
    "You get something you can tap through every week, so you never have to wonder how it is going.",
  ],
  [
    "04",
    "Launch and support",
    "I handle the store submissions and the release, then stick around for fixes and the next version.",
  ],
];

export const faqs = [
  [
    "How much does a project cost?",
    "Every project is quoted per scope, so you pay one fixed price agreed before work begins. A focused mobile app usually starts in the low thousands, and larger products are staged so you can launch sooner and spread the cost. The intro call gives you a realistic range for free.",
  ],
  [
    "How long does an app take to build?",
    "A focused first version usually takes 6 to 12 weeks. You get a timeline with your quote, and you see progress every week, so the delivery date never becomes a mystery.",
  ],
  [
    "Do you work with clients outside Kenya?",
    "Yes. I work remotely with clients across Africa, Europe, and North America, as well as in the UAE and Saudi Arabia. I keep my hours flexible for your timezone. We communicate on WhatsApp, email, or video, whichever suits you.",
  ],
  [
    "What do you need from me to start?",
    "A short description of the problem you are solving and who it is for. We shape the rest together on the intro call. If you already have designs or an existing product, we start from there.",
  ],
  [
    "Who owns the code and the accounts?",
    "You do. The code, the app store listings, and every account created for your project are yours from day one.",
  ],
  [
    "What happens after launch?",
    "Launch support is included, and ongoing maintenance is available as a simple monthly plan for updates, fixes, and new features.",
  ],
];

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const publicDir = path.join(root, "public");
const output = path.resolve(root, "..", "First-Client-Lab-Standalone.html");

const mime = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".pdf": "application/pdf" };
const dataUri = (name) => {
  const ext = path.extname(name).toLowerCase();
  return `data:${mime[ext]};base64,${fs.readFileSync(path.join(publicDir, name)).toString("base64")}`;
};

const assets = {
  tai: dataUri("tai-lopez-ai-smma-official.webp"),
  clickfunnels: dataUri("clickfunnels-product.png"),
  alex: dataUri("alex-hormozi.jpg"),
  brian: dataUri("brian-tracy.png"),
  growthday: dataUri("growthday-logo.png"),
  kit: dataUri("first-client-launch-kit-cover.png"),
  kitPdf: dataUri("first-client-launch-kit.pdf"),
};

const programs = [
  {
    slug: "tai-lopez-smma", name: "Tai Lopez AI SMMA", operator: "Tai Lopez",
    category: "Done-for-you AI agency system", image: assets.tai,
    imageAlt: "Tai Lopez speaking in the official AI SMMA presentation",
    headline: "Build an AI-powered social media service business from home.",
    summary: "Tai presents AI SMMA as a done-for-you system for starting a business from home using AI and social media.",
    problemTitle: "AI tools are not an offer.",
    problem: "Knowing AI tools does not give you a service clients can buy. The bottleneck is turning that capability into one clear social media offer tied to a business result.",
    mechanism: "The official page starts with a 16-minute presentation about Tai’s done-for-you AI SMMA system. The next step is an application to claim a spot.",
    points: ["AI + social media agency model", "Presented as a done-for-you system", "16-minute presentation, then application"],
    cta: "Watch the AI SMMA presentation",
    url: "https://tailopez.com/aismma/A5345541", affiliate: true,
  },
  {
    slug: "clickfunnels", name: "ClickFunnels — 3 Months for $99", operator: "ClickFunnels",
    category: "90-day funnel-building offer", image: assets.clickfunnels,
    imageAlt: "ClickFunnels product wordmark",
    headline: "Give your funnel 90 days to prove itself—not 14.",
    summary: "A longer, lower-cost runway for service businesses, coaches and creators who are ready to build and test a complete funnel.",
    problemTitle: "A short trial can expire before the funnel is working.",
    problem: "You need enough time for the page, follow-up and traffic to work together—not another disconnected tool that never reaches launch.",
    mechanism: "The official promotion provides three months of ClickFunnels for $99, with pages, email, automations and measurement in one system.",
    points: ["Three months for $99", "Pages, email and automations together", "Built for one offer ready to launch"],
    cta: "Get 3 months for $99",
    url: "https://www.clickfunnels.com/3-months-for-99?aff=153e794460350ec7f40210df38d8189c3026242c83e5dea21d81d3da97ac312a", affiliate: true,
  },
  {
    slug: "acquisition-com", name: "Acquisition.com Resources", operator: "Alex Hormozi / Acquisition.com",
    category: "Business growth education", image: assets.alex, imageAlt: "Alex Hormozi portrait",
    headline: "Make your offer easier to understand—and harder for the right buyer to ignore.",
    summary: "Books and resources focused on stronger offers, lead generation and better business models.",
    problemTitle: "A weak offer makes every channel more expensive.",
    problem: "If prospects cannot quickly see the outcome and why it matters, more traffic rarely fixes the problem.",
    mechanism: "Acquisition.com resources turn offer design, lead generation and business growth into practical frameworks you can apply.",
    points: ["Practical offer frameworks", "Lead-generation principles", "Built for founders and service businesses"],
    cta: "Explore Acquisition.com resources", url: "https://www.acquisition.com/books", affiliate: false,
  },
  {
    slug: "brian-tracy", name: "Brian Tracy Programs", operator: "Brian Tracy International",
    category: "Sales and business education", image: assets.brian, imageAlt: "Brian Tracy portrait",
    headline: "Replace improvised sales conversations with skills you can practise and repeat.",
    summary: "Structured learning across sales, communication, goals and professional performance.",
    problemTitle: "Good leads are lost when the sales conversation is weak.",
    problem: "More opportunities do not help when discovery, value communication and follow-up depend on improvisation.",
    mechanism: "Brian Tracy programs teach sales and communication through structured principles designed to become repeatable habits.",
    points: ["Sharper discovery conversations", "Clearer value communication", "Repeatable follow-up habits"],
    cta: "Explore Brian Tracy programs", url: "https://www.briantracy.com/", affiliate: false,
  },
  {
    slug: "growthday", name: "GrowthDay", operator: "GrowthDay",
    category: "Personal performance", image: assets.growthday, imageAlt: "GrowthDay wordmark",
    headline: "Turn good intentions into a growth routine you can actually repeat.",
    summary: "A personal-development platform combining coaching, routines and learning content.",
    problemTitle: "Motivation is unreliable without a system.",
    problem: "Progress gets pushed behind the urgent when goals, reflection, learning and action have no repeatable structure.",
    mechanism: "GrowthDay brings daily routines, coaching and personal-development content into one membership designed for regular use.",
    points: ["Daily personal-growth structure", "Coaching and learning together", "Goals, habits and performance"],
    cta: "Explore GrowthDay", url: "https://www.growthday.com/gd", affiliate: false,
  },
];

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>First Client Lab — Choose Your Next Growth System</title>
<meta name="description" content="Focused reviews and launch tools for building an offer, funnel, sales process and first-client system.">
<style>
:root{--ink:#12251d;--muted:#607069;--paper:#fbfaf6;--wash:#f0eee6;--green:#174b37;--lime:#c9f27b;--line:#d8dcd5;--white:#fff;--shadow:0 18px 55px rgba(18,37,29,.12)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.5}body.modal-open{overflow:hidden}a{color:inherit}img{display:block;max-width:100%}button,input{font:inherit}.wrap{width:min(1160px,calc(100% - 40px));margin:auto}.header{position:sticky;top:0;z-index:30;background:rgba(251,250,246,.94);backdrop-filter:blur(15px);border-bottom:1px solid var(--line)}.nav{height:72px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{font:800 19px/1 Georgia,serif;text-decoration:none;letter-spacing:-.02em}.navlinks{display:flex;align-items:center;gap:24px}.navlinks a{text-decoration:none;font-size:14px;font-weight:700}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:13px 20px;border-radius:12px;border:1px solid var(--green);background:var(--green);color:#fff;text-decoration:none;font-weight:800;cursor:pointer;transition:.18s transform,.18s background}.btn:hover{transform:translateY(-1px);background:#0e3c2a}.btn.alt{background:transparent;color:var(--green)}.eyebrow{font-size:12px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--green)}h1,h2,h3{font-family:Georgia,"Times New Roman",serif;letter-spacing:-.035em;line-height:1.04;margin:0}h1{font-size:clamp(46px,6.4vw,84px)}h2{font-size:clamp(34px,4vw,58px)}h3{font-size:27px}p{margin:0}.hero{padding:88px 0 72px}.hero-grid,.vendor-hero{display:grid;grid-template-columns:1.08fr .92fr;gap:68px;align-items:center}.hero-copy>p,.vendor-copy>p{font-size:19px;color:var(--muted);max-width:680px;margin-top:22px}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.proof{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:30px 0 0;padding:0;list-style:none}.proof li{padding:15px;border:1px solid var(--line);border-radius:12px;font-size:14px;font-weight:750;background:#fff}.hero-art{background:var(--green);color:#fff;padding:34px;border-radius:28px;min-height:460px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:var(--shadow)}.hero-art .big{font:700 clamp(38px,5vw,66px)/.98 Georgia,serif}.hero-art small{color:#dce9e2}.section{padding:84px 0;border-top:1px solid var(--line)}.section-head{display:flex;justify-content:space-between;gap:30px;align-items:end;margin-bottom:32px}.section-head p{max-width:560px;color:var(--muted)}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;min-height:100%;box-shadow:0 7px 25px rgba(18,37,29,.05)}.card-img{height:220px;background:var(--wash);overflow:hidden}.card-img img{width:100%;height:100%;object-fit:cover}.card-body{display:flex;flex:1;flex-direction:column;padding:23px}.card h3{margin:8px 0 12px}.card p{color:var(--muted)}.card .card-link{margin-top:auto;padding-top:20px;font-weight:850;color:var(--green)}.vendor{padding:54px 0 92px}.vendor-hero{min-height:610px}.vendor-copy h1{font-size:clamp(42px,5.4vw,72px)}.vendor-visual{position:relative;background:#e9eee7;padding:26px 26px 0;border-radius:28px;overflow:hidden}.vendor-visual img{width:100%;height:520px;object-fit:cover;object-position:center top;border-radius:18px 18px 0 0}.affiliate-note{font-size:12px!important;margin-top:13px!important;color:#66736d!important}.split{display:grid;grid-template-columns:1fr 1fr;gap:55px;align-items:start}.problem{background:var(--white);border:1px solid var(--line);border-radius:22px;padding:34px}.problem p{color:var(--muted);margin-top:15px;font-size:17px}.mechanism{padding:20px 0}.mechanism p{font-size:20px;color:var(--muted);margin-top:18px}.kit{display:grid;grid-template-columns:.72fr 1.28fr;gap:46px;align-items:center;background:var(--green);color:#fff;border-radius:28px;padding:42px}.kit img{width:100%;max-height:420px;object-fit:contain;filter:drop-shadow(0 20px 30px rgba(0,0,0,.25))}.kit h2{margin:8px 0 18px}.kit p{color:#dce9e2}.form{display:flex;gap:10px;margin-top:24px}.form input{flex:1;min-width:0;min-height:54px;border:0;border-radius:11px;padding:0 16px;font-size:16px}.form .btn{background:var(--lime);border-color:var(--lime);color:var(--ink)}.status{min-height:23px;font-size:13px;margin-top:10px!important}.guide{padding:84px 0}.guide-list{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:34px 0}.guide-item{background:#fff;border:1px solid var(--line);padding:24px;border-radius:16px}.guide-item b{display:block;font-family:Georgia,serif;font-size:23px;margin-bottom:8px}.footer{padding:34px 0 100px;border-top:1px solid var(--line);color:var(--muted);font-size:13px}.footer-row{display:flex;justify-content:space-between;gap:24px}.footer a{margin-left:16px}.mobile-sticky{display:none}.modal{position:fixed;inset:0;z-index:80;background:rgba(9,24,17,.72);display:none;place-items:center;padding:20px}.modal.open{display:grid}.modal-card{position:relative;width:min(820px,100%);display:grid;grid-template-columns:.8fr 1.2fr;background:var(--white);border-radius:24px;overflow:hidden;box-shadow:var(--shadow)}.modal-cover{background:var(--green);padding:28px}.modal-cover img{height:330px;width:100%;object-fit:contain}.modal-copy{padding:38px}.modal-copy p{color:var(--muted);margin-top:12px}.close{position:absolute;right:12px;top:12px;width:42px;height:42px;border:0;border-radius:50%;background:var(--wash);font-size:24px;cursor:pointer}.not-found{text-align:center;padding:120px 20px}.hidden{display:none!important}
@media(max-width:900px){.hero-grid,.vendor-hero,.split,.kit{grid-template-columns:1fr}.hero-art{min-height:340px}.cards{grid-template-columns:repeat(2,1fr)}.vendor-visual{order:-1}.vendor-visual img{height:440px}.kit img{max-height:300px}.section-head{display:block}.section-head p{margin-top:12px}}
@media(max-width:680px){.wrap{width:min(100% - 28px,1160px)}.header .nav{height:62px}.navlinks a:not(.nav-cta){display:none}.nav-cta{min-height:42px;padding:9px 12px}.hero{padding:52px 0}.hero-grid{gap:32px}.hero-art{min-height:300px;padding:25px}.proof{grid-template-columns:1fr}.section{padding:58px 0}.cards{grid-template-columns:1fr}.card-img{height:230px}.vendor{padding:26px 0 100px}.vendor-hero{display:flex;flex-direction:column;gap:30px;min-height:0}.vendor-visual{width:100%;padding:16px 16px 0;border-radius:20px}.vendor-visual img{height:340px}.actions{display:grid}.actions .btn{width:100%}.kit{padding:24px;gap:20px}.form{display:grid}.guide-list{grid-template-columns:1fr}.footer-row{display:block}.footer-links{margin-top:14px}.footer a{margin:0 14px 0 0}.mobile-sticky{display:block;position:fixed;z-index:50;left:0;right:0;bottom:0;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(251,250,246,.97);border-top:1px solid var(--line)}.mobile-sticky .btn{width:100%;min-height:50px}.modal-card{grid-template-columns:1fr}.modal-cover{display:none}.modal-copy{padding:30px 22px}.modal-copy h2{font-size:34px}}
</style></head><body>
<!-- DEVELOPER HANDOFF
  This is a self-contained static website. Images and the PDF are embedded.
  Set window.FCL_CONFIG.leadEndpoint below to the lead POST endpoint and eventEndpoint
  to the optional server-side affiliate-event endpoint.
  It must return a successful HTTP status only after saving the lead and triggering the kit email.
  metaPixelId is the UBM Trainings Meta dataset/pixel. Add a GA4 or Google Ads tag ID to googleTagId when available.
  Direct vendor buttons work without a backend. Affiliate URLs are already inserted for Tai Lopez AI SMMA and ClickFunnels.
-->
<script>window.FCL_CONFIG={leadEndpoint:"/api/leads",eventEndpoint:"/api/events",metaPixelId:"1679259859838157",googleTagId:""};</script>
<header class="header"><div class="wrap nav"><a class="brand" href="#/">First Client Lab</a><nav class="navlinks"><a href="#/programs">Programs</a><a href="#/guide">Free guide</a><a class="btn nav-cta" href="#/reviews/tai-lopez-smma">Explore AI SMMA</a></nav></div></header>
<main id="app"></main>
<div id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-card"><button class="close" aria-label="Close">×</button><div class="modal-cover"><img src="${assets.kit}" alt="First Client Launch Kit cover"></div><div class="modal-copy"><span class="eyebrow">Free launch kit</span><h2 id="modal-title">Turn your next idea into a client-ready offer.</h2><p>Get the practical worksheet by email, then continue to the program you were reviewing.</p><form class="form capture-form"><input type="email" name="email" required autocomplete="email" placeholder="Your best email" aria-label="Email address"><button class="btn" type="submit">Send my kit</button></form><p class="status" aria-live="polite"></p></div></div></div>
<script>
const PROGRAMS=${JSON.stringify(programs)};
const KIT_PDF=${JSON.stringify(assets.kitPdf)};
const KIT_COVER=${JSON.stringify(assets.kit)};
${fs.readFileSync(path.join(here, "standalone-client.js"), "utf8")}
</script></body></html>`;

fs.writeFileSync(output, html);
console.log(output);

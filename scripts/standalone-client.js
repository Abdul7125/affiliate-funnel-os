const app = document.querySelector("#app");
const modal = document.querySelector("#modal");
let activeProgram = null;
let popupShown = false;
const ATTRIBUTION_KEY = "fcl_attribution_v1";

function eventId(prefix = "event") {
  return `${prefix}-${Date.now()}-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;
}

function cookieValue(name) {
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
}

function captureAttribution() {
  const params = new URLSearchParams(location.search);
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "{}"); } catch {}
  const fbclid = params.get("fbclid") || stored.fbclid || "";
  const current = {
    landingPage: stored.landingPage || location.href,
    referrer: stored.referrer || document.referrer || "",
    utmSource: params.get("utm_source") || stored.utmSource || "",
    utmMedium: params.get("utm_medium") || stored.utmMedium || "",
    utmCampaign: params.get("utm_campaign") || stored.utmCampaign || "",
    utmContent: params.get("utm_content") || stored.utmContent || "",
    utmTerm: params.get("utm_term") || stored.utmTerm || "",
    gclid: params.get("gclid") || stored.gclid || "",
    gbraid: params.get("gbraid") || stored.gbraid || "",
    wbraid: params.get("wbraid") || stored.wbraid || "",
    fbclid,
    fbc: cookieValue("_fbc") || stored.fbc || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : ""),
    fbp: cookieValue("_fbp") || stored.fbp || "",
  };
  try { localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current)); } catch {}
  return { ...current, pageUrl: location.href };
}

function initTracking() {
  const pixelId = window.FCL_CONFIG?.metaPixelId;
  if (pixelId && !window.fbq) {
    const fbq = window.fbq = function () { if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments); else fbq.queue.push(arguments); };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    fbq("init", pixelId);
  }

  const googleTagId = window.FCL_CONFIG?.googleTagId;
  if (googleTagId && !window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", googleTagId, { send_page_view: false });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagId)}`;
    document.head.appendChild(script);
  }
}

function track(name, parameters = {}, standard = false, id = eventId(name.toLowerCase())) {
  const enriched = { ...parameters, page_location: location.href };
  if (window.fbq) window.fbq(standard ? "track" : "trackCustom", name, enriched, { eventID: id });
  if (window.gtag) window.gtag("event", name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase(), { ...enriched, event_id: id });
  return id;
}

function trackVendorExit(program, ctaLocation = "unknown", email = "", leadEventId = "") {
  const id = eventId("affiliate-click");
  track("AffiliateOutboundClick", {
    content_name: program.name,
    content_category: program.category,
    content_ids: [program.slug],
    destination_url: program.url,
    cta_location: ctaLocation,
    lead_event_id: leadEventId,
  }, false, id);
  const endpoint = window.FCL_CONFIG?.eventEndpoint;
  if (endpoint) fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ eventId: id, leadEventId, program: program.slug, ctaLocation, destinationUrl: program.url, email, attribution: captureAttribution() }),
  }).catch(() => {});
  return id;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const card = (p) => `<article class="card"><div class="card-img"><img src="${p.image}" alt="${esc(p.imageAlt)}"></div><div class="card-body"><span class="eyebrow">${esc(p.category)}</span><h3>${esc(p.name)}</h3><p>${esc(p.summary)}</p><a class="card-link" href="#/reviews/${p.slug}">See if it fits →</a></div></article>`;

function footer() {
  return `<footer class="footer"><div class="wrap footer-row"><span>© ${new Date().getFullYear()} First Client Lab. Educational content only.</span><span class="footer-links"><a href="#/affiliate-disclosure">Affiliate disclosure</a><a href="#/guide">Download the guide</a></span></div></footer>`;
}

function home() {
  activeProgram = null;
  return `<section class="hero"><div class="wrap hero-grid"><div class="hero-copy"><span class="eyebrow">Build the system before buying more noise</span><h1>Choose the next system your business actually needs.</h1><p>Focused program reviews for entrepreneurs building a clear offer, a working funnel, stronger sales conversations and consistent execution.</p><div class="actions"><a class="btn" href="#/reviews/tai-lopez-smma">Explore AI SMMA</a><a class="btn alt" href="#/programs">Compare the programs</a></div></div><div class="hero-art"><small>THE FIRST CLIENT PATH</small><div class="big">Offer.<br>Funnel.<br>Conversation.<br>Client.</div><small>One problem. One useful next step.</small></div></div></section><section id="programs" class="section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Focused recommendations</span><h2>Start with the bottleneck.</h2></div><p>Do not choose by personality or hype. Choose the program that solves the constraint stopping your next client or launch.</p></div><div class="cards">${PROGRAMS.map(card).join("")}</div></div></section>${kitSection("homepage")}`;
}

function vendor(p) {
  activeProgram = p;
  const disclosure = p.affiliate ? '<p class="affiliate-note">We may earn a commission if you apply through this link.</p>' : "";
  return `<article class="vendor"><section><div class="wrap vendor-hero"><div class="vendor-copy"><span class="eyebrow">${esc(p.operator)} · ${esc(p.category)}</span><h1>${esc(p.headline)}</h1><p>${esc(p.summary)}</p><ul class="proof">${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><div class="actions"><a class="btn vendor-link" data-program="${esc(p.slug)}" data-cta-location="hero" href="${p.url}" target="_blank" rel="sponsored noopener">${esc(p.cta)} →</a><button class="btn alt open-kit" type="button">Get the free launch kit</button></div>${disclosure}</div><div class="vendor-visual"><img src="${p.image}" alt="${esc(p.imageAlt)}"></div></div></section><section class="section"><div class="wrap split"><div class="problem"><span class="eyebrow">The problem</span><h2>${esc(p.problemTitle)}</h2><p>${esc(p.problem)}</p></div><div class="mechanism"><span class="eyebrow">What this offer changes</span><h2>One focused route forward.</h2><p>${esc(p.mechanism)}</p><div class="actions"><a class="btn vendor-link" data-program="${esc(p.slug)}" data-cta-location="body" href="${p.url}" target="_blank" rel="sponsored noopener">${esc(p.cta)} →</a></div></div></div></section>${kitSection(p.slug, p)}<div class="mobile-sticky"><a class="btn vendor-link" data-program="${esc(p.slug)}" data-cta-location="mobile-sticky" href="${p.url}" target="_blank" rel="sponsored noopener">${esc(p.cta)} →</a></div></article>`;
}

function kitSection(source, p = null) {
  const continuation = p ? `After submission, you will continue directly to ${esc(p.name)}.` : "Use it to define the problem, promise and first outreach sprint.";
  return `<section class="section"><div class="wrap"><div class="kit"><img src="${KIT_COVER}" alt="First Client Launch Kit cover"><div><span class="eyebrow" style="color:#c9f27b">Free practical worksheet</span><h2>Build the offer before you chase the traffic.</h2><p>Get the First Client Launch Kit by email. ${continuation}</p><form class="form capture-form" data-source="${esc(source)}"><input type="email" name="email" required autocomplete="email" placeholder="Your best email" aria-label="Email address"><button class="btn" type="submit">Send my kit${p ? " & continue" : ""}</button></form><p class="status" aria-live="polite"></p></div></div></div></section>`;
}

function guide() {
  activeProgram = null;
  return `<section class="guide"><div class="wrap"><span class="eyebrow">Your free resource</span><h1>The First Client Launch Kit</h1><p style="font-size:19px;color:var(--muted);max-width:720px;margin-top:20px">A compact worksheet for choosing one audience, one costly problem, one starter offer and one seven-day outreach sprint.</p><div class="guide-list"><div class="guide-item"><b>1. Define</b><p>Choose a reachable buyer and a visible problem.</p></div><div class="guide-item"><b>2. Package</b><p>Turn the problem into a small, specific service.</p></div><div class="guide-item"><b>3. Launch</b><p>Run a focused seven-day conversation sprint.</p></div></div><a class="btn kit-download" href="${KIT_PDF}" download="First-Client-Launch-Kit.pdf">Download the PDF</a></div></section>`;
}

function disclosure() {
  activeProgram = null;
  return `<section class="guide"><div class="wrap" style="max-width:780px"><span class="eyebrow">Transparency</span><h1>Affiliate disclosure</h1><p style="font-size:19px;color:var(--muted);margin-top:24px">Some program links on this website are affiliate links. If you apply or purchase through one of those links, First Client Lab may receive a commission at no additional cost to you. Recommendations are organized around the business problem each program is designed to address.</p></div></section>`;
}

function notFound() { return '<div class="not-found"><h1>Page not found</h1><p><a href="#/">Return home</a></p></div>'; }

function render() {
  const route = location.hash.slice(1) || "/";
  let body;
  if (route === "/" || route === "/programs") body = home();
  else if (route === "/guide") body = guide();
  else if (route === "/affiliate-disclosure") body = disclosure();
  else if (route.startsWith("/reviews/")) {
    const p = PROGRAMS.find((x) => x.slug === route.split("/").pop());
    body = p ? vendor(p) : notFound();
  } else body = notFound();
  app.innerHTML = body + footer();
  bind();
  track("PageView", { page_path: route, page_title: document.title }, true);
  if (activeProgram) track("ViewContent", { content_name: activeProgram.name, content_category: activeProgram.category, content_ids: [activeProgram.slug], content_type: "product" }, true);
  if (route === "/programs") requestAnimationFrame(() => document.querySelector("#programs")?.scrollIntoView());
  else scrollTo(0, 0);
}

function openKit() { modal.classList.add("open"); document.body.classList.add("modal-open"); track("LeadMagnetOpen", { content_name: "First Client Launch Kit", source: activeProgram?.slug || "site" }); setTimeout(() => modal.querySelector("input")?.focus(), 50); }
function closeKit() { modal.classList.remove("open"); document.body.classList.remove("modal-open"); }
function bind() {
  document.querySelectorAll(".open-kit").forEach((b) => b.addEventListener("click", openKit));
  document.querySelectorAll(".capture-form").forEach((form) => {
    if (form.dataset.bound) return;
    form.dataset.bound = "1";
    form.addEventListener("submit", submitLead);
    form.querySelector("input")?.addEventListener("focus", () => {
      if (form.dataset.openTracked) return;
      form.dataset.openTracked = "1";
      track("LeadFormOpen", { source: form.dataset.source || activeProgram?.slug || "popup", content_name: "First Client Launch Kit" });
    });
  });
  document.querySelectorAll(".kit-download").forEach((link) => link.addEventListener("click", () => track("LeadMagnetDownload", { file_name: "First-Client-Launch-Kit.pdf" })));
  document.querySelectorAll(".vendor-link").forEach((link) => link.addEventListener("click", () => {
    const program = PROGRAMS.find((item) => item.slug === link.dataset.program);
    if (program) trackVendorExit(program, link.dataset.ctaLocation || "unknown");
  }));
}

async function submitLead(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const status = form.querySelector(".status") || form.parentElement.querySelector(".status");
  const button = form.querySelector("button");
  const email = form.elements.email.value.trim();
  const source = form.dataset.source || activeProgram?.slug || "popup";
  if (!email) return;
  const endpoint = window.FCL_CONFIG?.leadEndpoint;
  if (!endpoint) { status.textContent = "Email delivery is not connected yet. Please use the direct program button."; return; }
  button.disabled = true;
  button.textContent = "Sending…";
  status.textContent = "";
  try {
    const leadId = eventId("lead");
    const program = activeProgram;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, source, eventId: leadId, program: program?.slug || "", redirectUrl: program?.url || "", attribution: captureAttribution() }),
    });
    if (!response.ok) throw new Error("Request failed");
    status.textContent = "Your kit is on its way.";
    track("Lead", { content_name: "First Client Launch Kit", source, content_category: program?.category || "lead_magnet" }, true, leadId);
    if (program) {
      trackVendorExit(program, "email-submit-redirect", email, leadId);
      setTimeout(() => { location.href = program.url; }, 300);
    }
    else setTimeout(() => { location.hash = "#/guide"; }, 300);
  } catch {
    status.textContent = "We could not save your email. Please try again or use the direct program button.";
    button.disabled = false;
    button.textContent = "Try again";
  }
}

modal.querySelector(".close").addEventListener("click", closeKit);
modal.addEventListener("click", (e) => { if (e.target === modal) closeKit(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeKit(); });
addEventListener("hashchange", render);
initTracking();
captureAttribution();
render();
setTimeout(() => { if (!popupShown && location.hash !== "#/guide") { popupShown = true; openKit(); } }, 25000);
addEventListener("scroll", () => { if (!popupShown && scrollY / (document.documentElement.scrollHeight - innerHeight) > .48) { popupShown = true; openKit(); } }, { passive: true });
document.addEventListener("mouseout", (e) => { if (!popupShown && innerWidth > 900 && e.clientY <= 0) { popupShown = true; openKit(); } });

import Link from 'next/link';

export function Header() {
  return <header className="site-header shell">
    <Link className="brand" href="/" aria-label="Affiliate Funnel OS home"><span className="brand-mark">AF</span><span>Affiliate Funnel OS</span></Link>
    <nav className="main-nav" aria-label="Main navigation"><a href="/calculator">Calculator</a><a href="/funnel-audit">Audit</a><a href="/funnel-templates">Templates</a><a href="/admin">Admin</a></nav>
    <a className="header-cta" href="/free-funnel-guide">Get the guide</a>
  </header>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="shell footer-grid">
      <div><Link className="brand" href="/"><span className="brand-mark">AF</span><span>Affiliate Funnel OS</span></Link><p>Practical funnel education with explicit, configurable affiliate routing.</p></div>
      <div><b>Explore</b><a href="/calculator">Calculator</a><a href="/funnel-audit">Audit</a><a href="/funnel-map">Map</a><a href="/funnel-templates">Templates</a><a href="/free-funnel-guide">Guide</a></div>
      <div><b>Operations</b><a href="/admin">Dashboard</a><a href="/admin/sequences">Sequences</a><a href="/affiliate-disclosure">Affiliate disclosure</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
    </div>
    <div className="shell footer-bottom"><span>© 2026 Affiliate Funnel OS</span><span>Education, not income guarantees. Results depend on execution and market conditions.</span></div>
  </footer>;
}

export function PageHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <section className="page-hero shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{body}</p></section>;
}

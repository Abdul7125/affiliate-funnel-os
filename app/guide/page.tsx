import { Footer, Header, PageHero } from '../site-shell';

export const metadata = { title: 'First Client Launch Kit — First Client Lab', description: 'A practical seven-day plan for shaping and testing a first social media service offer.' };
const days = [
  ['Day 1', 'Choose a narrow client', 'Pick one business type you can understand and reach. Write down five recurring marketing problems you can observe.'],
  ['Day 2', 'Define the starter outcome', 'Turn one problem into a small, specific deliverable with a clear time frame and boundary.'],
  ['Day 3', 'Create one proof asset', 'Produce a sample audit, content plan, or before-and-after concept that demonstrates your thinking.'],
  ['Day 4', 'Build a prospect list', 'Find 20 relevant businesses and record one genuine observation about each one.'],
  ['Day 5', 'Start conversations', 'Send short, personalized messages that lead with the observation—not a copied sales pitch.'],
  ['Day 6', 'Run discovery calls', 'Understand the business problem before presenting your service as the answer.'],
  ['Day 7', 'Review the evidence', 'Measure replies, useful conversations, objections, and proposals. Improve the weakest step.'],
];
export default function Guide() { return <main><Header /><PageHero eyebrow="Free field guide" title="Your seven-day first-client launch kit." body="A small, practical sprint for turning a general interest in social media marketing into a credible service offer and real market feedback." />
  <section className="section shell"><div className="guide-download-card"><div><p className="eyebrow">Printable workbook</p><h2>Download the complete First Client Launch Kit.</h2><p>Ten practical pages covering your market, offer, prospect list, outreach, discovery calls, mini audit, and seven-day scoreboard.</p></div><a className="primary-button" href="/first-client-launch-kit.pdf" download>Download the PDF →</a></div></section>
  <section className="guide-layout shell"><aside className="guide-index"><b>Inside the kit</b>{days.map(([day,title]) => <a key={day} href={`#${day.replace(' ','-').toLowerCase()}`}>{day} · {title}</a>)}<a href="#scorecard">Offer scorecard</a></aside><div className="guide-days">{days.map(([day,title,text]) => <article id={day.replace(' ','-').toLowerCase()} key={day}><span>{day}</span><h2>{title}</h2><p>{text}</p><div className="action-box"><b>Finish line</b><p>Complete one visible deliverable before moving to the next day.</p></div></article>)}</div></section>
  <section className="scorecard" id="scorecard"><div className="shell"><p className="eyebrow">Offer scorecard</p><h2>Before you pitch, answer these six questions.</h2><ol><li>Who is this specifically for?</li><li>What costly or frustrating problem does it address?</li><li>What exactly will the client receive?</li><li>What is deliberately outside the scope?</li><li>What proof or reasoning supports the approach?</li><li>What is the simplest next step for the client?</li></ol></div></section>
  <Footer /></main>; }

import { entries, entryList, type EntryKey } from './content-data';
import { FunnelLeadForm } from './funnel-lead-form';
import { Footer, Header } from './site-shell';

export function EntryPage({ entryKey }: { entryKey: EntryKey }) {
  const entry = entries[entryKey];
  return <main>
    <Header />
    <section className="funnel-hero shell"><div className="funnel-hero-copy"><p className="eyebrow">{entry.tag}</p><h1>{entry.title}</h1><p className="lede">{entry.body}</p><div className="hero-proof"><strong>{entry.promise}</strong><span>No hidden checkout. No invented affiliate links.</span></div><ul className="check-list">{entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div><FunnelLeadForm entry={entryKey} /></section>
    <section className="asset-rail"><div className="shell"><div className="section-heading"><div><p className="eyebrow">The shared learning path</p><h2>Useful education before offer routing.</h2></div><p>Everyone receives the same foundation first. At Asset 4, the business-type answer controls the more relevant nurture and recommendation path.</p></div><div className="asset-grid">{[1, 2, 3, 4].map((number) => { const asset = [
      ['01', 'Foundation', 'Clarify the audience, offer, and next action.'], ['02', 'Message match', 'Connect ad, page, opt-in, and follow-up.'], ['03', 'Helpful follow-up', 'Teach the decision before you sell software.'], ['04', 'Intent selection', 'Choose a business-type template and branch.'],
    ][number - 1]; return <article className={number === 4 ? 'asset-card asset-branch' : 'asset-card'} key={number}><span>{asset[0]}</span><h3>{asset[1]}</h3><p>{asset[2]}</p></article>; })}</div></div></section>
    <section className="entry-switcher shell"><p className="eyebrow">Other entry angles</p><div>{entryList.filter((item) => item.key !== entryKey).map((item) => <a href={item.path} key={item.key}><strong>{item.tag}</strong><span>{item.title}</span> →</a>)}</div></section>
    <Footer />
  </main>;
}

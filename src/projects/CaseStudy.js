import { clean, linkFor } from '../canvas/content';

// Panel content for a project node. Renders the sections of a project (see
// _template/index.js), skipping any that are empty.
export default function CaseStudy({ project }) {
  const { status, problem, media = [], snippet } = project;
  const tools = clean(project.tools);
  const code = clean(project.code).map(linkFor).filter(Boolean);
  const demo = project.demo && linkFor(project.demo.trim());

  return (
    <>
      {status === 'draft' && (
        <p className="draft-note">Case study in progress. More details coming soon.</p>
      )}

      {problem?.trim() && (
        <section>
          <h3>Problem</h3>
          {problem.split(/\n\s*\n/).map((p, i) => <p key={i}>{p.trim()}</p>)}
        </section>
      )}

      {tools.length > 0 && (
        <section>
          <h3>Tools</h3>
          <ul className="tags">
            {tools.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>
      )}

      {media.length > 0 && (
        <section>
          <h3>Screenshots</h3>
          {media.map((m) => (
            <figure key={m.src} className="media">
              <img src={m.src} alt={m.alt} loading="lazy" />
              {m.caption && <figcaption>{m.caption}</figcaption>}
            </figure>
          ))}
        </section>
      )}

      {(code.length > 0 || snippet) && (
        <section>
          <h3>Code</h3>
          {snippet && (
            <pre className="snippet"><code>{snippet.text}</code></pre>
          )}
          {code.length > 0 && (
            <ul className="links">
              {code.map((c) => (
                <li key={c.href}><a href={c.href} target="_blank" rel="noopener noreferrer">{c.label}</a></li>
              ))}
            </ul>
          )}
        </section>
      )}

      {demo && (
        <section>
          <h3>Demo</h3>
          <p><a href={demo.href} target="_blank" rel="noopener noreferrer">Open the live demo</a></p>
        </section>
      )}
    </>
  );
}

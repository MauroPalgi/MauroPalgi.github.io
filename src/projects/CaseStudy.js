// Panel content for a project block. Renders the sections of a project file
// (see _template/index.js), skipping any that are empty.
export default function CaseStudy({ project }) {
  const { status, problem, tools, media, code, snippet, demo } = project;

  return (
    <>
      {status === 'draft' && (
        <p className="draft-note">Case study in progress. More details coming soon.</p>
      )}

      {problem && (
        <section>
          <h3>Problem</h3>
          {typeof problem === 'string' ? <p>{problem}</p> : problem}
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
          <p><a href={demo} target="_blank" rel="noopener noreferrer">Open the live demo</a></p>
        </section>
      )}
    </>
  );
}

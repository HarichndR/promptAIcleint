'use client';

export default function GuidePage() {
  const sections = [
    { id: 'markdown', title: 'Using Markdown' },
    { id: 'headings', title: 'Headings & Text' },
    { id: 'lists', title: 'Lists & Blocks' },
    { id: 'code', title: 'Code & Prompts' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-reveal">
      <section style={{ backgroundColor: 'white', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-16) 0' }}>
        <div className="site-container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>Writing <span style={{ color: 'var(--color-primary)' }}>Guide</span></h1>
          <p style={{ fontSize: '1.25rem' }}>Learn how to use Markdown to structure your prompt descriptions and instructions properly.</p>
        </div>
      </section>

      <div className="site-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 250px', gap: 'var(--space-12)', padding: 'var(--space-16) 0' }}>
        <main style={{ maxWidth: '800px' }}>
          <section id="markdown" style={{ marginBottom: 'var(--space-16)' }}>
            <h2>Using Markdown in Descriptions</h2>
            <p>Our platform uses Markdown to help you format your prompt descriptions. This makes your content readable and organized for the community.</p>
          </section>

          <section id="headings" style={{ marginBottom: 'var(--space-16)' }}>
             <h3>Headings & Emphasis</h3>
             <div className="clean-border" style={{ padding: 'var(--space-6)', backgroundColor: '#f8fafc', marginBottom: 'var(--space-4)' }}>
                <code># Heading 1</code><br/>
                <code>## Heading 2</code><br/>
                <code>**Bold Text**</code><br/>
                <code>*Italic Text*</code>
             </div>
             <p>Use headings to separate different parts of your description like 'Goal', 'Role', or 'Parameters'.</p>
          </section>

          <section id="lists" style={{ marginBottom: 'var(--space-16)' }}>
            <h3>Lists & Organization</h3>
            <div className="clean-border" style={{ padding: 'var(--space-6)', backgroundColor: '#f8fafc', marginBottom: 'var(--space-4)' }}>
                <code>- Bullet Point 1</code><br/>
                <code>- Bullet Point 2</code><br/>
                <br/>
                <code>1. Step One</code><br/>
                <code>2. Step Two</code>
            </div>
            <p>Perfect for listing variables or specific constraints for the AI.</p>
          </section>

          <section id="code" style={{ marginBottom: 'var(--space-16)' }}>
            <h3>Prompt & Code Blocks</h3>
            <div className="clean-border" style={{ padding: 'var(--space-6)', backgroundColor: '#f8fafc', marginBottom: 'var(--space-4)' }}>
                <pre style={{ margin: 0 }}>
                  ```<br/>
                  Your technical prompt or <br/>
                  code logic goes here<br/>
                  ```
                </pre>
            </div>
            <p>Use code blocks to isolate specific parts of a prompt or complex instructions.</p>
          </section>
        </main>

        <aside className="hide-mobile" style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
          <h4 style={{ marginBottom: 'var(--space-6)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Contents</h4>
          <nav>
            {sections.map(s => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className="footer-link" style={{ textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', marginBottom: 'var(--space-4)', paddingLeft: 0 }}>
                {s.title}
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}

// Builds a text PDF from the blocks currently on the canvas. Each block's JSX
// content is rendered to static HTML and walked into headings, paragraphs and
// lists. jsPDF and react-dom/server are loaded on demand to keep them out of
// the main bundle.

const PAGE_MARGIN = 20; // mm
const LINE = 1.45; // line height factor

// jsPDF's built-in fonts only cover Latin-1, so map common typographic
// characters to plain ones and drop anything else outside that range.
function sanitize(text) {
  return text
    .replace(/[–—]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/[^ -\xFF]/g, '')
    .trim();
}

export async function buildCanvasPdf(blocks) {
  const [{ jsPDF }, { renderToStaticMarkup }] = await Promise.all([
    import('jspdf'),
    import('react-dom/server'),
  ]);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const textW = pageW - PAGE_MARGIN * 2;
  let y = PAGE_MARGIN;

  const write = (raw, { size = 10.5, style = 'normal', color = 20, indent = 0, gap = 1.5, font = 'helvetica' } = {}) => {
    const text = sanitize(raw);
    if (!text) return;
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lineH = (size * 0.3528) * LINE; // pt to mm
    for (const line of doc.splitTextToSize(text, textW - indent)) {
      if (y + lineH > pageH - PAGE_MARGIN) {
        doc.addPage();
        y = PAGE_MARGIN;
      }
      doc.text(line, PAGE_MARGIN + indent, y + lineH * 0.75);
      y += lineH;
    }
    y += gap;
  };

  const walk = (node) => {
    for (const el of node.children) {
      const tag = el.tagName.toLowerCase();
      if (tag === 'h3') write(el.textContent, { size: 12, style: 'bold', gap: 1 });
      else if (tag === 'p') write(el.textContent);
      else if (tag === 'pre') write(el.textContent, { size: 9, font: 'courier' });
      else if (tag === 'ul' && el.classList.contains('tags')) {
        write([...el.children].map((li) => li.textContent).join(', '));
      } else if (tag === 'ul') {
        for (const li of el.children) write(`- ${li.textContent}`, { indent: 4, gap: 0.8 });
        y += 1.5;
      } else if (tag === 'figure') {
        const caption = el.querySelector('figcaption');
        if (caption) write(`[Image] ${caption.textContent}`, { color: 110 });
      } else walk(el);
    }
  };

  for (const block of blocks) {
    if (block.kind === 'profile') {
      write(block.title, { size: 22, style: 'bold', gap: 1 });
      write(block.subtitle, { size: 12, color: 90, gap: 4 });
    } else {
      y += 4;
      write(block.title, { size: 16, style: 'bold', gap: 0.5 });
      write(block.subtitle, { size: 10, color: 110, gap: 2.5 });
    }
    const html = renderToStaticMarkup(<>{block.content}</>);
    walk(new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html').body.firstChild);
  }

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(`mauropalgi.github.io  ·  ${i}/${pages}`, PAGE_MARGIN, pageH - 10);
  }

  return doc;
}

export async function downloadCanvasPdf(blocks) {
  const doc = await buildCanvasPdf(blocks);
  doc.save('mauro-palgi-portfolio.pdf');
}

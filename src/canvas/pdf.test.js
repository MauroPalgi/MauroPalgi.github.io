import { buildCanvasPdf } from './pdf';
import { initialNodes } from '../data/diagram';

test('the PDF contains the text of every node', async () => {
  const doc = await buildCanvasPdf(initialNodes);
  const raw = doc.output();
  for (const text of ['Mauro Palgi', 'Academic background', 'Data Analyst', 'Education', 'Baufest', 'Libre Coop', 'Strengths', 'mauro.palgi@gmail.com', 'Multiplayer Games']) {
    expect(raw).toContain(text);
  }
});

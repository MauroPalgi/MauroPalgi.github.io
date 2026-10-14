import { buildCanvasPdf } from './pdf';
import { blocks } from '../data/blocks';

test('the PDF contains the text of every block', async () => {
  const doc = await buildCanvasPdf(blocks);
  const raw = doc.output();
  for (const text of ['Mauro Palgi', 'Experience', 'Baufest', 'Skills', 'mauro.palgi@gmail.com', 'Multiplayer Games']) {
    expect(raw).toContain(text);
  }
});

import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

test('renders a block for each section', () => {
  render(<App />);
  for (const title of ['Mauro Palgi', 'About', 'Experience', 'Skills', 'Contact', 'Projects']) {
    expect(screen.getByRole('button', { name: new RegExp(title) })).toBeInTheDocument();
  }
});

test('opens a block in a panel and closes it with Escape', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Contact/ }));
  expect(screen.getByRole('dialog')).toHaveTextContent('mauro.palgi@gmail.com');

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

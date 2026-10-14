import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import projects from './projects';

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

test('renders a block for each project and opens its case study', () => {
  render(<App />);
  for (const project of projects) {
    expect(screen.getByRole('button', { name: new RegExp(project.title) })).toBeInTheDocument();
  }

  fireEvent.click(screen.getByRole('button', { name: new RegExp(projects[0].title) }));
  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveTextContent(projects[0].tools[0]);
  expect(dialog).toHaveTextContent(/in progress/);
});

test('opens a block in a panel and closes it with Escape', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Contact/ }));
  expect(screen.getByRole('dialog')).toHaveTextContent('mauro.palgi@gmail.com');

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

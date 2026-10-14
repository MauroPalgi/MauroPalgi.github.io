import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { initialNodes } from './data/diagram';

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

beforeEach(() => {
  window.localStorage.clear();
});

const nodeButton = (title) => screen.getByRole('button', { name: new RegExp(`^\\w+ ${title}`) });
const paletteItem = (container, type) => container.querySelector(`.palette__item.block--${type}`);

test('renders a node for every node in the diagram', () => {
  render(<App />);
  for (const node of initialNodes) {
    expect(nodeButton(node.title)).toBeInTheDocument();
  }
});

test('opens a node in a panel and closes it with Escape', () => {
  render(<App />);
  fireEvent.click(nodeButton('Contact'));
  expect(screen.getByRole('dialog')).toHaveTextContent('mauro.palgi@gmail.com');

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('adds a text node from the palette and configures it', () => {
  const { container } = render(<App />);
  fireEvent.click(paletteItem(container, 'text'));

  // A new node opens straight into its edit form.
  const dialog = screen.getByRole('dialog');
  fireEvent.change(within(dialog).getByLabelText('Title'), { target: { value: 'Hobbies' } });
  fireEvent.change(within(dialog).getByLabelText('Text'), { target: { value: 'Game jams and pixel art.' } });
  fireEvent.change(within(dialog).getByLabelText('Connected to'), { target: { value: 'about' } });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Done' }));

  expect(dialog).toHaveTextContent('Game jams and pixel art.');
  expect(nodeButton('Hobbies')).toBeInTheDocument();
});

test('edits a list node', () => {
  render(<App />);
  fireEvent.click(nodeButton('Skills'));
  const dialog = screen.getByRole('dialog');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Edit' }));
  fireEvent.change(within(dialog).getByLabelText('Items'), { target: { value: 'Rust\nGodot' } });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Done' }));

  expect(within(dialog).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Rust', 'Godot']);
});

test('deletes a node, and Reset brings it back', () => {
  render(<App />);
  fireEvent.click(nodeButton('Education'));
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete node' }));
  expect(screen.queryByRole('button', { name: /Education/ })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Reset canvas' }));
  expect(nodeButton('Education')).toBeInTheDocument();
});

test('the PDF node offers a download', () => {
  const { container } = render(<App />);
  fireEvent.click(paletteItem(container, 'pdf'));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByRole('button', { name: 'Download PDF' })).toBeInTheDocument();
  expect(within(dialog).queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
});

test('saves the canvas to the browser and restores it on the next visit', () => {
  const first = render(<App />);
  const saveButton = screen.getByRole('button', { name: 'Save to this browser' });
  expect(saveButton).toBeDisabled();

  fireEvent.click(nodeButton('Strengths'));
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete node' }));
  expect(screen.getByRole('status')).toHaveTextContent('Unsaved changes');

  fireEvent.click(saveButton);
  expect(screen.getByRole('status')).toHaveTextContent('Saved in this browser');
  first.unmount();

  render(<App />);
  expect(screen.queryByRole('button', { name: /Strengths/ })).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Saved in this browser');
});

test('Reset asks before deleting a saved canvas', () => {
  render(<App />);
  fireEvent.click(nodeButton('Strengths'));
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete node' }));
  fireEvent.click(screen.getByRole('button', { name: 'Save to this browser' }));

  window.confirm = jest.fn(() => false);
  fireEvent.click(screen.getByRole('button', { name: 'Reset canvas' }));
  expect(window.confirm).toHaveBeenCalled();
  expect(screen.queryByRole('button', { name: /Strengths/ })).not.toBeInTheDocument();

  window.confirm = jest.fn(() => true);
  fireEvent.click(screen.getByRole('button', { name: 'Reset canvas' }));
  expect(nodeButton('Strengths')).toBeInTheDocument();
  expect(window.localStorage.getItem('portfolio-canvas')).toBeNull();
});

test('ignores a saved canvas from an older version of the site', () => {
  window.localStorage.setItem('portfolio-canvas', JSON.stringify({ version: 1, base: 'old', nodes: [] }));
  render(<App />);
  expect(nodeButton('Academic background')).toBeInTheDocument();
});

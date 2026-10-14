import Canvas from './canvas/Canvas';
import { initialNodes } from './data/diagram';

function App() {
  return <Canvas initialNodes={initialNodes} />;
}

export default App;

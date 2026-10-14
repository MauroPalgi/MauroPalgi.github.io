import Canvas from './canvas/Canvas';
import { blocks, edges } from './data/blocks';

function App() {
  return <Canvas blocks={blocks} edges={edges} />;
}

export default App;

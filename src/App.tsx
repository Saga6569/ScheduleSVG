import { FieldWithMoveablePoint } from './components/Fields/FieldWithMoveablePoint';
import { FieldWithPointsGeneration } from './components/Fields/FieldWithPointsGeneration';
import { Graph } from './components/Graph/Graph';
import './App.css';

function App() {
  return (
    <div className="App">
      <FieldWithMoveablePoint/>
      <FieldWithPointsGeneration/>
      <Graph values={ [6, 7, 8 ,9, 10, 8, 6, 4, 3] }/>
    </div>
  );
}

export default App;

import { FieldWithMoveablePoint } from './components/Fields/FieldWithMoveablePoint';
import { FieldWithPointsGeneration } from './components/Fields/FieldWithPointsGeneration';
import { Graph } from './components/Graph/Graph';
import { Graph2 } from './components/Graph/Graph2';
import { GraphCircle } from './components/GraphCircle/GraphCircle';
import './App.css';

function App() {

  //const data: any = [ { value:[6, 7, 8 ,9, 10, 8, 6, 4, 3],  }, {typeGraphics: 'line' ,value:[6, 7, 8 ,9, 10, 8, 6, 4, 3],  }]


  const data: any = {value: [6, 7, 8 ,9, 10, 8, 6, 4, 3], collors: {backgroundColor: '#c0c0fa', dotColor: '#000080', } };

  return (
    <div className="App">
      <FieldWithMoveablePoint/>
      <FieldWithPointsGeneration/>
      <Graph values={ [6, 7, 8 ,9, 10, 8, 6, 4, 3] }/>
      <Graph2 values={ data }/>
      <GraphCircle values={ [1, 1, 1 ,1, 1, 1, 1, 1, 1]}/>
    </div>
  );
}

export default App;

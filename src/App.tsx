import { FieldWithMoveablePoint } from './components/Fields/FieldWithMoveablePoint';
import { FieldWithPointsGeneration } from './components/Fields/FieldWithPointsGeneration';
import { Graph } from './components/Graph/Graph';
import { Graph2 } from './components/Graph/Graph2';
import GraphCircle from './components/GraphCircle/GraphCircle';
import './App.css';

function App() {

  //const data: any = [ { value:[6, 7, 8 ,9, 10, 8, 6, 4, 3],  }, {typeGraphics: 'line' ,value:[6, 7, 8 ,9, 10, 8, 6, 4, 3],  }]

  const res = [{value: 2, name: 'Пермь'}, {value: 4, name: 'Москва'}, {value: 6, name: 'Сочи'}, {value: 6, name: 'Осиновик'}, {value: 11, name: 'Новосибирск'}, {value: 12, name: 'Томск'}, {value: 5, name: 'Губаха'} ]
  const data: any = {value: [6, 7, 8 ,9, 10, 8, 6, 4, 3], collors: {backgroundColor: '#c0c0fa', dotColor: '#000080', } };

  return (
    <div className="App">
      <FieldWithMoveablePoint/>
      <FieldWithPointsGeneration/>
      <Graph values={ [6, 7, 8 ,9, 10, 8, 6, 4, 3] }/>
      <Graph2 values={ data }/>
      <GraphCircle values={res}/>
    </div>
  );
}

export default App;

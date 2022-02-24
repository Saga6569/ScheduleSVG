import { FieldWithMoveablePoint } from './components/Fields/FieldWithMoveablePoint';
import { FieldWithPointsGeneration } from './components/Fields/FieldWithPointsGeneration';
import { Graph } from './components/Graph/Graph';
import { Graph2 } from './components/Graph/Graph2';
import GraphCircle from './components/GraphCircle/GraphCircle';
import VertillePlot from './components/VertillePlot/VertillePlot';
import './App.css';

function App() {

  //const data: any = [ { value:[6, 7, 8 ,9, 10, 8, 6, 4, 3],  }, {typeGraphics: 'line' ,value:[6, 7, 8 ,9, 10, 8, 6, 4, 3],  }]

  const res = [
    {value: 2, name: 'Пермь'}, 
    {value: 4, name: 'Москва'}, 
    {value: 6, name: 'Сочи'}, 
    {value: 6, name: 'Осиновик'}, 
    {value: 11, name: 'Новосибирск'}, 
    {value: 12, name: 'Томск'}, 
    {value: 5, name: 'Губаха'} 
  ];

  const data: any = {value: [6, 7, 8 ,9, 10, 8, 6, 4, 3], collors: {backgroundColor: '#c0c0fa', dotColor: '#000080', } };

  const res2 = [
    {value: 2350, name: 'Пермь'}, 
    {value: 1200, name: 'Москва'}, 
    {value: 3454, name: 'Сочи'}, 
    {value: 5000, name: 'Осиновик'}, 
    {value: 4563, name: 'Новосибирск'}, 
    {value: 2345, name: 'Томск'}, 
    {value: 4999, name: 'Губаха'},
    {value: 2345, name: 'Томск'}, 
    {value: 4100, name: 'Губаха'},
  ];

  return (
    <div className="App">
      <FieldWithMoveablePoint/>
      <FieldWithPointsGeneration/>
      <Graph values={ [6, 7, 8 ,9, 10, 8, 6, 4, 3] }/>
      <Graph2 values={ data }/>
      <GraphCircle values={res}/>
      <VertillePlot values={ res2 }/>
    </div>
  );
}

export default App;

import { FieldWithMoveablePoint } from './components/Fields/FieldWithMoveablePoint';
import { FieldWithPointsGeneration } from './components/Fields/FieldWithPointsGeneration';
import { Graph } from './components/Graph/Graph';
import { Graph2 } from './components/Graph/Graph2';
import LineGraph from './components/LineGraph/LineGraph';
import GraphCircle from './components/GraphCircle/GraphCircle';
import VertillePlot from './components/VertillePlot/VertillePlot';
import './App.css';

const App = () => {

  const res = [
    {value: 2, name: 'Пермь'}, 
    {value: 4, name: 'Москва'}, 
    {value: 6, name: 'Сочи'}, 
    {value: 6, name: 'Осиновик'}, 
    {value: 11, name: 'Новосибирск'}, 
    {value: 12, name: 'Томск'}, 
    {value: 5, name: 'Губаха'} 
  ];

  const res2 = [
    {value: 1665, name: 'Пермь'}, 
    {value: 4516, name: 'Москва'}, 
    {value: 3144, name: 'Сочи'}, 
    {value: 2535, name: 'Осиновик'}, 
    {value: 1513, name: 'Новосибирск'}, 
    {value: 2521, name: 'Томск'}, 
    {value: 7285, name: 'Губаха'},
    {value: 5124, name: 'Томск'}, 
    {value: 3345, name: 'Губаха'},
  ];

  const param: any = {graphRadius: 200, strokeWidth: 150}

  const datas = [
    {name: 'shop1', values: [ 1, 0, 3 ,0, 5, 0 ]},
    {name: 'shop2', values: [ 10, 9, 8 ,7, 6, 5, 4, 3, 2 ]},
    {name: 'shop3', values: [ 7, 7, 8 ,9, 10, 5, 3, 4, 3 ]},
  ];

  return (
    <div className="App">
      <LineGraph data={datas} />
      <GraphCircle values={res} options={param} />
      <VertillePlot values={ res2 }/>
    </div>
  );
}

export default App;

import { FieldWithMoveablePoint } from './components/Fields/FieldWithMoveablePoint';
import { FieldWithPointsGeneration } from './components/Fields/FieldWithPointsGeneration';
import  L from './components/L/L'
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
    {name: 'shop2', values: [ 10, 9, 8 ,7, 6, 5, 4, 3, 2, 1, 0, 1 ]},
    {name: 'shop3', values: [ 7, 7, 8 ,9, 10, 5, 3, 4, 3 ]},
  ];

  const data2 = [
    {name: 'shop1', values: [ 1665, 4516, 4516 , 3144, 2521, 7285]},
    {name: 'shop2', values: [ 3234, 5342, 3132 , 2311, 3132, 4233, 4212, 3123, 1234, 4422, 2412, 2341 ]},
    {name: 'shop3', values: [ 4232, 4231, 2312 , 4231, 3342, 2314, 1234, 4212, 4223 ]},
    {name: 'shop4', values: [ 2000, 2000, 4000 , 4000, 3000, 3500, 4500, 5000, 5000 ]},
  ];

  return (
    <div className="App">
      {/* <LineGraph data={datas} />
      <GraphCircle values={res} options={param} />
      <VertillePlot values={ res2 }/> */}
      <L data={ data2 } ></L>
    </div>
  );
}

export default App;

import LineGraph from './components/LineGraph/LineGraph'
import GraphCircle from './components/GraphCircle/GraphCircle';
import VertillePlot from './components/VertillePlot/VertillePlot';
import './App.css';

const App = () => {



  const data2 = [
    { name: 'shop1', value: [432, 532, 432, 413, 553, 132] },
    { name: 'shop2', value: [341, 321, 312, 321, 114, 533, 222, 883, 421, 563, 768, 986] },
    { name: 'shop3', value: [235, 845, 646, 540, 348, 248, 111, 544, 456] },
    { name: 'shop4', value: [200, 200, 400, 400, 300, 350, 450, 500, 500] },
  ];

  const res = [
    { value: 350, name: 'Пермь' },
    { value: 541, name: 'Москва' },
    { value: 312, name: 'Сочи' },
    { value: 451, name: 'Осиновик' },
    { value: 512, name: 'Новосибирск' },
    { value: 655, name: 'Томск' },
    { value: 125, name: 'Губаха' }
  ];

  return (
    <div className="App">
      <LineGraph data={data2} />
      <GraphCircle values={res} />
      <VertillePlot values={res} />
    </div>
  );
}

export default App;

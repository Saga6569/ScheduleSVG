import styles from './VertillePlot.module.css';
import _ from 'lodash'
import { useState } from 'react';

//interface IoptionInformGraf { x: number; y: number; color?: string; name: string; value?: number; visit: boolean;};

interface IpropsDataEl {
  name: string;
  value: number[];
  color?: string;
  coment?: string;
};

interface IGraphProps {
  data: IpropsDataEl[]
  option?: { backgroundColor: string }
};

interface IelState {
  value: number[];
  name: string;
  color: string;
  id: string;
  coment: string;
  maxValue: number;
  minValue: number;
  sumValue: number;
  VectorGraphics: number
  vizible: boolean;
  opacity: number;
  strokeWidth: number;
  target: boolean;
};


const creatingGraph = (arrValue: number[], pxOfValue: number, chartStep: number) => {
  let step = 45;
  const points: any = arrValue.flatMap((el: number) => {
    const x = step;
    const y = (825) - (el / pxOfValue);
    step += chartStep;
    return [x, y];
  });
  return points;
};

const upDate = (props: IGraphProps) => {
  const colors = ['blue', 'red', 'Peru', 'SlateGrey', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'Fuchsia'];
  const newData = [];
  for (let i = 0; i <= props.data.length - 1; i++) {
    const el: IpropsDataEl = props.data[i];
    const value = el.value;
    const name = el.name;
    const color = el.color ?? colors[i];
    const coment = el.coment ?? '';
    const id = _.uniqueId();
    const maxValue = Math.max(...value);
    const minValue = Math.min(...value);
    const sumValue = _.sum(value);
    const VectorGraphics = Math.round(sumValue / value.length);
    const vizible = true;
    const opacity = 1;
    const strokeWidth = 4;
    const target = false;
    newData[i] = { id, value, name, color, coment, maxValue, minValue, VectorGraphics, sumValue, vizible, opacity, strokeWidth, target };
  };
  return newData;
};

const hendleonMouseEnterElState = (collectionEl: IelState, state: IelState[], setState: Function) => {
  if (collectionEl.vizible === false) {
    return;
  };
  const newState = state.map((el: IelState) => {
    if (collectionEl.id === el.id) {
      el.strokeWidth = 6;
      el.opacity = 1;
      el.target = true;
      return el;
    };
    el.target = false;
    el.strokeWidth = 3;
    el.opacity = 0.2;
    return el;
  });
  setState(newState);
};

const hendleonMouseOutElState = (collectionEl: IelState, state: IelState[], setState: Function) => {
  if (collectionEl.vizible === false) {
    return;
  };
  const newState = state.map((el: IelState) => {
    el.strokeWidth = 5;
    el.opacity = 1;
    el.target = false;
    return el;
  })
  setState(newState);
};

const drawingInformation = (state: IelState[], setState: Function) => {
  const stateInformation = state.map((elRender: IelState) => {
    const textColor = elRender.vizible === true ? elRender.color : 'DarkGrey'
    const textNameEl = <text style={{ 'transitionProperty': 'fill', 'transitionDuration': '0.5s' }} x="40" y="25" fontSize="18" fill={textColor}
      onMouseEnter={() => hendleonMouseEnterElState(elRender, state, setState)}
      onMouseOut={() => hendleonMouseOutElState(elRender, state, setState)}
      onClick={() => {
        const newState = state.map((el: IelState) => {
          if (el.id === elRender.id) {
            el.vizible = el.vizible === false ? true : false;
          };
          el.strokeWidth = 6;
          el.opacity = 1;
          return el;
        })
        setState(newState)
      }}
    >{elRender.name}</text>;
    const ValueMax = <text x="40" y="45" fontSize="18" fill={'black'}>{`Максимально значение ${elRender.maxValue}`}</text>;
    const ValueMin = <text x="40" y="65" fontSize="18" fill={'black'}>{`Минимально значение ${elRender.minValue}`}</text>;
    const ValueSred = <text x="40" y="85" fontSize="18" fill={'black'}>{`Среднее значение ${elRender.VectorGraphics}`}</text>;
    return (<svg>
      {textNameEl}
      {/* {ValueMax}
      {ValueMin}
      {ValueSred} */}
    </svg>)
  })
  return (
    <div className={styles.information}>
      {stateInformation}
    </div>
  );
};

const backgroundColorCell = (state: IelState[], el: IelState | any, key: string) => {
  if (key === 'name') {
    return
  }
  const arrValue = state.map((el: IelState | any) => el[key]);
  if (Math.max(...arrValue) === el[key]) {
    return { backgroundColor: 'Green' };
  };
  if (Math.min(...arrValue) === el[key]) {
    return { backgroundColor: 'red' };
  };
  return { backgroundColor: 'none' };
};

const drawingInformationСomparison = (state: IelState[], setState: Function) => {
  const keysRender = ['name', 'maxValue', 'minValue', 'VectorGraphics', 'sumValue'];
  const NameCell = keysRender.map((el: string) => {
    return <th>{el}</th>
  });
  const table = state.map((elRender: IelState | any) => {
    if (elRender.vizible === false) {
      return;
    }
    const tegsTd = keysRender.map((key: string) => {
      const myStyle = (backgroundColorCell(state, elRender, key));
      return (<td style={myStyle} >{elRender[key]}</td>)
    });
    const styleTArget = elRender.target === true ? { border: "4px solid black" } : { border: '1px solid black' }
    return (<tr style={styleTArget} >{tegsTd}</tr>);
  })
  return (
    <table style={{ width: "100%" }}>
      <tr>
        {NameCell}
      </tr>
      {table}
    </table>
  );
};


const LineGraph = (props: IGraphProps) => {
  const [state, setState] = useState(upDate(props))

  const numberOfSectors = Math.max(...state.map((el: any) => el.value.length - 1));
  const lengthHorizontalLines = numberOfSectors * 100; // Длинна горизонтальных линий'
  const allValuesDatas = Array.from(new Set(state.flatMap((el: any) => el.value)));
  const maxValueDatas = Math.max(...allValuesDatas);

  const numberHorizontalLines = 10; //  Значение на которое будет делиться область графика
  const chartHeight = 800;  // высота графика
  const chartWidth = lengthHorizontalLines; // Ширина графика
  const wholeScreenValue = Math.round(chartHeight * maxValueDatas / chartHeight - 40);  // Получаем значение 800 px  максимальное значение в данных всегда будет 760 px
  const roundedAverage = '0'.repeat(String(wholeScreenValue).length - 1); // Получаем количество нулей для округления среднего значения
  const horizontalLineInterval = Math.ceil(wholeScreenValue / numberHorizontalLines / Number(`1${roundedAverage}`)) * Number(`1${roundedAverage}`); // Получаем шаг интервальных линий
  const roundedWholeScreenValue = horizontalLineInterval * numberHorizontalLines; // Округленное значение 800 px
  const verticalLineSpacing = 100; // шаг вертикальных линиий


  const createDataForRendering = () => {    // Функция обрисовывает пришедшие данные в график
    const result = state.map((el: IelState) => {
      if (el.vizible !== true) {
        return;
      }
      const px = (roundedWholeScreenValue / chartHeight);
      console.log(roundedWholeScreenValue)
      const points = creatingGraph(el.value, px, 100);
      const cirklesChunk = _.chunk(points, 2);
      let index = 0;
      const arrCircle = cirklesChunk.map((elChunk: any) => {
        const cirkle = <circle cx={elChunk[0]} cy={elChunk[1]} r="6" opacity={el.opacity} stroke="black" strokeWidth={el.strokeWidth} fill={el.color} />
        const textPoint = <text style={{ 'transitionProperty': 'opacity', 'transitionDuration': '0.8s' }} x={elChunk[0] - 10} y={elChunk[1] - 10} fontSize="14" opacity={el.target === true ? 1 : 0} fill={'black'}>{el.value[index]}</text>;
        index += 1
        return (<>{cirkle}{textPoint}</>)
      })
      const y1 = (825) - (el.value[2] / px);
      const y2 = (800) - (el.VectorGraphics / px);
      const vPath = <path d={`M45, ${y1} ${lengthHorizontalLines + 45} ${y2}`} stroke={el.color} opacity={el.opacity} strokeWidth={el.strokeWidth} fill='none' />
      return (<g className={styles.containerGradient} >
        {el.target === true ? vPath : null}
        <path style={{ 'transitionProperty': 'stroke-width, opacity', 'transitionDuration': '0.5s' }} d={`M${points.join(', ')}`} stroke={el.color} opacity={el.opacity} strokeWidth={el.strokeWidth} fill='none' />
        {arrCircle}
      </g>);
    });
    return result;
  };

  const LengthVerticalLines = 82.5 * 10; // Длинна вериткальных линий

  const creatingVerticalGrid = () => {  // Функция создает вертикальную линии для графика
    let initPointX = 45;
    const numberOfSectors = Math.max(...state.map((el: IelState) => el.value.length));
    const result = [];
    for (let i = 0; i <= numberOfSectors; i++) {
      result[i] = <path key={_.uniqueId()} d={`M${initPointX} ${LengthVerticalLines} V ${25}Z`} stroke='#696666' strokeWidth="0.5" />
      initPointX += verticalLineSpacing;
    };
    return result;
  };

  const creatingHorizontalGrid = () => { // Функция создает горизонтальные линии для графика со значением для каждой линии
    const result = [];
    let initPointY = 0;
    let acc = 0;
    for (let i = 0; i <= numberHorizontalLines; i++) {
      const companent = <g key={_.uniqueId()}>
        <text x={i === 0 ? 35 : 10} y={chartHeight + 28 - initPointY} fontSize="12" fill="black" >{`${acc.toFixed()}`}</text>
        <path d={`M${chartWidth + 45} ${chartHeight + 25 - initPointY} H ${45}Z`} fill="transparent" stroke='#696666' strokeWidth="0.5" />
      </g>
      result[i] = companent;
      initPointY += 80;
      acc += horizontalLineInterval;
    };
    return result;
  };

  return (
    <div className={styles.container} >
      <svg width={chartWidth + 80} height={chartHeight + 50} xmlns="http://www.w3.org/2000/svg" >
        <rect x="0" y="0" width={chartWidth + 80} height={chartHeight + 50} fill="#c0c0fa" />
        <rect x="45" y="25" width={chartWidth} height={chartHeight} fill="#E0FFFF" />
        {creatingHorizontalGrid()}
        {creatingVerticalGrid()}
        {createDataForRendering()}
      </svg>
      <div>
        {drawingInformation(state, setState)}
        {drawingInformationСomparison(state, setState)}
      </div>
    </div>
  );
};

export default LineGraph;
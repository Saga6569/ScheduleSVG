import React, { useState  } from 'react';
import styles from './LineGraph.module.css';
import _  from 'lodash'

interface IoptionInformGraf { x: number; y: number; color?: string; name: string; value?: number; visit: boolean;};

interface IpropsDataEl {
  name: string;
  values: number[];
  color?: string;
  coment?: string;
};

interface IGraphProps {
  data : IpropsDataEl[]
  option?: { backgroundColor: string }
};

interface IElData {
  name: string;
  value: number[];
  color: string;
  coment: string;
  id: string;
};

const upDate = (datas: IpropsDataEl[]) => {
  const colors = ['blue', 'red', '#5aa5c4', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'Fuchsia'];
  const newData = [];
    for(let i = 0; i<= datas.length - 1; i++) {
      const el: IpropsDataEl = datas[i];
      const value = el.values;
      const name = el.name;
      const color = el.color ?? colors[i];
      const id: string = _.uniqueId();
      const coment = el.coment ?? '';
      newData[i] = {id, value, name, color, coment};
    };
  return newData;
};

const LineGraph = (props: IGraphProps) => {
 
  const chartWidth = 950; // Ширина графика
  const chartHeight = 700; // высота графика
  
  const data = upDate(props.data);

  const numberOfSectors = Math.max(...data.map((el: IElData) => el.value.length)); // количество секторов
  const numberLine = Math.round(chartWidth/numberOfSectors); // Длинна между точками


  const allValuesDatas = Array.from(new Set(data.flatMap((el: IElData) => el.value)));

  const graf = () => {
    const result = [];
    let step = 25
    for (let i = 0; i <= 7; i++) {
      const path = <path d={`M0 ${step} 950 ${step}`} stroke='blue' strokeWidth={1}/>
      step += (chartHeight - 50) /6
      result[i] = path;    
    };
    return result;
  }

  const grafVV = () => {
    const result = [];
    let step = 25
    for (let i = 0; i <= numberOfSectors; i++) {
      const path = <path d={`M${step} 0 ${step} 950`} stroke='Silver' strokeWidth={1}/>
      step += numberLine
      result[i] = path;    
    };
    return result;
  }

  const creatingGraphPP = () => {
    const result: any = [];
    for (let i = 0; i <= data.length - 1; i++) {
      const el: IElData = data[i];
      let step = 25;
      const points: any = (el.value).flatMap((el: number) => {
        const x = step;
        const y = (700 - 50) - (el * 59);
        step += numberLine;
        return <circle cx={x} cy={y} r="5" stroke="black" stroke-width="3" fill="red" />
      });
      result[i] = points;
    };
    console.log(result)
    return result;
  };
 
  const creatingGraph = () => {
    const result: any = [];
    for (let i = 0; i <= data.length - 1; i++) {
      const el: IElData = data[i];
      let step = 25;
      const points: any = (el.value).flatMap((el: number) => {
        const x = step;
        const y = (700 - 50) - (el * 59);
        step += numberLine;
        return [x, y];
      });
      result[i] = <path  d={`M${points.join(', ')}`} stroke='red' fill='none'/>
    };
    return result;
  };
 

  // const maxValueDatas = Math.max(...allValuesDatas);
  // const minValueDatas = Math.min(...allValuesDatas);
  
  const min =  <path d="M10 650 940 650" stroke='blue' strokeWidth={2}/>
  // const textMax = <text x='10' y='615' fill="red">Минимальное значение</text>

  const max =  <path d="M10 60 940 60" stroke='blue' strokeWidth={2}/>
  // const textMin = <text x='10' y='45' fill="red">Минимальное значение</text>

  // const creatingGraphGrid = () => {
  //   const step = maxValueDatas - minValueDatas;
  //   const res = (chartHeight - 100) / step;
  //   const result: any = [];
  //   let accStep = 50;
  //   for (let i = 0; i <= step; i++) {
  //     const path = <path d={`M10 ${accStep} 940 ${accStep}`} stroke='red' strokeWidth={1} opacity={0.8} />
  //     result[i] = path;
  //     accStep += res
  //   };
  //   return result;
  // };


  // const creatingGraph = () => {
  //   const result: any = [];
   
  //   for (let i = 0; i <= data.length - 1; i++) {
  //     const el: IElData = data[i];
  //     let step = 10;
  //     const points: any = (el.value).flatMap((el: number) => {
      
  //       const x = step;
  //       const y = (700 - 50) - (el * 25);
  //       step += numberLine;
  //       return [x, y];
  //     });
  //     result[i] = <path  d={`M${points.join(', ')}`} stroke='blue' fill='none'  />;

  //   };
  //   return result;
  // };
 
  
 

  // const numberHorizontalLines = 10; //  Значение на которое будет делиться область графика
  // const chartHeight = 800;  // высота графика
  // const chartWidth = lengthHorizontalLines; // Ширина графика 
  // const startPointBottomPointY = chartHeight + 25; // Начало графика по Y
  // const wholeScreenValue = Math.round(chartHeight * dataSort[0].value / chartHeight - 40);  // Получаем значение 800 px  максимальное значение в данных всегда будет 760 px
  // const roundedAverage = '0'.repeat(String(wholeScreenValue).length - 1); // Получаем количество нулей для округления среднего значения
  // const horizontalLineInterval  = Math.ceil(wholeScreenValue / numberHorizontalLines / Number(`1${roundedAverage}`)) * Number(`1${roundedAverage}`); // Получаем шаг интервальных линий
  // const roundedWholeScreenValue = horizontalLineInterval * numberHorizontalLines; // Округленное значение 400 px 
  // const verticalLineSpacing = 100; // шаг вертикальных линиий
  
  // const [option, setOption] = useState({x: 0, y: 0 , color: '', name: '', value: 0, visit: false});

  // const createDataForRendering = () => {    // Функция обрисовывает пришедшие данные в график 
  //   let initPointX = 95;
  //   const maxValueEls = roundedWholeScreenValue / chartHeight
  //   const result = dataSort.map((elDate: IelDate) => {
  //     const valueY =  elDate.value / maxValueEls;
  //     const x = initPointX;

  //     const graphLine = <path 
  //     onMouseOut={() => { // Событие покидание курсора элемента 
  //       setOption({...option, visit: false})
  //     }}  
  //     onMouseEnter={() =>  { // Событие наведение курсора на элементs
  //       if (elDate.color === undefined ) {
  //         return null
  //       }
  //       setOption({x: x, y: startPointBottomPointY - valueY, color: elDate.color, 
  //         name: elDate.name, value: elDate.value, visit: true})
  //     }} 
  //     d={`M${initPointX} ${startPointBottomPointY} V ${startPointBottomPointY - valueY}`} fill="transparent" stroke={elDate.color} strokeWidth="50"/>

  //     const textStart = <text key={_.uniqueId()} x={initPointX - 25} y={840} fontSize="14" fill="black" >{`${elDate.name}`}</text>
  //     const result = (<svg  key={elDate.id}
  //       className={option.name === '' ? styles.containerGradient : ''}>
  //         {textStart}
  //         {graphLine}
  //     </svg>)
  //     initPointX += verticalLineSpacing;
  //     return result;
  //   });
  //   return result;
  // };
  // const LengthVerticalLines = 82.5 * 10 // Длинна вериткальных линий

  // const creatingVerticalGrid  = () => {  // Функция создает вертикальную линии для графика
  //   let initPointX = 45;
  //   const result = [];
  //     for(let i = 0; i <= dataSort.length - 1; i++) {
  //       result[i] =  <path key={_.uniqueId()} d={`M${initPointX} ${LengthVerticalLines} V ${25}Z`}  stroke='#696666' strokeWidth="0.5"/>
  //       initPointX += verticalLineSpacing
  //     };
  //   return result;
  // };

  // const creatingHorizontalGrid = () => { // Функция создает горизонтальные линии для графика со значением для каждой линии
  //   const result = [];
  //   let initPointY = 0;
  //   let acc = 0;
  //     for(let i = 0; i <= numberHorizontalLines ; i++) {
  //       const companent = <g key={_.uniqueId()}>
  //         <text  x={i === 0 ? 35 : 10} y={chartHeight + 28 - initPointY} fontSize="12" fill="black" >{`${acc.toFixed()}`}</text> 
  //         <path d={`M${chartWidth + 45} ${chartHeight + 25 - initPointY} H ${45}Z`} fill="transparent" stroke='#696666' strokeWidth="0.5"/>
  //       </g>
  //       result[i] =  companent;
  //       initPointY += 80;
  //       acc += horizontalLineInterval;
  //     };
  //   return result;
  // };

  return (
    <div className={styles.container} >
      <svg width={chartWidth} height={chartHeight} xmlns="http://www.w3.org/2000/svg" style={{backgroundColor: 'rgb(157, 157, 214'}} >
        {/* {graf()} */}
        {creatingGraph()}
        {grafVV()}
        {creatingGraphPP()}
       {max}
       {min}
        {/* {creatingHorizontalGrid()}
        {creatingVerticalGrid()} */}
        {/* {PopUpWindow(option)} */}
        {/* {createDataForRendering()} */}
      </svg>
    </div>
  );


   
};

export default LineGraph;

//import React, { useState } from 'react';
import styles from './VertillePlot.module.css';
import _  from 'lodash'

//interface IoptionInformGraf { x: number; y: number; color?: string; name: string; value?: number; visit: boolean;};

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

interface IelDate {
  id?: string; 
  value: number[]; 
  name: string; 
  color?: string
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

// const PopUpWindow = (option: IoptionInformGraf) => { // окно информации
//   const text = `${option.name} ${option.value}`;
//   const width = text.length * 10;
//   const cx = option.x
//   const cy = option.y
//   const opacity = option.visit === true ? 1 : 0
//   return (<>
//     <rect width={width} height="30" className={styles.informationWndow} x={cx - width /2} y={cy - 35}
//       fill={option.color} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
//       <path d={`M${cx} ${cy} ${cx - 10} ${cy - 5} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
//       <path d={`M${cx} ${cy} ${cx + 10} ${cy - 5} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
//       <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
//         style={{transform: `translate(${cx - width / 2.4}px, ${cy - 15}px)`}}>
//         {text}
//       </text>
//     </>
//   );
// };

const VertillePlot = (props: IGraphProps) => {
  const upDate = () => {
    const colors = ['blue', 'red', '#5aa5c4', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'Fuchsia'];
    const newData = [];
      for(let i = 0; i<= props.data.length - 1; i++) {
        const el: any = props.data[i];
        const value = el.values;
        const name = el.name;
        const color = el.color ?? colors[i];
        const id: string = _.uniqueId();
        newData[i] = {id, value, name, color};
      };
    return newData;
  };
  const dataSort = upDate()
  const numberOfSectors = Math.max(...dataSort.map((el: any) => el.value.length));
  const lengthHorizontalLines = numberOfSectors * 100; // Длинна горизонтальных линий'
  const allValuesDatas = Array.from(new Set(dataSort.flatMap((el: any) => el.value)));
  const maxValueDatas = Math.max(...allValuesDatas);

  console.log(maxValueDatas)

  const numberHorizontalLines = 10; //  Значение на которое будет делиться область графика
  const chartHeight = 800;  // высота графика
  const chartWidth = lengthHorizontalLines; // Ширина графика 
  const wholeScreenValue = Math.round(chartHeight * maxValueDatas / chartHeight - 40);  // Получаем значение 800 px  максимальное значение в данных всегда будет 760 px
  console.log(wholeScreenValue)
  const roundedAverage = '0'.repeat(String(wholeScreenValue).length - 1); // Получаем количество нулей для округления среднего значения
  const horizontalLineInterval  = Math.ceil(wholeScreenValue / numberHorizontalLines / Number(`1${roundedAverage}`)) * Number(`1${roundedAverage}`); // Получаем шаг интервальных линий
  const roundedWholeScreenValue = horizontalLineInterval * numberHorizontalLines; // Округленное значение 400 px 
  const verticalLineSpacing = 100; // шаг вертикальных линиий


  const createDataForRendering = () => {    // Функция обрисовывает пришедшие данные в график 
    const result = dataSort.map((el: any) => {
      const px = roundedWholeScreenValue / chartHeight
      el.value.map((el: any) => console.log(el/(roundedWholeScreenValue / chartHeight)) )
      const points =  creatingGraph(el.value, px, 100);
      return <path  d={`M${points.join(', ')}`} stroke={el.color} strokeWidth={4} fill='none'/>
    }) 
    return result;
  };

  
  const LengthVerticalLines = 82.5 * 10 // Длинна вериткальных линий

  const creatingVerticalGrid  = () => {  // Функция создает вертикальную линии для графика
    let initPointX = 45;
    const numberOfSectors = Math.max(...dataSort.map((el: any) => el.value.length));
    const result = [];
      for(let i = 0; i <= numberOfSectors; i++) {
        result[i] =  <path key={_.uniqueId()} d={`M${initPointX} ${LengthVerticalLines} V ${25}Z`}  stroke='#696666' strokeWidth="0.5"/>
        initPointX += verticalLineSpacing
      };
    return result;
  };

  const creatingHorizontalGrid = () => { // Функция создает горизонтальные линии для графика со значением для каждой линии
    const result = [];
    let initPointY = 0;
    let acc = 0;
      for(let i = 0; i <= numberHorizontalLines ; i++) {
        const companent = <g key={_.uniqueId()}>
          <text  x={i === 0 ? 35 : 10} y={chartHeight + 28 - initPointY} fontSize="12" fill="black" >{`${acc.toFixed()}`}</text> 
          <path d={`M${chartWidth + 45} ${chartHeight + 25 - initPointY} H ${45}Z`} fill="transparent" stroke='#696666' strokeWidth="0.5"/>
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
      <rect x="0" y="0" width={chartWidth + 80}  height={chartHeight + 50} fill="#c0c0fa"/> 
        <rect x="45" y="25" width={chartWidth}  height={chartHeight} fill="#E0FFFF"/>
        {creatingHorizontalGrid()}
        {creatingVerticalGrid()}
        {/* {PopUpWindow(option)} */}
        {createDataForRendering()}
      </svg>
    </div>
  );
};

export default VertillePlot;

import React, { useState, useRef } from 'react';
import styles from './VertillePlot.module.css';
import _  from 'lodash'
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';


interface Ioption {
  x: number; 
  y: number; 
  color: string, 
  name: string, 
  value: number, 
  visit: boolean,
  count: number,
};

interface IGraphProps {
  values: number[] | object[],
};

interface IelDate {
  id: string; 
  value: number; 
  name: string; 
  color: string
};

const textInfo = (option: Ioption) => {
  const left = option.x - option.count * 50 - 65;
  const top = option.y - 245;
  const styleClass: {top: string, left: string} = {top: `${top}px`, left: `${left}px`};
    return (
      <div style ={styleClass} className={styles.informationWndowT} > 
        <svg  width="50" height="25" >
          <text x='0' y='25' font-size="5" opacity={option.visit === true ? 1 : 0} fill="black">{`${option.name} ${option.value}`}</text>
        </svg>
      </div>)
};

const PopUpWindow = (option: Ioption) => {
  const scr = <rect width="40" className={styles.informationWndow} x={option.x - 20} y={option.y - 20}
   opacity={option.visit === true ? 1 : 0} height="15" fill={option.color} stroke-width='1'  stroke="none">
  </rect>
  return (<svg>{scr}</svg>)
};

const VertillePlot = (props: IGraphProps) => {
 
  const upDate = () => {
    const colors = ['blue', 'red', '#5aa5c4', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'Fuchsia'];
    const newData = [];
      for(let i = 0; i<= props.values.length - 1; i++) {
        const el: any = props.values[i];
        const value = el.value ?? el;
        const name = el.name ?? `${value}`;
        const color = el.color ?? colors[i];
        const id: string = _.uniqueId();
        newData[i] = {id, value, name, color};
      };
    return newData;
  };

  const dataSort = upDate().sort().sort((a, b) => b.value - a.value);

  const lengthHorizontalLines = props.values.length * 50; // Длинна горизонтальных линий'

  const numberHorizontalLines = 10; //  Значение на которое будет делиться область графика
  const chartHeight = 400;  // высота графика
  const chartWidth = lengthHorizontalLines; // Ширина графика 
  const startPointBottomPointY = chartHeight + 25; // Начало графика по Y

  const wholeScreenValue = Math.round(chartHeight * dataSort[0].value / 360);  // Получаем значение  400 px    максимальное значение в данных всегда будет 360px 

  const roundedAverage = '0'.repeat(String(wholeScreenValue).length - 1); // Получаем количество нулей для округления среднего значения

  const horizontalLineInterval  = Math.round(wholeScreenValue / numberHorizontalLines / Number(`1${roundedAverage}`)) * Number(`1${roundedAverage}`); // Получаем шаг интервальных линий

  const roundedWholeScreenValue = horizontalLineInterval * numberHorizontalLines; // Округленное значение 400 px 

  const verticalLineSpacing = 50; // шаг вертикальных линиий 

  const [option, setOption] = useState({x: 0, y: 0 , color: '', name: '', value: 0, visit: false, count: 0});

  const createDataForRendering = () => {    // Функция обрисовывает пришедшие данные в график 
    let initPointX = 70;
    const maxValueEls = roundedWholeScreenValue / chartHeight
    const result = dataSort.map((elDate: IelDate) => {
      const valueY =  elDate.value / maxValueEls;
      const x = initPointX;

      const graphLine = <path 
      onMouseOut={() => { // Событие покидание курсора элемента 
        setOption({...option, visit: false})
      }}  
      onMouseEnter={() =>  { // Событие наведение курсора на элемент
        setOption({x: x, y: startPointBottomPointY - valueY, color: elDate.color, name: elDate.name, value: elDate.value, visit: true, count: dataSort.length })
      }} 
      key={elDate.id} d={`M${initPointX} ${startPointBottomPointY} V ${startPointBottomPointY - valueY}`} fill="transparent" stroke={elDate.color} stroke-width="30"/>

      //const circle =  <circle cx={initPointX} cy={startPointBottomPointY - valueY} r="2" fill="red"/>
      const textStart = <text x={initPointX - 12} y={435} font-size="6" fill="black" >{`${elDate.name}`}</text>
    
      const result = (<svg 
        className={option.name === '' ? styles.containerGradient : ''}>
          {textStart}
          {graphLine}
          {/* {circle} */}
      </svg>)
      initPointX += verticalLineSpacing;
      return result;
    });
    return result;
  };
  const LengthVerticalLines = 42.5 * 10 // Длинна вериткальных линий

  const creatingVerticalGrid  = () => {  // Функция создает вертикальную линии для графика
    let initPointX = 45;
    const result = [];
      for(let i = 0; i <= dataSort.length - 1; i++) {
        result[i] =  <path d={`M${initPointX} ${LengthVerticalLines} V ${25}Z`}  stroke='#696666' stroke-width="0.5"/>
        initPointX += verticalLineSpacing
      };
    return result;
  };

  const creatingHorizontalGrid = () => { // Функция создает горизонтальные линии для графика со значением для каждой линии
    const result = [];
    let initPointY = 0;
    let acc = 0;
      for(let i = 0; i <= numberHorizontalLines ; i++) {
        const companent = <>
          <text x={i === 0 ? 35 : 15} y={chartHeight + 28 - initPointY} font-size="10" fill="black" >{`${acc.toFixed()}`}</text> 
           <path d={`M${chartWidth + 45} ${chartHeight + 25 - initPointY} H ${45}Z`} fill="transparent" stroke='#696666' stroke-width="0.5"/>
        </>
        result[i] =  companent;
        initPointY += 40;
        acc += horizontalLineInterval; 
      };
    return result;
  };

  const ResComp = (
    <div className={styles.container} >
      <svg width={chartWidth + 50} height={chartHeight + 50} xmlns="http://www.w3.org/2000/svg" >
        <rect x="45" y="25" width={chartWidth}  height={chartHeight} fill="#E0FFFF"/>
        {PopUpWindow(option)}
        {creatingHorizontalGrid()}
        {creatingVerticalGrid()}
        {createDataForRendering()}
      </svg>
      {textInfo(option)}
    </div>
  );

  const componentRef = useRef<HTMLDivElement | null>(null)
 
  return (<>
    <button style={{left: '570px' , position: 'absolute'}} 
    onClick={() => {
      exportComponentAsJPEG(componentRef)
    }}>
      Export As JPEG
    </button>
    <button style={{left: '680px', position: 'absolute'}} 
    onClick={() => {
      exportComponentAsPDF(componentRef,  {pdfOptions: {w: 750, h: 200, y: 5}})
    }}>
      Export As PDF
    </button>
    <button style={{left: '782px' , position: 'absolute'}} 
    onClick={() => {
      exportComponentAsPNG(componentRef)
    }}>
      Export As PNG
    </button>
    <div ref={componentRef}>
      {ResComp}
    </div>
  </>);
   
};

export default VertillePlot;


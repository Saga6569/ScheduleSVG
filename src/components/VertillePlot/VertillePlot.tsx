import React, { useState, useRef } from 'react';
import styles from './VertillePlot.module.css';
import _  from 'lodash'
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
import Canvos from './Canvos'

interface IoptionInformGraf { x: number; y: number; color?: string; name: string; value?: number; visit: boolean;};

interface IGraphProps {
  values: Array<{name: string, value: number}>,
};

interface IelDate {
  id?: string; 
  value: number; 
  name: string; 
  color?: string
};

const PopUpWindow = (option: IoptionInformGraf) => { // окно информации
  const text = `${option.name} ${option.value}`;
  const width = text.length * 10;
  const cx = option.x
  const cy = option.y
  const opacity = option.visit === true ? 1 : 0
  return (<>
    <rect width={width} height="30" className={styles.informationWndow} x={cx - width /2} y={cy - 35}
      fill={option.color} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
      <path d={`M${cx} ${cy} ${cx - 10} ${cy - 5} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <path d={`M${cx} ${cy} ${cx + 10} ${cy - 5} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
        style={{transform: `translate(${cx - width / 2.4}px, ${cy - 15}px)`}}>
        {text}
      </text>
    </>
  );
};

const VertillePlot = (props: IGraphProps) => {
 
  const upDate = () => {
    const colors = ['blue', 'red', '#5aa5c4', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'Fuchsia'];
    const newData = [];
      for(let i = 0; i<= props.values.length - 1; i++) {
        const el: IelDate = props.values[i];
        const value = el.value ?? el;
        const name = el.name ?? `${value}`;
        const color = el.color ?? colors[i];
        const id: string = _.uniqueId();
        newData[i] = {id, value, name, color};
      };
    return newData;
  };
  const dataSort = upDate().sort().sort((a, b) => b.value - a.value);
  const lengthHorizontalLines = props.values.length * 100; // Длинна горизонтальных линий'

  const numberHorizontalLines = 10; //  Значение на которое будет делиться область графика
  const chartHeight = 800;  // высота графика
  const chartWidth = lengthHorizontalLines; // Ширина графика 
  const startPointBottomPointY = chartHeight + 25; // Начало графика по Y
  const wholeScreenValue = Math.round(chartHeight * dataSort[0].value / chartHeight - 40);  // Получаем значение 800 px  максимальное значение в данных всегда будет 760 px
  const roundedAverage = '0'.repeat(String(wholeScreenValue).length - 1); // Получаем количество нулей для округления среднего значения
  const horizontalLineInterval  = Math.ceil(wholeScreenValue / numberHorizontalLines / Number(`1${roundedAverage}`)) * Number(`1${roundedAverage}`); // Получаем шаг интервальных линий
  const roundedWholeScreenValue = horizontalLineInterval * numberHorizontalLines; // Округленное значение 400 px 
  const verticalLineSpacing = 100; // шаг вертикальных линиий
  
  const [option, setOption] = useState({x: 0, y: 0 , color: '', name: '', value: 0, visit: false});

  const createDataForRendering = () => {    // Функция обрисовывает пришедшие данные в график 
    let initPointX = 95;
    const maxValueEls = roundedWholeScreenValue / chartHeight
    const result = dataSort.map((elDate: IelDate) => {
      const valueY =  elDate.value / maxValueEls;
      const x = initPointX;

      const graphLine = <path 
      onMouseOut={() => { // Событие покидание курсора элемента 
        setOption({...option, visit: false})
      }}  
      onMouseEnter={() =>  { // Событие наведение курсора на элементs
        if (elDate.color === undefined ) {
          return null
        }
        setOption({x: x, y: startPointBottomPointY - valueY, color: elDate.color, 
          name: elDate.name, value: elDate.value, visit: true})
      }} 
      d={`M${initPointX} ${startPointBottomPointY} V ${startPointBottomPointY - valueY}`} fill="transparent" stroke={elDate.color} strokeWidth="50"/>

      const textStart = <text key={_.uniqueId()} x={initPointX - 25} y={840} fontSize="14" fill="black" >{`${elDate.name}`}</text>
      const result = (<svg  key={elDate.id}
        className={option.name === '' ? styles.containerGradient : ''}>
          {textStart}
          {graphLine}
      </svg>)
      initPointX += verticalLineSpacing;
      return result;
    });
    return result;
  };
  const LengthVerticalLines = 82.5 * 10 // Длинна вериткальных линий

  const creatingVerticalGrid  = () => {  // Функция создает вертикальную линии для графика
    let initPointX = 45;
    const result = [];
      for(let i = 0; i <= dataSort.length - 1; i++) {
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
        result[i] =  companent;
        initPointY += 80;
        acc += horizontalLineInterval;
      };
    return result;
  };

//onMouseMove={handleMouseMove} onDoubleClick={hendleonDoubleClick()}
  const countMune = 350; // значение для  добавления меню  
  const ResComp = (
    <div className={styles.container} >
      <svg width={chartWidth + 80 + countMune} height={chartHeight + 50} xmlns="http://www.w3.org/2000/svg" >
      <rect x="0" y="0" width={chartWidth + 80}  height={chartHeight + 50} fill="#c0c0fa"/> 
        <rect x="45" y="25" width={chartWidth}  height={chartHeight} fill="#E0FFFF"/>
        {creatingHorizontalGrid()}
        {creatingVerticalGrid()}
        {PopUpWindow(option)}
        <Canvos x={45} y={25} width={chartWidth}  height={chartHeight} />
        {createDataForRendering()}
      </svg>
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
      exportComponentAsPDF(componentRef,  {pdfOptions: {w: 540, h: 200, y: 2}})
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

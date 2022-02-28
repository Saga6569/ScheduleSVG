import React, { useState } from 'react';
import styles from './VertillePlot.module.css';
import _ from 'lodash'
import Pdf from "react-to-pdf";

const PopUpWindow = (point: {x: number; y: number; color: string, name: string, value: number, visit: boolean}) => {
  const textEnd = <text   x={point.x - 20 } y={point.y - 10} font-size="6" fill="black">{point.visit === false ? '' : `${point.name} ${point.value}`}</text>
  const scr =  <rect width="40" className={styles.informationWndow} x={point.x - 20} 
  y={point.y - 20} height="15" fill={point.color} stroke-width='1' opacity={point.visit === true ? 1 : 0} stroke="none" />
  return (<svg >{scr}{textEnd}</svg>);
};

interface IGraphProps {
    values: number[] | object[],
  };
  
  interface IelDate {
    id: string; 
    value: number; 
    name: string; 
    color: string
  }

const VertillePlot = (props: IGraphProps) => {

  const ref = React.createRef();

  const upDate = () => {
    const colors = ['blue', 'red', '#5aa5c4', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'LightCyan'];
    const newData = [];
      for(let i = 0; i<= props.values.length - 1; i++) {
        const el: any = props.values[i];
        const value = el.value ?? el;
        const name = el.name ?? `${value}`;
        const color = el.color ?? colors[i];
        const id: string = _.uniqueId();
        newData[i] = {id, value, name, color};
      }
    return newData;
  };

  const [point, setPoint] = useState({x: 50, y: 50 , color: 'red', name: '', value: 0, visit: false})

  const dataSort = upDate().sort().sort((a, b) => b.value - a.value);

  const createDataForRendering = () => {
    let initPointX = 70;
    const result = dataSort.map((elDate: IelDate) => {
      const maxValueEl = dataSort[0].value;  // максимальное значчение в стеке данных

      const numberZerosMaxValue = '0'.repeat(String(maxValueEl).length - 1); // Получаем количество  нулей для округления наибольшего значения
      const roundedMaximumNumber = Math.round(maxValueEl / Number(`1${numberZerosMaxValue}`)) * Number(`1${numberZerosMaxValue}`); // Округляем максимально  число  985 = 1000

      const roundedAverage = '0'.repeat(String(roundedMaximumNumber).length - 1); // Получаем количество нулей для округления среднего значения значения
      const step  = Math.round(roundedMaximumNumber / 10 / Number(`1${roundedAverage}`) ) * Number(`1${roundedAverage}`) // округляем среднее значение

      const value100 = step * 10; // 100%
      const valueY =  430 - (elDate.value * 100 / value100 * 4) 

      const graphLine = <path key={elDate.id} d={`M${initPointX} 430 V ${valueY}Z`} fill="transparent" stroke={elDate.color} stroke-width="30"/>
      const circle =  <circle cx={initPointX} cy={valueY} r="2" fill="red"/>
      const textStart = <text x={initPointX - 15} y={440} font-size="6" fill="black" >{`${elDate.name}`}</text>
      const x = initPointX
      const result = (<svg 
      onMouseLeave={() => setPoint({...point, visit: false})}
      onMouseEnter={ () => setPoint({x: x, y: valueY, color: elDate.color, name: elDate.name, value: elDate.value, visit: true})}
      className={point.name === '' ? styles.containerGradient : ''}>
            {textStart}
            {graphLine}
            {circle}
          </svg>)
          initPointX += 50;
          return result;
        })
         return result
      };
      
      const long = props.values.length * 50 + 45 // Длинна горизонтальных линий
      const v = 40 * 10 + 30 // Длинна горизонтальных линий
      
      const creatingVerticalGrid  = () => {
        let initPointX = 45;
        const result = [];
        for(let i = 0; i <= dataSort.length - 1; i++) {
          result[i] =  <path d={`M${initPointX} ${v} V ${0}Z`} fill="transparent" stroke='#696666' stroke-width="1"/>
          initPointX += 50
        }
       return result;
      };

      const creatingHorizontalGrid = () => {
        const numberHorizontalLines = 10;
        const result = [];
        const maxValueEl = dataSort[0].value;

        const numberZerosMaxValue = '0'.repeat(String(maxValueEl).length - 1); // Получаем количество  нулей для округления наибольшего значения
        const roundedMaximumNumber = Math.round(maxValueEl / Number(`1${numberZerosMaxValue}`)) * Number(`1${numberZerosMaxValue}`); // Округляем максимально  число  985 = 1000

        const roundedAverage = '0'.repeat(String(roundedMaximumNumber).length - 1); // Получаем количество нулей для округления среднего значения значения
        const step  = Math.round(roundedMaximumNumber / numberHorizontalLines / Number(`1${roundedAverage}`) ) * Number(`1${roundedAverage}`) // округляем среднее значение

       

        let initPointY = 0;
        let acc = 0;
        for(let i = 0; i <= numberHorizontalLines; i++) {
          const companent = <>
          <text x={15} y={428 - initPointY} font-size="10" fill="black" >{`${acc.toFixed()}`}</text> 
          <path d={`M${long} ${430 - initPointY} H ${0}Z`} fill="transparent" stroke='#696666' stroke-width="1"/>
          </>
          result[i] =  companent;
          initPointY += 40
          acc += step
        }
       return result;
      };

    const coponentrender = (
      <div className={styles.container} >
        <svg  width={long + 50} height="450" xmlns="http://www.w3.org/2000/svg" >
        <rect x="0" y="0" width={long + 50} height="500" fill='#c0c0fa'/>
        {PopUpWindow(point)}
        {creatingHorizontalGrid()}
        {creatingVerticalGrid()}
        {createDataForRendering()}
        </svg>
      </div>
    );

    // const PDFComp = (
    //   <div className={styles.containerPDF} >
    //   <svg  width="650" height="650" xmlns="http://www.w3.org/2000/svg" >
    //   <rect x="0" y="0" width="650" height="650" fill='#c0c0fa'/>
    //   {createDataForRendering()}
    //   {creatingHorizontalGrid()}
    //   {creatingVerticalGrid()}
    //   {PopUpWindow(point)}
    //   </svg>
    //   </div>
    // )

    return (<>
       <Pdf targetRef={ref} x={2} y={2} scale={1.1} filename="code-example.pdf">
        {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
      </Pdf>
      <div ref={ref}>
        {coponentrender}
      </div>
    </>)
};

export default VertillePlot;


import React, { useState } from 'react';
import styles from './VertillePlot.module.css';
import _ from 'lodash'


const PopUpWindow = (point: {x: number; y: number; color: string, name: string, value: number, visit: boolean}) => {

  const textEnd = <text   x={point.x - 20 } y={point.y - 10} font-size="6" fill="black" >{`${point.name} ${point.value}`}</text>
  const scr =  <rect width="40" className={styles.informationWndow} x={point.x - 20} y={point.y - 20} height="15" fill={point.color} stroke-width='1' opacity={point.visit === true ? 1 : 0} stroke="none" />
  
  return (
    <svg >
      {scr}
      {textEnd}
    </svg>
  )
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
      const maximumPercentageValue  = Math.round(maxValueEl * 100 / 80); // 100% от размера блока
      const upValue = elDate.value * 100 / maximumPercentageValue; // процент значение от  максиально в propse 
      const valueOfMax = maximumPercentageValue / 100 * upValue;  // процент значения  от максимального 
      const valueY = (300 - (valueOfMax * 300 / maximumPercentageValue)); // значение подъема линии
      const graphLine = <path key={elDate.id} d={`M${initPointX} 280 V ${valueY}Z`} fill="transparent" stroke={elDate.color} stroke-width="30"/>
      const circle =  <circle cx={initPointX} cy={valueY} r="2" fill="red"/>
      const textStart = <text x={initPointX - 15 } y={290} font-size="6" fill="black" >{`${elDate.name}`}</text>
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
      
      const creatingVerticalGrid  = () => {
        let initPointX = 45;
        const result = [];
        for(let i = 0; i <= dataSort.length - 1; i++) {
          result[i] =  <path d={`M${initPointX} 280 V ${0}Z`} fill="transparent" stroke='#696666' stroke-width="1"/>
          initPointX += 50
        }
       return result;
      };

      const creatingHorizontalGrid = () => {
        const numberHorizontalLines = 6;
        let initPointY = 0;
        const result = [];


        for(let i = 0; i <= numberHorizontalLines; i++) {


        const maxValueEl = dataSort[0].value;  // максимальное значчение в стеке данных
        console.log(maxValueEl + maxValueEl * 1)
          
          const companent = <>
          <text x={25} y={280 - initPointY} font-size="6" fill="black" >{`${0}`}</text>
          <path d={`M${600} ${280 - initPointY} H ${0}Z`} fill="transparent" stroke='#696666' stroke-width="2"/>
         
          
          </>
          result[i] =  companent;
          initPointY += 40
        }
       return result;
      };

      // const gg = () => {
      //   let initPointY = 0;
      //   const result = [];
      //   const maxValue = dataSort[0].value;
      //   console.log(maxValue);
      //   for(let i = 0; i <= dataSort.length - 1; i++) {
      //     result[i] =  <>
      //     <circle cx={25} cy={initPointY} r="2" fill="red"/>
      //     <text x={25} y={initPointY} font-size="6" fill="black" >{`${0}`}</text>
      //     </>
          
      //     initPointY += 40
      //   }
      //  return result;
      // }

    return (
        <div className={styles.container} >
          <svg   width="650" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="800" height="300" fill="#c0c0fa"/>
          {createDataForRendering()}
          {creatingHorizontalGrid()}
          {creatingVerticalGrid()}
          {PopUpWindow(point)}
        
          </svg>
        </div>
      );
};

export default VertillePlot;


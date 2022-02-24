import React, { useState } from 'react';
import styles from './VertillePlot.module.css';
import _ from 'lodash'


// const masseg = (x: number, y: number) => {
//   const myStyle: any = {position: 'absolute', height: x, width: y,}
//   return <svg fill="none" style={myStyle} height="25" viewBox="0 0 15 15" width="35" xmlns="http://www.w3.org/2000/svg">
//     <path  clip-rule="evenodd" d="M5.5 11.4928L7.5 14.4909L9.5 11.4928H13.5C14.053 11.4928 14.5 11.0461 14.5 10.4935V1.49935C14.5 0.946709 14.053 0.5 13.5 0.5H1.5C0.947 0.5 0.5 0.946709 0.5 1.49935V10.4935C0.5 11.0461 0.947 11.4928 1.5 11.4928H5.5Z" fill-rule="evenodd" stroke="black" stroke-linecap="square" stroke-linejoin="round"/>
//   </svg>
// };


interface IGraphProps {
    values: Array<number> | Array<{}>,
  };
  
  interface IelDate {
    id: string; 
    value: number; 
    name: string; 
    collor: string
  }

const VertillePlot = (props: IGraphProps) => {

  const upDate = () => {
    const collorArr = ['blue', 'red', '#5aa5c4', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'LightCyan'];
    const newData = [];
      for(let i = 0; i<= props.values.length - 1; i++) {
        const el: any = props.values[i];
        const value = el.value ?? el;
        const name = el.name ?? `${value}`;
        const collor = el.collor ?? collorArr[i];
        const id: string = _.uniqueId();
        newData[i] = {id, value, name, collor};
      }
    return newData;
  };

  const dataS = upDate().sort().sort((a, b) => b.value - a.value);

  const createDataForRendering = () => {
    let initPointX = 70;
    const result = dataS.map((elDate: IelDate) => {
      const maxValueEl = dataS[0].value;  // максимальное значчение в стеке данных
      const maximumPercentageValue  = Math.round(maxValueEl * 100 / 80); // 100% от размера блока
      const upValue = elDate.value * 100 / maximumPercentageValue; // процент значение от  максиально в propse 
      const valueOfMax = maximumPercentageValue / 100 * upValue;  // процент значения  от максимального 
      const valueY = (300 - (valueOfMax * 300 / maximumPercentageValue)); // значение подъема линии
      const graphLine = <path key={elDate.id} d={`M${initPointX} 280 V ${valueY}Z`} fill="transparent" stroke={elDate.collor} stroke-width="30"/>
      const circle =  <circle cx={initPointX} cy={valueY} r="2" fill="red"/>
      const masseg = <rect x={initPointX - 25} y={valueY - 25} width="65" height="20" fill={elDate.collor} stroke-width='3' stroke='none' /> //
      const textEnd = <text  className={styles.textEng} x={initPointX - 20 } y={valueY - 10} font-size="6" fill="black" >{`${elDate.name} ${elDate.value}`}</text>
      const textStart = <text x={initPointX - 15 } y={290} font-size="6" fill="black" >{`${elDate.name}`}</text>

      const result = (<svg  className={styles.containerGradient}>
            {textStart}
            {graphLine}
            {circle}
            {masseg}
            {textEnd}
          </svg>)
          
          initPointX += 50;
          return result;
        })
         return result
      };

      const creatingHorizontalGrid  = () => {
        let initPointX = 45;
        const result = [];
        for(let i = 0; i <= dataS.length - 1; i++) {
          result[i] =  <path d={`M${initPointX} 280 V ${0}Z`} fill="transparent" stroke='#696666' stroke-width="1"/>
          initPointX += 50
        }
       return result;
      };

      const creatingVerticalGrid = () => {
        let initPointY = 0;
        const result = [];
        for(let i = 0; i <= dataS.length - 1; i++) {
          result[i] =  <path d={`M${600} ${280 - initPointY} H ${0}Z`} fill="transparent" stroke='#696666' stroke-width="1"/>
          initPointY += 40
        }
       return result;
      }

    return (
        <div className={styles.container} >
          <svg width="650" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="800" height="300" fill="#c0c0fa"/>
          {createDataForRendering()}
          {creatingHorizontalGrid()}
          {creatingVerticalGrid()}
          </svg>
        </div>
      );
};

export default VertillePlot;


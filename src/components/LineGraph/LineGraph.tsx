import React, { useState  } from 'react';
import styles from './LineGraph.module.css';
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

interface IElData {
  name: string;
  value: number[];
  color: string;
  coment: string;
  id: string;
};

const creatingGraph = (arrValue: number[], pxOfValue: number, chartStep: number) => {
    let step = 25;
    const points: any = arrValue.flatMap((el: number) => {
      const x = step;
      const y = (700) - (el * pxOfValue);
      step += chartStep;
      return [x, y];
    });
   return points;
};


const upDate = (datas: IpropsDataEl[]) => {
  const colors = ['blue', 'red', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'Fuchsia'];
  const newData = [];
    for(let i = 0; i<= datas.length - 1; i++) {
      const el: IpropsDataEl = datas[i];
      const value = el.values;
      const name = el.name;
      const color = el.color ?? colors[i];
      const id: string = _.uniqueId();
      const coment = el.coment ?? '';
      const maxValue = Math.max(...value);
      const minValue = Math.min(...value);
      const sumValue = _.sum(value);
      const VectorGraphics = Math.round(sumValue/value.length);
      newData[i] = {id, value, name, color, coment, maxValue, minValue, VectorGraphics, sumValue};
    };

    const numberOfSectors = Math.max(...newData.map((el: IElData) => el.value.length)); // максимально массива с данными
    const chartStep = Math.round(950/numberOfSectors); // Растояние между значениями графика
    const allValuesDatas = Array.from(new Set(newData.flatMap((el: IElData) => el.value)));
    const maxValueDatas = Math.max(...allValuesDatas);
    const minValueDatas = Math.min(...allValuesDatas);

    const pxOfValue = 700/maxValueDatas;
    const result = newData.map((el: any) => {
      const points = creatingGraph(el.value, pxOfValue, chartStep);

      const path = <path  d={`M${points.join(', ')}`} stroke={el.color} strokeWidth={4} fill='none'/>
      const cirklesChunk = _.chunk(points, 2);
      const arrCircle = cirklesChunk.map((el: any) => <circle cx={el[0]} cy={el[1]} r="5" stroke="black" stroke-width="3" fill="red" /> )
      return {...el, points, path, arrCircle}
    });
  return result;
};


const drawingInformation = (arrData: any) => {
  const stateInformation = arrData.map((el: any) => {
    const textNameEl =  <text x="40" y="25" fontSize="18" fill={el.color}>{el.name}</text>;
    const ValueMax = <text x="40" y="45" fontSize="18" fill={'black'}>{`Максимально значение ${el.maxValue}`}</text>;
    const ValueMin = <text x="40" y="65" fontSize="18" fill={'black'}>{`Минимально значение ${el.minValue}`}</text>;
    const ValueSred = <text x="40" y="85" fontSize="18" fill={'black'}>{`Среднее значение ${el.VectorGraphics}`}</text>;
    return (<svg  style={{ left: '-124px',position: 'relative'}} >
      {textNameEl}
      {ValueMax}
      {ValueMin}
      {ValueSred}
      </svg>)
  })

  return (
     <div className={styles.information}>
     {stateInformation}
     </div>
  )
};

const LineGraph = (props: IGraphProps) => {
 
  const chartWidth = 950; // Ширина графика
  const chartHeight = 700; // высота графика
  const data = upDate(props.data);
  const numberOfSectors = Math.max(...data.map((el: IElData) => el.value.length)); // максимально массива с данными
  const chartStep = Math.round(chartWidth/numberOfSectors); // Растояние между значениями графика

  const min =  <path d="M10 700 940 700" stroke='blue' strokeWidth={2}/>
  const max =  <path d="M10 0 940 0" stroke='blue' strokeWidth={2}/>
  

  const creatingGraphVertikalLine = () => {
    const result = [];
    let step = 25;
    for (let i = 0; i <= numberOfSectors; i++) {
      const path = <path d={`M${step} 0 ${step} 950`} stroke='Silver' strokeWidth={1}/>
      step += chartStep;
      result[i] = path;    
    };
    return result;
  };

  const creatingGraph = (arrValue: any) => {
    const paths = arrValue.map((el: any) => {
      return el.path
    })
    const cirkles = arrValue.map((el: any) => {
      return el.arrCircle
    });
    return (<>
    <g className={styles.Animation}>{paths}</g>
    {cirkles}
    </> );
  };

 
  return (
    <div className={styles.container} >
      <svg width={chartWidth} height={chartHeight} xmlns="http://www.w3.org/2000/svg" style={{backgroundColor: 'rgb(157, 157, 214'}} >
        {creatingGraph(data)}
        {creatingGraphVertikalLine()}
       {max}
       {min}
      </svg>
      {drawingInformation(data)}
    </div>
  );

};

export default LineGraph;

import React, { useState } from 'react';
import styles from './GraphCircle.module.css';
import _ from 'lodash'

interface IGraphProps {
  values: Array<number> | Array<{}>,
};

interface IelDate {
  id: string; 
  value: number; 
  valueRender: number;
  name: string; 
  visible: boolean;
  collor: string;
  circle: {graphRadius: number, cx: number, cy: number, fill: string, stroke: string, strokeWidth: number, strokeDasharray: any, strokeDashoffset: any, ircleData: any}
  text: {x: number, y: number, fontSize: number, fill: string, valueTextRender: string}
}

const GraphCircle = (props: IGraphProps ) =>  {

  const [dataSumm,  setDataSumm] = useState(_.sumBy(props.values, 'value'))

  const upDate = () => {
    const collorArr = ['blue', 'red', 'black', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'LightCyan'];
    // const newData = this.props.values.reduce((acc: Array<{ value: number; name: string; collor: string; }>, el: { value: number; name: string; collor: string; }) => {
    //   const value = el.value ?? el;
    //   const name = el.name ?? `${value}`
    //   const collor = el.collor ?? collorArr[acc.length]
    //   return [...acc,{value, name, collor}]
    // },[])
    // return newData;
    let clockwiseShiftAcc = 0;

    const newData = [];
      for(let i = 0; i<= props.values.length - 1; i++) {
        const el: any = props.values[i];
        const value = el.value ?? el;
        const name = el.name ?? `${value}`;
        const collor = el.collor ?? collorArr[i];
        const id: string = _.uniqueId();
        const graphRadius = 90;
        const visible = el.visible ?? true
        const valueRender = 0;

        const circle: number = (graphRadius * 2 * 3.14);
        const result: number = (value * 100 / dataSumm);
        const shadedPart: number = (circle * result / 100);
        const ircleData = {pour: `${shadedPart},${circle}`, clockwiseShift : shadedPart};

        const valueTextRender = `${(value * 100 / dataSumm).toFixed(2)}%`

        newData[i] = {id, value, valueRender, name, visible, collor,
          circle: {graphRadius, cx: 130, cy: 150, fill: 'none', stroke: collor, strokeWidth: 60, strokeDasharray: ircleData.pour, strokeDashoffset: clockwiseShiftAcc, ircleData},
          text: {x: 100, y: 160, fontSize: 18, fill: collor, valueTextRender},
        }
        clockwiseShiftAcc += -ircleData.clockwiseShift;
      };
      
    return newData;
  };

  const [data, setData] = useState(upDate());

  const [valueR, setValueR] = useState(data)

  const HendleClickHideElement = (id: string) => () => {
  
    const newData = data.map((elData: any) => {
      if (elData.id === id) {
        elData.visible = elData.visible === true ? false : true;
        return elData;
      };
      return elData;
    })
   
    const newSumm = _.sumBy(newData.filter((el: any) => el.visible === true), 'value')
    
    let clockwiseShiftAcc = 0;
    const resultData: any = [];
    for(let i = 0; i<= newData.length - 1; i++) {
      const el: any = newData[i];
      if (el.visible === false) {
        resultData[i] = el
      } else {
        const circle: number = (el.circle.graphRadius * 2 * 3.14);
        const result: number = (el.value * 100 / newSumm);
        const shadedPart: number = (circle * result / 100);
        const ircleData = {pour: `${shadedPart},${circle}`, clockwiseShift : shadedPart};
        resultData[i] = {...el,
          circle: {graphRadius: el.circle.graphRadius, cx: 130, cy: 150, fill: 'none', stroke: el.collor, strokeWidth: 60, strokeDasharray: ircleData.pour, strokeDashoffset: clockwiseShiftAcc, ircleData},
          text: {x: 100, y: 160, fontSize: 18, fill: el.collor, valueTextRender: `${(el.value * 100 / newSumm).toFixed(2)}%`},
        }
        clockwiseShiftAcc += -ircleData.clockwiseShift;
      }
    };
    setDataSumm(newSumm)
    setData(resultData)
  };

  const HendleClickMoveElement = (id: string) => () => {
    console.log(id)
  };

  const tableDate = () => {
    const infoData = data.map((el: IelDate) => {
      const circle = <circle cx="5" cy="7" r="5" fill={el.visible === false ? 'Gray' : el.collor} />;
      const percentageValue = (el.value * 100 / dataSumm).toFixed(2);
      const text = el.name === String(el.value) ? `${percentageValue} %` : `${el.name} ${percentageValue} %`;
      const textZero = el.visible === false ? `${el.name} 0%` : text
      const textСrcle = <text x="20" y="11" font-size="10" fill="black">{textZero}</text>;
      
      return <svg  width="100%" height="15" preserveAspectRatio="xMidYMin meet" key={el.id} onClick={HendleClickHideElement(el.id)} > 
        {circle}
        {textСrcle}
      </svg>
    });
    return (<div className={styles.containerInfo}>{infoData}</div>);
    };

  const creationGraphics = () => {
    const result = data.map((elData: IelDate) => {
      if (elData.visible === false) {
        return null
      }
      const mystyle: {} = { 'stroke-dasharray': elData.circle.ircleData};

      const shadedPart  = <circle r={elData.circle.graphRadius} className={styles.Circle}  style={mystyle}
        cx={elData.circle.cx} cy={elData.circle.cy} fill={elData.circle.fill} stroke={elData.circle.stroke} 
        stroke-dasharray={elData.circle.strokeDasharray} stroke-dashoffset={elData.circle.strokeDashoffset} stroke-width={elData.circle.strokeWidth}/>

      const textСrcle = <text x={elData.text.x} y={elData.text.y} font-size={elData.text.fontSize} fill={elData.text.fill}>{elData.text.valueTextRender}</text>

      return <svg className={styles.containerGradient} onClick={HendleClickMoveElement(elData.id)}>
        {shadedPart}
        {textСrcle}
      </svg>
    })
    return (<>{result}</>);
  };

  // const ss = () => {
  //   let start = Date.now();
  //   console.log(step)
  //   let acc = 0;
  //   let timer = setInterval(() => {
  //     let timePassed = Date.now() - start;
  //     acc += step;
  //     console.log(acc)
  //     const newSd: any = data.map((eld: IelDate) =>  {
  //       if (eld.id === el.id) {
  //         eld.valueRender = acc
  //         return eld;
  //       }
  //       return eld
  //     })

  //     if (timePassed > 2000) clearInterval(timer);
  //     setData(newSd)
  //   }, 80);
  // }
  //ss()

  
  return (
    <div className={styles.container} >
      <svg width="350" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="350" height="300" fill="#c0c0fa"/>
        {creationGraphics()}
      </svg>
      {tableDate()}
    </div>
  );
};

export default GraphCircle;
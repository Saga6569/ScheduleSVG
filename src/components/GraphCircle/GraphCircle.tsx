import React, { useEffect, useState } from 'react';
import styles from './GraphCircle.module.css';
import _ from 'lodash'

interface IGraphProps {
  values: [number] | Array<{}>,
};

interface IelDate {
  id: string;
  value: number;
  name: string; 
  visible: boolean;
  color: string;
  style: {display: string};
  prochent: {oldValue: number, newValue: number};
  circle: {
    graphRadius: number, cx: number, cy: number, fill: string, stroke: string, 
    strokeDasharray: {renderingPart: number, nonDrawingPart: number},
    strokeWidth: number, strokeDashoffset: number;
  };
}

const GraphCircle = (props: IGraphProps ) =>  {

  const [render, setRender] = useState(false);
  const [dataSumm,  setDataSumm] = useState(_.sumBy(props.values, 'value'))

  const upDate = () => {
    
    const colorArr = ['blue', 'red', 'black', 'tomato', 'green', 'MediumOrchid', 'Peru', 'Lime', 'LightCyan'];
    const newData = [];
      for(let i: number = 0; i<= props.values.length - 1; i++) {
        const el: any = props.values[i];
        const value = el.value ?? el;
        const name = el.name ?? `${value}`;
        const color = el.color ?? colorArr[i];
        const id: string = _.uniqueId();
        const graphRadius = 200;
        const visible = el.visible ?? true
        const circle: number = (graphRadius * 2 * 3.14);
        const result: number = (value * 100 / dataSumm);
        const shadedPart: number = (circle * result / 100);
        const strokeDasharray = {renderingPart: shadedPart, nonDrawingPart: circle}
        const strokeDashoffset: number = i === 0 ? 0 : newData[i-1].circle.strokeDasharray.renderingPart * (-1) - newData[i-1].circle.strokeDashoffset * (-1)
        newData[i] = {id, value, name, visible, color, prochent: {oldValue: 0, newValue:Number(result.toFixed(2))},  style: {display: 'none'},
          circle: {graphRadius, cx: 350, cy: 370, fill: 'none', stroke: color, strokeWidth: 150, strokeDasharray, strokeDashoffset},
        }
      };
    return newData;
  };

  const [data, setData] = useState(upDate());
  const [idTarget, setIdTarget] = useState({id : data[0].id, visible: false})

  const HendleClickHideElement = (id: string) => () => { // Убирает элемент из круговой диаграммы и наоборот 
    const initX = 350;
    const initY = 370;
    const newData = data.map((elData: any) => {
      if (elData.id === id) {
        elData.visible = elData.visible === true ? false : true;
        return elData;
      };
      return elData;
    })
   
    const newSumm = _.sumBy(newData.filter((el: IelDate) => el.visible === true), 'value')
    
    let clockwiseShiftAcc = 0;
    const resultData: any = [];
    
    for(let i = 0; i<= newData.length - 1; i++) {
      const el: IelDate = newData[i];
      const circle: number = (el.circle.graphRadius * 2 * 3.14);
      const result: number = (el.value * 100 / newSumm);
      const shadedPart: number = (circle * result / 100);
      const strokeDasharray = {renderingPart: shadedPart, nonDrawingPart: circle}
      const oldValue = el.prochent.oldValue
      if (el.visible === false) {
        const prochent = {oldValue, newValue: 0};
        resultData[i] = {...el, circle: {...el.circle, cx: initX, cy: initY}, prochent,}
      } else {
        const prochent = {oldValue, newValue: Number(result.toFixed(2))}
        resultData[i] = {...el, prochent, 
          circle: {graphRadius: el.circle.graphRadius, cx: el.circle.cx, cy: el.circle.cy, fill: 'none', stroke: el.color, strokeWidth: 150, strokeDasharray, strokeDashoffset: clockwiseShiftAcc},
          text: {x: 100, y: 350, fontSize: 18, fill: el.color, valueTextRender: `${(el.value * 100 / newSumm).toFixed(2)}%`},
        }
        clockwiseShiftAcc += -shadedPart;
      }
    };
    setDataSumm(newSumm)
    setData(resultData)
  };

  const onclicc = (id: string) => () => {
    const newData = data.map((el :IelDate) => {
      if (id === el.id) {
        const renderingPart = el.circle.strokeDasharray.renderingPart;
        const strokeDashoffset = el.circle.strokeDashoffset;
        const pxTograd = el.circle.strokeDasharray.nonDrawingPart / 360;
        const ugol = (((renderingPart / 2) + Math.abs(strokeDashoffset)) / pxTograd) * 0.01745329252;
        const xPointOffset  = 40 * Math.cos(ugol);
        const YPointOffset = 40 * Math.sin(ugol);
        const initX = 350;
        const initY = 370;
        const newX = Math.round(xPointOffset) + initX;
        const newY = Math.round(YPointOffset) + initY;
        el.circle.cx = el.circle.cx === initX ? newX : initX;
        el.circle.cy = el.circle.cy === initY ? newY : initY;
        return el;
      }
      return el;
    })
    setData(newData);
    };

  const hendleOnMouseEnter = (id: string) => () => {
    const initX = 350;
    const result = data.map((el) => {
      if (el.id === id) {
        if (el.visible === false || el.circle.cx !== initX) {
          return el;
        }
        el.circle.strokeWidth = 170;
        el.style = {display: 'block'};
      }
      return el;
    })
    setIdTarget({id: id, visible: true });
    setData(result);
  };

  const hendleOnMouseOut = (id: string) => () => {
    const result = data.map((el) => {
      if (el.id === id) {
        el.circle.strokeWidth = 150
        el.style = {display: 'none'};
        return el;
      }
      return el;
    })
    setIdTarget({id: id, visible: false })
    setData(result);
  };

  const tableDate = () => {
    const infoData = data.map((el: IelDate) => {
      const circle = <circle cx="20" cy="25" r="15" fill={el.visible === false ? 'Gray' : el.color} />;
      const text = `${el.name} ${el.prochent.oldValue} %`;
      const textСrcle = <text x="40" y="30" font-size="18" fill="black">{text}</text>;
      return <svg  width="250" height="40" preserveAspectRatio="xMidYMin meet" key={el.id} onClick={HendleClickHideElement(el.id)}>
        <g onMouseOut={hendleOnMouseOut(el.id)} onMouseEnter={hendleOnMouseEnter(el.id)}>
          {circle}
          {textСrcle}
        </g>
      </svg>
    });
    return (<div className={styles.containerInfo}>{infoData}</div>);
    };

useEffect(() => {
 upTableDate()
}, [data])

useEffect(() => {
  setTimeout(() => {
    setRender(true)
  }, 1000)
 }, [])

  const creationGraphics = () => {
    const result = data.map((elData: IelDate) => {
      if (elData.visible === false) {
        return null;
      }
      const defs = <defs>
        <radialGradient id={elData.id}>
          <stop offset="80%" stop-color={elData.color} stop-opacity='0.9' />
          <stop offset="90%" stop-color={elData.color} stop-opacity='0.1'/>
          <stop offset="100%" stop-color={elData.color} stop-opacity='0.9' />
        </radialGradient>
      </defs>

      const strokeDasharray = `${elData.circle.strokeDasharray.renderingPart}, ${elData.circle.strokeDasharray.nonDrawingPart}`

      const shadedPart  = <circle r={elData.circle.graphRadius} className={render === false ? styles.CircleStart : styles.CircleEnd }
        cx={elData.circle.cx} cy={elData.circle.cy} fill={elData.circle.fill} stroke={`url(#${elData.id})`}
        stroke-dasharray={strokeDasharray} stroke-dashoffset={elData.circle.strokeDashoffset} stroke-width={elData.circle.strokeWidth}
        onMouseOut={hendleOnMouseOut(elData.id)} 
        onMouseEnter={hendleOnMouseEnter(elData.id)}
        onClick={onclicc(elData.id)}
      />
      return <svg className={styles.containerGradient}>
        {defs}
        {shadedPart}
      </svg>
    })
    return (<>{result}</>);
  };

  // const centerLine = () => {  // отладка центра окружности для смещения
  //   const cen = data.map((el) => {
  //     const renderingPart = el.circle.strokeDasharray.renderingPart
  //     const strokeDashoffset = el.circle.strokeDashoffset 
  //     const ugol = (((renderingPart / 2) + Math.abs(strokeDashoffset)) / 1.57) * 0.01745329252
  //     const x = 90 * Math.cos(ugol)
  //     const y = 90 * Math.sin(ugol)
  //     if (el.visible === true) {
  //       return <path d={`M${130} ${350} ${130 + x} ${350 + y} `}  stroke='#696666' stroke-width="0.5"/>
  //     }
  //     return null
  //   });
  //   return cen;
  // }

  const upTableDate = () => {  // обновлаем значение информации графика
    const condition1 = data.filter((el) => el.visible === true).every((el) =>  el.prochent.oldValue === el.prochent.newValue);
    const condition2 = data.filter((el) => el.visible === false).every((el) =>  el.prochent.oldValue === 0);
      if (condition1 && condition2) {
        return; 
      }
    //console.log('1')
    const newDa = data.map((el: IelDate) => {
      if (el.visible === false) {
        if (el.prochent.oldValue > 0 ) {
          el.prochent.oldValue = Number((el.prochent.oldValue - 0.08).toFixed(2))
          return el;
        }     
        if (el.prochent.oldValue <= 0 ) {
          el.prochent.oldValue = 0;
          return el;
        }  
      }
      if (el.prochent.oldValue > el.prochent.newValue) {
        el.prochent.oldValue = Number((el.prochent.oldValue - 0.08).toFixed(2))
          if (el.prochent.oldValue < el.prochent.newValue) {
            el.prochent.oldValue = el.prochent.newValue;
          }
        return el
      } if (el.prochent.oldValue < el.prochent.newValue) {
        el.prochent.oldValue = Number((el.prochent.oldValue + 0.08).toFixed(2))
        return el;
      }
      return el;
    });
    setData(newDa);
  };
  
  const PopUpWindow = () => { // окно информации
    const myStyle = {'transition': '0.5s' , 'pointer-events': 'none'}
    const el = data.filter((el) => el.id === idTarget.id)[0];
    const renderingPart = el.circle.strokeDasharray.renderingPart;
    const strokeDashoffset = el.circle.strokeDashoffset ;
    const pxTograd = el.circle.strokeDasharray.nonDrawingPart / 360;
    const ugol = (((renderingPart / 2) + Math.abs(strokeDashoffset)) / pxTograd) * 0.01745329252;
    const x = 200 * Math.cos(ugol);
    const y = 200 * Math.sin(ugol);
    return (<rect width="170" height="30" style={myStyle} x={el.circle.cx + x - 85} y={el.circle.cy + y - 15}
    opacity={idTarget.visible && el.visible ? 1 : 0} fill={el.color} stroke-width='1' stroke="LightCyan"/>)
  };
 
  const textInfo = () => {
    const el = data.filter((el) => el.id === idTarget.id)[0];
    const renderingPart = el.circle.strokeDasharray.renderingPart;
    const strokeDashoffset = el.circle.strokeDashoffset;
    const pxTograd = el.circle.strokeDasharray.nonDrawingPart / 360;
    const ugol = (((renderingPart / 2) + Math.abs(strokeDashoffset)) / pxTograd) * 0.01745329252;
    const x = 200 * Math.cos(ugol);
    const y = 200 * Math.sin(ugol);
    const left = el.circle.cx  + x - 880
    const top = el.circle.cy + y - 360 
    const styleClass: {top: string, left: string} = {top: `${top}px`, left: `${left}px`};
    return (
      <div style ={styleClass} className={styles.informationWndowT} >
        <svg  width="175" height="30">
          <text x='0' y='28' font-size="16" opacity={idTarget.visible && el.visible ? 1 : 0} fill="Snow">{`${el.name} ${el.prochent.newValue} %`}</text>
        </svg>
      </div>
    )
  };
 

  return (
    <div className={styles.container} >
      <svg width="800" height="700" cx='10' xmlns="http://www.w3.org/3500/svg">
        <rect x="0" y="0" width="350" height="350" fill="#c0c0fa"/>
        {creationGraphics()}
        {PopUpWindow()}
      </svg>
      {textInfo()}
      {tableDate()}
    </div>
  );
};

export default GraphCircle;
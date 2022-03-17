import React, { useEffect, useState, useRef } from 'react';
import styles from './GraphCircle.module.css';
import _ from 'lodash'

interface IGraphProps {
  values: Array<number> | Array<{}>,
};

interface IelDate {
  displacementAngle: number; 
  id: string; 
  value: number;
  name: string; 
  visible: boolean;
  collor: string;
  style: {display: string};
  prochent: {oldValue: number, newValue: number};

  circle: {graphRadius: number, cx: number, cy: number, fill: string, stroke: string, 
    strokeDasharray: {renderingPart: number, nonDrawingPart: number},
    strokeWidth: number, strokeDashoffset: number};

  text: {x: number, y: number, fontSize: number, fill: string, valueTextRender: string}
}

const GraphCircle = (props: IGraphProps ) =>  {

  const [render, setRender] = useState(false)

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

        const circle: number = (graphRadius * 2 * 3.14);
        const result: number = (value * 100 / dataSumm);
        const shadedPart: number = (circle * result / 100);
       

        const strokeDasharray = {renderingPart: shadedPart, nonDrawingPart: circle}

        const valueTextRender = `${(value * 100 / dataSumm).toFixed(2)}%`

        const displacementAngle = ((shadedPart / 2) + Math.abs(clockwiseShiftAcc)) / (circle / 360);

        newData[i] = {displacementAngle, id, value, name, visible, collor, prochent: {oldValue: 0, newValue:Number(result.toFixed(2))},  style: {display: 'none'},
          circle: {graphRadius, cx: 130, cy: 150, fill: 'none', stroke: collor, strokeWidth: 60, strokeDasharray, strokeDashoffset: clockwiseShiftAcc},
          text: {x: 100, y: 160, fontSize: 18, fill: collor, valueTextRender},
        }
        clockwiseShiftAcc += -shadedPart;
      };
      
    return newData;
  };

  const [data, setData] = useState(upDate());

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

      const circle: number = (el.circle.graphRadius * 2 * 3.14);
      const result: number = (el.value * 100 / newSumm);
      const shadedPart: number = (circle * result / 100);

      const strokeDasharray = {renderingPart: shadedPart, nonDrawingPart: circle}

      const oldValue = el.prochent.oldValue
      if (el.visible === false) {
        const prochent = {oldValue, newValue: 0};
        resultData[i] = {...el, prochent}
      } else {
        const prochent = {oldValue, newValue: Number(result.toFixed(2))}
        resultData[i] = {...el, prochent, 
          circle: {graphRadius: el.circle.graphRadius, cx: 130, cy: 150, fill: 'none', stroke: el.collor, strokeWidth: 60, strokeDasharray, strokeDashoffset: clockwiseShiftAcc},
          text: {x: 100, y: 160, fontSize: 18, fill: el.collor, valueTextRender: `${(el.value * 100 / newSumm).toFixed(2)}%`},
        }
        clockwiseShiftAcc += -shadedPart;
      }
    }
    setDataSumm(newSumm)
    setData(resultData)
  };

  const hendleOnMouseEnter = (id: string) => () => {
    const result = data.map((el) => {
      if (el.id === id) {
        const renderingPart = el.circle.strokeDasharray.renderingPart
        const strokeDashoffset = el.circle.strokeDashoffset 
        const ugol = (((renderingPart / 2) +   Math.abs(strokeDashoffset)) / 1.57) * 0.01745329252
        const x = 5 * Math.cos(ugol);
        const y = 5 * Math.sin(ugol);
        if (el.circle.cx !== 130) {
          return el;
        }
        const xx = 130 + x;
        const yy = 150 + y;
        el.circle.cx = xx;
        el.circle.cy = yy;
        el.style = {display: 'block'};
      }
      return el;
    })
    setData(result);
  };

  const hendleOnMouseOut = (id: string) => () => {
    const result = data.map((el) => {
      if (el.id === id) {
        const ugol = el.displacementAngle * 0.01745329252
        const x = 15 * Math.cos(ugol);
        const y = 15 * Math.sin(ugol);
        const xx = 130 + x;
        const yy = 150 + y;
        el.circle.cx = el.circle.cx === xx ? xx : 130
        el.circle.cy = el.circle.cy === yy ? yy : 150
        el.style = {display: 'none'};
        return el;
      }
      return el;
    })
    setData(result);
  };

  const tableDate = () => {

    const infoData = data.map((el: IelDate) => {
      const circle = <circle cx="13" cy="8" r="5" fill={el.visible === false ? 'Gray' : el.collor} />;
      
      const text = `${el.name} ${el.prochent.oldValue} %`;
      const textСrcle = <text x="20" y="11" font-size="10" fill="black">{text}</text>;
      
      return <svg  width="100%" height="15" preserveAspectRatio="xMidYMin meet" key={el.id} onClick={HendleClickHideElement(el.id)}>
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
  }, 2000)
 }, [])

const onclicc = (id: string) => () => {
  const newData = data.map((el :IelDate) => {
    if (id === el.id) {
      const renderingPart = el.circle.strokeDasharray.renderingPart
      const strokeDashoffset = el.circle.strokeDashoffset 
      const ugol = (((renderingPart / 2) +   Math.abs(strokeDashoffset)) / 1.57) * 0.01745329252
      const x = 15 * Math.cos(ugol)
      const y = 15 * Math.sin(ugol)
      const xx = 130 + x
      const yy = 150 + y
      el.circle.cx = el.circle.cx === xx ? 130 : xx
      el.circle.cy = el.circle.cy === yy ? 150 : yy
      return el;
    }
    return el;
  })
  setData(newData)
  }

  const creationGraphics = () => {
    const result = data.map((elData: IelDate) => {
      if (elData.visible === false) {
        return null;
      }
      const defs = <defs>
        <radialGradient id={elData.id}>
          <stop offset="80%" stop-color={elData.collor} stop-opacity='1' />
          <stop offset="90%" stop-color={elData.collor} stop-opacity='0.5'/>
          <stop offset="100%" stop-color={elData.collor} stop-opacity='1' />
        </radialGradient>
      </defs>

      const strokeDasharray = `${elData.circle.strokeDasharray.renderingPart}, ${elData.circle.strokeDasharray.nonDrawingPart}`

      const shadedPart  = <circle r={elData.circle.graphRadius} className={render === false ? styles.CircleStart :styles.CircleEnd }
        cx={elData.circle.cx} cy={elData.circle.cy} fill={elData.circle.fill} stroke={`url(#${elData.id})`}
        stroke-dasharray={strokeDasharray} stroke-dashoffset={elData.circle.strokeDashoffset} stroke-width={elData.circle.strokeWidth}
        onMouseOut={hendleOnMouseOut(elData.id)} 
        onMouseEnter={hendleOnMouseEnter(elData.id)}
        onClick={onclicc(elData.id)}
        
      />

      const textСrcle = <text x={elData.text.x} style={elData.style} y={elData.text.y} 
        font-size={elData.text.fontSize} fill={elData.text.fill}>{elData.text.valueTextRender}
      </text>

      return <svg className={styles.containerGradient}>
        {defs}
        {shadedPart}
        {textСrcle}
      </svg>
    })
    return (<>{result}</>);
  };

  const centerLine = () => {
    const cen = data.map((el) => {
      const renderingPart = el.circle.strokeDasharray.renderingPart
      const strokeDashoffset = el.circle.strokeDashoffset 
      const ugol = (((renderingPart / 2) + Math.abs(strokeDashoffset)) / 1.57) * 0.01745329252
      const x = 90 * Math.cos(ugol)
      const y = 90 * Math.sin(ugol)
      if (el.visible === true) {
        return <path d={`M${130} ${150} ${130 + x} ${150 + y} `}  stroke='#696666' stroke-width="0.5"/>
      }
      return null
    });
    return cen;
  }

  const upTableDate = () => {  // обновлаем значение информации графика
    const condition1 = data.filter((el) => el.visible === true).every((el) =>  el.prochent.oldValue === el.prochent.newValue);
    const condition2 = data.filter((el) => el.visible === false).every((el) =>  el.prochent.oldValue === 0);
    if (condition1 && condition2) {
      return 
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
          el.prochent.oldValue = el.prochent.newValue
        }
        return el
    } if (el.prochent.oldValue < el.prochent.newValue) {
        el.prochent.oldValue = Number((el.prochent.oldValue + 0.08).toFixed(2))
        return el;
      }
        return el;
    })
    setData(newDa);
  }
  // console.log(data)
  return (
    <div className={styles.container} >
      <svg width="350" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="350" height="300" fill="#c0c0fa"/>
        {creationGraphics()}
        {centerLine()}
      </svg>
      {tableDate()}
   
    </div>
  );
};

export default GraphCircle;
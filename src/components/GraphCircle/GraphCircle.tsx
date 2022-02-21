import React, { useState } from 'react';
import styles from './GraphCircle.module.css';
import _ from 'lodash'

interface IGraphProps {
  values: Array<number> | Array<{}>,
};

const GraphCircle = (props: IGraphProps ) =>  {

  const upDate = () => {
    const collorArr = ['blue', 'red', 'black', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'LightCyan'];
    // const newData = this.props.values.reduce((acc: Array<{ value: number; name: string; collor: string; }>, el: { value: number; name: string; collor: string; }) => {
    //   const value = el.value ?? el;
    //   const name = el.name ?? `${value}`
    //   const collor = el.collor ?? collorArr[acc.length]
    //   return [...acc,{value, name, collor}]
    // },[])
    // return newData;
    const newData = [];
      for(let i = 0; i<= props.values.length - 1; i++) {
        const el: any = props.values[i]
        const value = el.value ?? el;
        const name = el.name ?? `${value}`
        const collor = el.collor ?? collorArr[i];
        const id: string = _.uniqueId()
        newData[i] = {id, value, name, collor}
      }
    return newData;
  };


  // const hoverEl = (el: {id: number}) => (e: any) => {
  // console.log(e.targer)
  // //onMouseLeave={hoverEl(el)}
  // }


  const updatedInput: Array<{id: string, value: number, collor: string, name: string}> = upDate();

  const [data, setData] = useState(updatedInput)


  const tableDate = () => {
    let pointCy = 70
    const infoData = data.map((el: any) =>{
      const circle = <circle cx="20" cy={pointCy} r="5"   fill={el.collor} />;
      const dataSum: number = _.sumBy(data, 'value');
      const percentageValue =  Math.round(el.value * 100 / dataSum);
      const text = el.name === String(el.value) ? `${percentageValue} %` : `${el.name} ${percentageValue} %`;
      const textСrcle = <text x="40" y={pointCy + 4} font-size="12" fill="black">{text}</text>;
      pointCy += 20;
      return <> 
        {circle}
        {textСrcle}
      </>
    });
    return (<svg height='300' width='150' style={{left: '350px', 'position': 'absolute' }} xmlns="http://www.w3.org/2000/svg">{infoData}</svg>);
    };

  const detCircleData  = (value: number) => {
    const dataSum: number = _.sumBy(data, 'value');
    const circle: number = (90 * 2 * 3.14);
    const result: number = (value * 100 / dataSum);
    const shadedPart: number = (circle * result / 100);
    return {pour: `${shadedPart},${circle}`, clockwiseShift : shadedPart} ;
  };

  const creationGraphics = () => {
    let clockwiseShiftAcc = 0
    const result = data.map(({value, collor, name}: {value: number, collor: string, name: string}) => {
      const ircleData = detCircleData(value);
      const mystyle: {} = { 'stroke-dasharray': ircleData};
      const shadedPart  = <circle r="90" className={styles.Circle} style={mystyle} cx="130" cy="150" fill="none" stroke={collor} stroke-dasharray={ircleData.pour} stroke-dashoffset={clockwiseShiftAcc} stroke-width="60"/>
      clockwiseShiftAcc += -ircleData.clockwiseShift;
      return shadedPart;
    })
    return (<>{result}</>);
  }

  
    return (
      <div className={styles.container} >
        <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="500" height="300" fill="#c0c0fa"/>
          {creationGraphics()}
        </svg>
        {tableDate()}
      </div>
    );
};

export default GraphCircle;
import React, { useState } from 'react';
import styles from './GraphCircle.module.css';
import _ from 'lodash'

interface IGraphProps {
  values: Array<number> | Array<{}>,
};

interface IelDate {
  id: string; 
  value: number; 
  name: string; 
  collor: string
}

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
        const el: any = props.values[i];
        const value = el.value ?? el;
        const name = el.name ?? `${value}`;
        const collor = el.collor ?? collorArr[i];
        const id: string = _.uniqueId();
        newData[i] = {id, value, name, collor};
      }
    return newData;
  };
 

  // const hoverEl = (el: {id: number}) => (e: any) => {
  // console.log(e.targer)
  // //onMouseLeave={hoverEl(el)}
  // }


  const updatedInput: Array<IelDate> = upDate();

  const [data, setData] = useState(updatedInput);

  const dataSum: number = _.sumBy(data, 'value');

  const tableDate = () => {
    const infoData = data.map((el: IelDate) =>{
      const circle = <circle cx="15" cy="7" r="5" fill={el.collor} />;
      const percentageValue =  (el.value * 100 / dataSum);
      const text = el.name === String(el.value) ? `${percentageValue.toFixed(2)} %` : `${el.name} ${percentageValue} %`;
      const textСrcle = <text x="40" y="11" font-size="12" fill="black">{text}</text>;
      return <svg width="150" height="15" xmlns="http://www.w3.org/2000/svg" key={el.id} > 
        {circle}
        {textСrcle}
      </svg>
    });
    return (<div className={styles.containerInfo}>{infoData}</div>);
    };

  const detCircleData  = (value: number) => {
    const circle: number = (90 * 2 * 3.14);
    const result: number = (value * 100 / dataSum);
    const shadedPart: number = (circle * result / 100);
    return {pour: `${shadedPart},${circle}`, clockwiseShift : shadedPart} ;
  };

  const creationGraphics = () => {

    let clockwiseShiftAcc = 0;
    const result = data.map(({value, collor, name, id}: IelDate) => {
      const ircleData = detCircleData(value);
      const mystyle: {} = { 'stroke-dasharray': ircleData};
      const shadedPart  = <circle r="90" className={styles.Circle} style={mystyle} cx="130" cy="150" fill="none" stroke={collor} stroke-dasharray={ircleData.pour} stroke-dashoffset={clockwiseShiftAcc} stroke-width="60"/>
      const textСrcle = <text x="100" y="160" style={{'display': 'none'}} font-size="18" fill={collor}>{`${(value * 100 / dataSum).toFixed(2)}%`}</text>;
      clockwiseShiftAcc += -ircleData.clockwiseShift;
     
      return <svg className={styles.ss}>
        {shadedPart}
        {textСrcle}
      </svg>
    })
    return (<>{result}</>);
  }

    return (
      <div className={styles.container} >
        <svg width="350" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="800" height="300" fill="#c0c0fa"/>
          {creationGraphics()}
        </svg>
        {tableDate()}
      </div>
    );
};

export default GraphCircle;
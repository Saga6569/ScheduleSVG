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
  collor: string;
  visible: boolean;
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
        newData[i] = {id, value, name, collor, visible: true};
      }
    return newData;
  };

  const [data, setData] = useState(upDate());

  const HendleClickHideElement = (id: string) => () => {
    const newData = data.map((elData) => {
      if (elData.id === id) {
        elData.visible = elData.visible === true ? false : true;
        return elData;
      };
      return elData;
    })
    setData(newData);
  };

  const HendleClickMoveElement = (id: string) => () => {
    
  };



  const dataSum: number = _.sumBy(data.filter((el) => el.visible === true), 'value');
  console.log(dataSum)

  const tableDate = () => {
    const infoData = data.map((el: IelDate) =>{
      const circle = <circle cx="5" cy="7" r="5" fill={el.visible === false ? 'Gray' : el.collor} />;
      const percentageValue =  (el.value * 100 / dataSum);
      const text = el.name === String(el.value) ? `${percentageValue.toFixed(2)} %` : `${el.name} ${percentageValue.toFixed(2)} %`;
      const textZero = el.visible === false ? `${el.name} 0%` : text
      const textСrcle = <text x="20" y="11" font-size="10" fill="black">{textZero}</text>;
      return <svg  width="100%" height="15" preserveAspectRatio="xMidYMin meet" key={el.id} onClick={HendleClickHideElement(el.id)} > 
        {circle}
        {textСrcle}
      </svg>
    });
    return (<div className={styles.containerInfo}>{infoData}</div>);
    };


  const graphRadius = 90

  const detCircleData  = (value: number) => {
    const circle: number = (graphRadius * 2 * 3.14);
    const result: number = (value * 100 / dataSum);
    const shadedPart: number = (circle * result / 100);
    return {pour: `${shadedPart},${circle}`, clockwiseShift : shadedPart} ;
  };

  const creationGraphics = () => {
    let clockwiseShiftAcc = 0;
    const result = data.map(({value, collor, name, id, visible}: IelDate) => {
      if (visible === false) {
        return null
      }
      const ircleData = detCircleData(value);
      const mystyle: {} = { 'stroke-dasharray': ircleData};
      const shadedPart  = <circle r={graphRadius} className={styles.Circle} style={mystyle} cx="130" cy="150" fill="none" stroke={collor} stroke-dasharray={ircleData.pour} stroke-dashoffset={clockwiseShiftAcc} stroke-width="60"/>
      const textСrcle = <text x="100" y="160" font-size="18" fill={collor}>{`${(value * 100 / dataSum).toFixed(2)}% `}</text>
      clockwiseShiftAcc += -ircleData.clockwiseShift;
     
      return <svg className={styles.containerGradient} onClick={HendleClickMoveElement(id)} >
        {shadedPart}
        {textСrcle}
      </svg>
    })
    return (<>{result}</>);
  }

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
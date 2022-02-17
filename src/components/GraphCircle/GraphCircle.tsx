import React from 'react';
import styles from './GraphCircle.module.css';
import _ from 'lodash'

interface IGraphProps {
  values: Array<number> | Array<{}>,
};

interface IGraphState {
  data: Array<{value: number, collor: string, name: string}>,
};

export class GraphCircle extends React.Component<IGraphProps, IGraphState> {
  constructor(props: IGraphProps) {
    super(props);

    const data = this.upDate();

    this.state = { data };
  };

  upDate = () => {
  const collorArr = ['blue', 'red', 'black', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'LightCyan'];
    // const newData = this.props.values.reduce((acc: Array<{ value: number; name: string; collor: string; }>, el: { value: number; name: string; collor: string; }) => {
    //   const value = el.value ?? el;
    //   const name = el.name ?? `${value}`
    //   const collor = el.collor ?? collorArr[acc.length]
    //   return [...acc,{value, name, collor}]
    // },[])
    // return newData;

  const newData = [];
    
    for(let i = 0; i<= this.props.values.length - 1; i++) {
      const el: any = this.props.values[i]
      const value = el.value ?? el;
      const name = el.name ?? `${value}`
      const collor = el.collor ?? collorArr[i];
      newData[i] = {value, name, collor}
    }
    return newData;
  }

  detCircleData  = (value: number) => {
    const dataSum: number = _.sumBy(this.state.data, 'value')
    const circle: number = (80 * 2 * 3.14);
    const result: number = (value * 100 / dataSum);
    const shadedPart: number = (circle * result / 100);
    return {pour: `${shadedPart},${circle}`, clockwiseShift : shadedPart} ;
  };

  creationGraphics = () => {
    const data = this.state.data
    let clockwiseShiftAcc = 0
    const result = data.map(({value, collor, name}: {value: number, collor: string, name: string}) => {
      const ircleData = this.detCircleData(value)
      const shadedPart  = <circle r="80" className={styles.Circle}  cx="120" cy="150" fill="none" stroke={collor} stroke-dasharray={ircleData.pour} stroke-dashoffset={clockwiseShiftAcc} stroke-width="60">
      </circle>
      clockwiseShiftAcc += -ircleData.clockwiseShift
      return shadedPart;
    })
    return (<>{result}</>);
  }

  render() {
    return (
      <div className={styles.container} >
        <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="500" height="300" fill="#c0c0fa"/>
          {this.creationGraphics()}
        </svg>
      </div>
    );
  }
}

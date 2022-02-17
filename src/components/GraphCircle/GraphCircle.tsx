import React from 'react';
import styles from './GraphCircle.module.css';
import _ from 'lodash'

interface IGraphProps {
  values: Array<number> | Array<{}>
};

interface IGraphState {
  data: Array<number> | Array<{}>,
}

export class GraphCircle extends React.Component<IGraphProps, IGraphState> {
  constructor(props: IGraphProps) {
    super(props);
    
    this.state = {
      data: this.props.values,
   
    }
  }

  upDate = () => {
    const collorArr = ['blue', 'red', 'black', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'LightCyan'];
    const newData = this.state.data.reduce((acc: Array<{ value: number; name: string; collor: string; }>, el: { value: number; name: string; collor: string; }) => {
      const value = el.value ?? el;
      const name = el.name ?? `${value}`
      const collor = el.collor ?? collorArr[acc.length]
      return [...acc,{value, name, collor}]
    },[])
    
    //const sumValue = _.sumBy(newData, 'value');

    return newData;
  }


  res = (value: number) => {
    let dataSum = _.sumBy(this.upDate(), 'value')
    const circle: number = (80 * 2 * 3.14);
    const result: number = (value * 100 / dataSum);
    const shadedPart = (circle * result / 100);
    return {pour: `${shadedPart},${circle}`, clockwiseShift : shadedPart} ;
  };

  creationGraphics = () => {
    const data = this.upDate()
    let clockwiseShiftAcc = 0
    const result = data.map(({value, collor}: {value: number, collor: string}) => {
      const shadedPart  = <circle r="80"  cx="120" cy="150" fill="none" stroke={collor} stroke-dasharray={this.res(value).pour} stroke-dashoffset={clockwiseShiftAcc} stroke-width="60"/>
      clockwiseShiftAcc += -this.res(value).clockwiseShift
      return shadedPart;
    })
    return (<>{result}</>);
  }

  render() {
    return (
      <div className={styles.container} >
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="300" height="300" fill="#c0c0fa"/>
          {this.creationGraphics()}
        </svg>
      </div>
    );
  }
}
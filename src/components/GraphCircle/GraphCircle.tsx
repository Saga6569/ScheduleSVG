import React from 'react';
import styles from './GraphCircle.module.css';

interface IGraphProps {
  values: Array<number>,
};

interface IGraphState {
  data:any,
}
  
export class GraphCircle extends React.Component<IGraphProps, IGraphState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: this.props.values
    }
  }

  upDate = (dataSet: any) => {
    const collorArr = ['blue', 'red', 'black', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'LightCyan'];
    if (dataSet.length !== undefined) {
      const newData: any = [];
      for (let i = 0; i <= this.props.values.length - 1; i++ ) {
        const value = this.props.values[i];
        const collor = collorArr[i];
        newData[i] = {value, collor}
      }
     return newData;
    }
    return dataSet;
  }


  res = (value: number) => {
    let dataSum = 0;
    const s = this.upDate(this.state.data);
    for(const item of s) {
      dataSum += item.value ?? item
    }
    const circle: number = (80 * 2 * 3.14);
    const result: number = (value * 100 / dataSum);
    const shadedPart = (circle * result / 100);
    console.log(`${shadedPart},${circle}`)
    return {answer: `${shadedPart},${circle}`, value: shadedPart} ;
  };

  creationGraphics = () => {
    const data = this.upDate(this.state.data)
    let a = 0
    const result = data.map(({value, collor}: {value: number, collor: string}) => {
      const s = <circle r="80"  cx="150" cy="150" fill="none" stroke={collor} stroke-dasharray={this.res(value).answer} stroke-dashoffset={a} stroke-width="60"/>
      a += -this.res(value).value
      return s;
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
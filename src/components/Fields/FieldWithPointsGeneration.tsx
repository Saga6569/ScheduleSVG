import React from "react";
import styles from "./Fields.module.css";

interface IFieldWithPointsGenerationState {
  pointsList: Array<any>,
  pointElements: Object,
  nextPointElementKey: number,
}

export class FieldWithPointsGeneration extends React.Component<any, IFieldWithPointsGenerationState> {
  constructor(props: any) {
    super(props);
    this.state = {
      pointsList: [],
      pointElements: [],
      nextPointElementKey: 0,
    }
  }

  onClickRect(e: React.MouseEvent<HTMLDivElement, MouseEvent> ) {
    e.preventDefault();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const key = this.state.nextPointElementKey;
    const pointsList = [...this.state.pointsList, { x, y }];
    const pointElements = pointsList.map((el: { x: number, y: number, key: number}) => (
      <circle id="point" key={ el.key} cx={ el.x } cy={ el.y } r="3" fill="#ff0000"/>
    ));
    console.log(this.state)
    this.setState({
      pointsList,
      pointElements,
      nextPointElementKey: key + 1,
    });
  };


  buildGraph = () =>  {
    const data = [ 6, 7, 8 ,9, 10, 8, 6, 4, 3];
    let count = 15
    const result = data.map((el) => {
     count += 25;
      return `${count} ${150 - (el * 10)}`
    });

    const path = <path className={styles.path} d={`M${result.join(', ')}`} stroke="black" fill="transparent"/>
    const circle = result.map((el) => {
      
      const number = el.split(' ');
      const text = Math.abs(Number(number[1]) - 150) / 10
      return (<>
      <circle cx={number[0]} cy={number[1]} r="5" fill="green" />
  
      <text x={number[0]} y={number[1]} font-size="12" text-anchor="middle" fill="white">{text}</text>
      </>)
    })
    
    return (<>{path}{circle}</>
    )
  }

  render() {
    return (
      <div className={styles.container} onClick={ (e) => this.onClickRect(e) }>
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="300" height="300" fill="#c0c0fa"/>
          { this.state.pointElements }
          {this.buildGraph()}
        </svg>
      </div>
    );
  }
}

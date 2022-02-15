import React from 'react';
import styles from './Graph.module.css';

interface IGraphProps {
  values: Array<number>,
}

interface IGraphState {
  dashLineX: number,
  dashVisibility: boolean,
  valueElements: Array<object>
}

export class Graph extends React.Component<IGraphProps, IGraphState> {
  constructor(props: IGraphProps) {
    super(props);
    const valuesList = this.calcValuesParams(props.values).valuesList;
    
    const valueElements = valuesList.map((el) => (
      <rect 
        rx="5" ry="5"
        x={ el.x} y={ el.y }
        width={ el.width } height={ el.height }
        fill="url('#myGradient')"
      >
        <animate attributeName="height" from="0" to={ el.height } dur="0.5s" fill="freeze" />
      </rect>)
    );

    this.state = {
      dashLineX: 0,
      dashVisibility: false,
      valueElements,
    }
  };

  calcValuesParams(valuesList: Array<number>){
    return valuesList.reduce(
      (acc: {
        valuesList: Array<{ x: number, y: number, width: number, height: number }>,
        counter: number
        }, val) => {
        const height = val * 20 + 5;
        const width = 20;
        const x = acc.counter ? (acc.counter * 30 + 10) : 10;
        const y = -5;
        const counter = acc.counter + 1;
        return { valuesList: [...acc.valuesList, { x, y, width, height}], counter };
    }, { valuesList: [], counter: 0 });
  }

  handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    const x = e.nativeEvent.offsetX;
    this.setState({ dashLineX: x });
    console.log(this);
  }
// создаем линейный график.

  // bbg = () => {
  //   const data = this.props.values;
  //   const result = data.reduce((acc, item) => {
  //     const pointNumber = acc.length === 0 ? 1 : acc.length + 1
  //     const value = item
  //     const x = acc;
  //     const y = item * 20;
  //     const item = {pointNumber, x, y}
  //     iNumber++
  //     stepPoint += 30;
  //     return [];
  //   }, [])
    
  // }


  // bbg = () => {
  //   const data = this.props.values;
  //   let iNumber = 1;
  //   let stepPoint = 20;
  //   const result = data.map((el) => {
  //     const pointNumber = iNumber;
  //     const value = el
  //     const x = stepPoint;
  //     const y = el * 20;
  //     const item = {pointNumber, x, y}
  //     iNumber++
  //     stepPoint += 30;
  //     return item;
  //   })
  //   console.log(result);
  // }

  difference = (a: number, b: number) => a > b ?  `-${(((a-b)/a) * 100).toFixed(1)}%` : `+${(((b-a)/a) * 100).toFixed(1)}%`
  
  buildGraphLine = () =>  {
    const data = this.calcValuesParams(this.props.values).valuesList;
    const path: Array<number>  = []
    let oldvalue: null | number = null

    const result = data.map((el) => {
    const x = el.x + el.width / 2 ;
    const y = el.y + el.height;
    path.push(x ,y)
    const value = Math.abs(y) / 20
    console.log(oldvalue, value)
    const s = oldvalue === null ? 0 : this.difference(oldvalue, value)
    oldvalue = value
    return (<>
      <circle cx={x} cy={y} r="4" fill="green"/>
      <text className={styles.text} x={x} y={y} font-size="10" text-anchor="middle" fill="black">{s}</text>
      </>
      )
    })
   
    return (<>
      <path className={styles.path} d={`M${path.join(', ')}`} stroke="black" fill="transparent"/>
      {result}
     </>)
  };

  render() {
    return  (
      <div
        className={styles.container}
        onMouseMove={ (e) => this.handleMouseMove(e)}
        onMouseEnter={() => this.setState({ dashVisibility: true })}
        onMouseLeave={() => this.setState({ dashVisibility: false })}
      >
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" transform="scale(1, -1)">
          
          <defs>
            <linearGradient id="myGradient" gradientTransform="rotate(90)">
              <stop offset="5%"  stopColor="gold" />
              <stop offset="95%" stopColor="red" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="300" height="300" fill="#c0c0fa"/>
          
          { this.state.valueElements }

          {this.buildGraphLine()}

          <line 
            x1={ this.state.dashLineX } y1="0"
            x2={ this.state.dashLineX } y2="300"
            stroke={ this.state.dashVisibility ? "rgba(149, 165, 166, 1)" : "rgba(149, 165, 166, 0)" }
            stroke-dasharray="3"
          />
        </svg>
      
      </div>
    )
  }
}

import React from "react";
import styles from "./Fields.module.css";

interface IFieldWithMoveablePointState {
  circleX: number,
  circleY: number,
}

export class FieldWithMoveablePoint extends React.Component<any, IFieldWithMoveablePointState> {
  constructor(props: any) {
    super(props);
    this.state = {
      circleX: 30,
      circleY: 30,
    }
  }

  onClickRect(e: React.MouseEvent<HTMLDivElement, MouseEvent> ) {
    e.preventDefault();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    this.setState({ circleX: x});
    this.setState({ circleY: y});
  };

  render() {
    return (
      <div className={styles.container} onClick={ (e) => this.onClickRect(e) }>
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="300" height="300" fill="#c0c0fa"/>
          <circle id="point" cx={ this.state.circleX } cy={ this.state.circleY } r="3" fill="#ff0000"/>
        </svg>
      </div>
    );
  }
}

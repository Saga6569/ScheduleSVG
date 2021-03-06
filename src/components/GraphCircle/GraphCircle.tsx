import { useEffect, useState } from 'react';
import styles from './GraphCircle.module.css';
import _ from 'lodash'

interface Ivalues {
  value: number;
  name: string;
  color?: string;
};

interface IdefaultOptions {
  graphRadius: number;
  strokeWidth: number;
};

interface IGraphProps {
  values: Ivalues[]
  options?: IdefaultOptions;
};

interface IelDate {
  id: string;
  value: number;
  name: string;
  visible: boolean;
  color: string;
  style: { display: string };
  newValue: number;
  bias: boolean,
  circle: {
    graphRadius: number, cx: number, cy: number, fill: string, stroke: string,
    strokeDasharray: { renderingPart: number, nonDrawingPart: number },
    strokeWidth: number, strokeDashoffset: number;
  };
};

const diff = (el: IelDate, value: number) => { // Функция сравнивает новое значение со старым и в зависимости от условий увеличивает или уменьшает
  if (el.visible === false) {
    if (value > 0) {
      return Number((value - 0.15).toFixed(2));
    };
    if (value <= 0) {
      return el.newValue;
    };
  };
  if (value > el.newValue && (value - 0.15) > el.newValue) {
    return Number((value - 0.15).toFixed(2));
  }
  if (value < el.newValue && value + 0.15 < el.newValue) {
    return Number((value + 0.15).toFixed(2));
  };
  return el.newValue;
};

// 0.01745329252 Значение для перевода градусов в радианы

const updatingData = (props: IGraphProps, dataSumm: number, graphRadius: number, initX: number, initY: number, strokeWidth: number) => { // Функция создает коллекцию элементов со свойствами для отрисовки
  const colorArr = ['blue', 'red', 'black', 'tomato', 'green', 'MediumOrchid', 'Peru', 'Lime', 'LightCyan'];
  const newData = [];
  for (let i: number = 0; i <= props.values.length - 1; i++) {
    const el: Ivalues = props.values[i];
    const value = el.value;
    const name = el.name;
    const color = el.color ?? colorArr[i];
    const visible = value === 0 ? false : true;
    const id: string = _.uniqueId();
    const bias = false;
    const circle: number = (graphRadius * 2 * 3.14);
    const percentageValue: number = (value * 100 / dataSumm);
    const shadedPart: number = (circle * percentageValue / 100);
    const strokeDasharray = { renderingPart: shadedPart, nonDrawingPart: circle };
    const style = { display: visible === true ? 'block' : 'none' };
    const strokeDashoffset: number = i === 0 ? 0 : newData[i - 1].circle.strokeDasharray.renderingPart * (-1) - newData[i - 1].circle.strokeDashoffset * (-1);
    newData[i] = {
      id, value, name, visible, bias, color, newValue: Number(percentageValue.toFixed(2)), style,
      circle: { graphRadius, cx: initX, cy: initY, fill: 'none', stroke: color, strokeWidth, strokeDasharray, strokeDashoffset },
    };
  };
  return newData;
};

const defaultOptions: IdefaultOptions = { graphRadius: 200, strokeWidth: 150 };

const InformationEl = (el: IelDate) => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const newValue = diff(el, value);
    setTimeout(() => setValue(newValue), 0);
  }, [value, el]);

  const myStylText: { transitionProperty: string, transitionDuration: string } = { 'transitionProperty': 'fill', 'transitionDuration': '0.5s' };
  const myStyleGradient: { transitionProperty: string, transitionDuration: string } = { 'transitionProperty': 'stop-color', 'transitionDuration': '1s' };
  const color = el.visible === false ? 'Gray' : el.color;
  const defs = <defs>
    <radialGradient id={`${el.id}-1`} cx="50%" cy="50%">
      <stop offset="25%" stopColor={color} stopOpacity="1" style={myStyleGradient} />
      <stop offset="50%" stopColor={color === 'Gray' ? el.color : color} stopOpacity={color === 'Gray' ? 1 : 0.2} style={myStyleGradient} />
      <stop offset="75%" stopColor={color} stopOpacity='1' style={myStyleGradient} />
    </radialGradient>
  </defs>
  const circle = <circle cx="20" cy="20" r="18" fill={`url(#${el.id}-1)`} />;
  const text = `${el.name} ${value} %`;
  const textСrcle = <text x="40" y="25" id={`${el.id}-render`} fontSize="18" style={myStylText} fill={color === 'Gray' ? 'Gray' : 'black'}>{text}</text>;
  const result = <svg width="250" height="40" key={el.id}>
    <g>
      {defs}
      {circle}
      {textСrcle}
    </g>
  </svg>
  return result;
};

const GraphCircle = (props: IGraphProps) => {
  const option = { ...props.options, ...defaultOptions };
  const initX = 350;
  const initY = 370;
  const graphRadius = option.graphRadius;
  const strokeWidth = option.strokeWidth;
  const [render, setRender] = useState(false);
  const [dataSumm, setDataSumm] = useState(_.sumBy(props.values, 'value'))

  const [data, setData] = useState(updatingData(props, dataSumm, graphRadius, initX, initY, strokeWidth));
  const [idTarget, setIdTarget] = useState({ id: data[0].id, visible: false });

  const handleClickShowHideElement = (id: string) => () => { // Убирает элемент из круговой диаграммы и наоборот
    const newData = data.map((elData: any) => {
      if (elData.id === id) {
        elData.visible = elData.visible === true ? false : true;
        return elData;
      };
      return elData;
    });

    const newSumm = _.sumBy(newData.filter((el: IelDate) => el.visible === true), 'value');

    let clockwiseShiftAcc = 0;
    const resultData: IelDate[] = [];

    for (let i = 0; i <= newData.length - 1; i++) {
      const el: IelDate = newData[i];
      const circle: number = (el.circle.graphRadius * 2 * 3.14);
      const result: number = (el.value * 100 / newSumm);
      const shadedPart: number = (circle * result / 100);
      const strokeDasharray = { renderingPart: shadedPart, nonDrawingPart: circle };
      if (el.visible === false) {
        const newValue = 0
        resultData[i] = { ...el, circle: { ...el.circle, cx: initX, cy: initY }, newValue };
      } else {
        const newValue = Number(result.toFixed(2))
        const pxTograd = circle / 360;
        const tiltAngle = (((shadedPart / 2) + Math.abs(clockwiseShiftAcc)) / pxTograd) * 0.01745329252;
        const xPointOffset = 25 * Math.cos(tiltAngle);
        const yPointOffset = 25 * Math.sin(tiltAngle);
        const cx = el.bias === false ? initX : initX + xPointOffset;
        const cy = el.bias === false ? initY : initY + yPointOffset;
        resultData[i] = {
          ...el, newValue,
          circle: {
            graphRadius: el.circle.graphRadius, cx, cy, fill: 'none',
            stroke: el.color, strokeWidth, strokeDasharray, strokeDashoffset: clockwiseShiftAcc
          },
        };
        clockwiseShiftAcc += -shadedPart;
      };
    };
    setDataSumm(newSumm);
    setData(resultData);
  };

  const handleClickBiasElement = (id: string) => () => { // Событие по элементу круговой диаграммы смещает его часть относительно центра и обратно.
    const newData = data.map((el: IelDate) => {
      if (id === el.id) {
        const renderingPart = el.circle.strokeDasharray.renderingPart;
        const strokeDashoffset = el.circle.strokeDashoffset;
        const pxTograd = el.circle.strokeDasharray.nonDrawingPart / 360;
        const tiltAngle = (((renderingPart / 2) + Math.abs(strokeDashoffset)) / pxTograd) * 0.01745329252;
        const xPointOffset = 25 * Math.cos(tiltAngle);
        const yPointOffset = 25 * Math.sin(tiltAngle);
        const newX = Math.round(xPointOffset) + initX;
        const newY = Math.round(yPointOffset) + initY;
        el.circle.cx = el.circle.cx === initX ? newX : initX;
        el.circle.cy = el.circle.cy === initY ? newY : initY;
        el.bias = el.bias === true ? false : true;
      };
      return el;
    });
    return setData(newData);
  };

  const hendleOnMouseEnter = (id: string) => () => { // Событие наведение курсора на элемент.
    const result = data.map((el) => {
      if (el.id === id) {
        if (el.visible === false || el.circle.cx !== initX) {
          return el;
        };
        el.circle.strokeWidth = el.circle.strokeWidth + 20;
      };
      return el;
    })
    setIdTarget({ id: id, visible: true });
    setData(result);
  };

  const hendleOnMouseOut = (id: string) => () => { // Событие покидание курсора элемента.
    const result = data.map((el) => {
      if (el.id === id) {
        el.circle.strokeWidth = strokeWidth;
        return el;
      };
      return el;
    });
    setIdTarget({ id: id, visible: false });
    setData(result);
  };

  useEffect(() => {
    setTimeout(() => {
      setRender(true);
    }, 1000);
  }, []);

  const creationGraphics = () => { // Компонент обрисовывает круговой график в соответствии с данные каждого элемента.
    const result = data.map((elData: IelDate) => {
      if (!elData.visible) {
        return null;
      }
      const defs = <defs>
        <radialGradient id={elData.id} cx="50%" cy="50%" r="100%"  >
          <stop offset="35%" stopColor={elData.color} stopOpacity="1" />
          <stop offset="50%" stopColor={elData.color} stopOpacity='0.3' />
          <stop offset="65%" stopColor={elData.color} stopOpacity='1' />
        </radialGradient>
      </defs>
      const strokeDasharray = `${elData.circle.strokeDasharray.renderingPart}, ${elData.circle.strokeDasharray.nonDrawingPart}`;
      const shadedPart = <circle r={elData.circle.graphRadius} className={render === false ? styles.CircleStart : styles.CircleEnd} opacity={1}
        cx={elData.circle.cx} cy={elData.circle.cy} fill={elData.circle.fill} stroke={`url(#${elData.id})`}
        strokeDasharray={strokeDasharray} strokeDashoffset={elData.circle.strokeDashoffset} strokeWidth={elData.circle.strokeWidth}
        onMouseOut={hendleOnMouseOut(elData.id)}
        onMouseEnter={hendleOnMouseEnter(elData.id)}
        onClick={handleClickBiasElement(elData.id)}
      />
      return <svg className={styles.containerGradient} key={elData.id}>
        {defs}
        {shadedPart}
      </svg>
    })
    return (<>{result}</>);
  };

  const popUpWindow = () => { // окно информации
    const el = data.filter((el: IelDate) => el.id === idTarget.id)[0];
    const renderingPart = el.circle.strokeDasharray.renderingPart;
    const strokeDashoffset = el.circle.strokeDashoffset;
    const pxTograd = el.circle.strokeDasharray.nonDrawingPart / 360;
    const tiltAngle = (((renderingPart / 2) + Math.abs(strokeDashoffset)) / pxTograd) * 0.01745329252;
    const xPointOffset = 200 * Math.cos(tiltAngle);
    const yPointOffset = 200 * Math.sin(tiltAngle);
    const text = `${el.name} ${el.newValue} %`;
    const width = text.length * 10;
    const cx = el.circle.cx;
    const cy = el.circle.cy;
    const opacity = idTarget.visible && el.visible ? 1 : 0;
    return (<>
      <rect width={width} height="30" className={styles.Circle} x={el.circle.cx + xPointOffset - width / 2} y={el.circle.cy + yPointOffset - 35}
        fill={el.color} strokeWidth='1' stroke="LightCyan" opacity={opacity} />
      <path d={`M${cx + xPointOffset} ${cy + yPointOffset} ${cx + xPointOffset - 10} ${cy + yPointOffset - 5} `} className={styles.Path} opacity={opacity} stroke="LightCyan" />
      <path d={`M${cx + xPointOffset} ${cy + yPointOffset} ${cx + xPointOffset + 10} ${cy + yPointOffset - 5} `} className={styles.Path} opacity={opacity} stroke="LightCyan" />
      <text fontSize="16" fill="LightCyan" className={styles.Text} opacity={opacity}
        style={{ transform: `translate(${cx + xPointOffset - width / 2.4}px, ${cy + yPointOffset - 15}px)`, }}>
        {text}
      </text>
    </>
    );
  };

  return (
    <div className={styles.container} >
      <svg width="800" height="700" cx='10' xmlns="http://www.w3.org/3500/svg">
        {creationGraphics()}
        {popUpWindow()}
      </svg>
      <div style={{ width: 250 }}>
        {data.map((el: IelDate) => {
          return <div style={{ width: 'auto' }} className={styles.containerInfo}
            onClick={handleClickShowHideElement(el.id)}
            onMouseOut={hendleOnMouseOut(el.id)}
            onMouseEnter={hendleOnMouseEnter(el.id)}>
            {InformationEl(el)}</div>
        })}
      </div>
    </div>
  );
};

export default GraphCircle;
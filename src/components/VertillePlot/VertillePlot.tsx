import React, { useState, useRef, useEffect  } from 'react';
import styles from './VertillePlot.module.css';
import _  from 'lodash'
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
import AddComent from './AddComent'

interface Icircle { name: string; r: number; fill: string; stroke: string; strokeWidth: number; comment: string;};
interface Irect { name: string; width: number;  height: number; fill: string; stroke: string; strokeWidth: number; comment: string;};
interface Iellipse { name: string, rx: number, ry: number, fill: string, stroke: string, strokeWidth: number, comment: string};
interface Ipath { name: string, fill: string, stroke?: string, strokeWidth: number, comment: string; d?: string};


interface IpointComent {visible: boolean, target: boolean, id: string, 
  cx: number, cy: number, x: number, y: number, name?: string | null, circle?: Icircle, rect?: Irect, ellipse?: Iellipse, Ipath?: Ipath }


interface IoptionInformGraf { x: number; y: number; color?: string; name: string; value?: number; visit: boolean;};

interface IGraphProps {
  values: number[] | object[],
};

interface IelDate {
  id: string; 
  value: number; 
  name: string; 
  color: string
};

const PopUpWindow = (option: IoptionInformGraf | IpointComent | any) => { // окно информации
  if (option.name === 'rect') {
    const stateComp = option[option.name]
    const cx = stateComp.x;
    const cy = stateComp.y;
    const width = stateComp.comment.length * 12;
    const opacity = option.visible === true ? 1 : 0;
    const height = 30;
    return (<>
      <rect width={width} height={height} className={styles.informationWndow} x={cx + stateComp.width/2 - width/2 } y={cy - height - 8}
        fill={'red'} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
      <path d={`M${cx + stateComp.width/2} ${cy -  stateComp.strokeWidth/2 } ${cx + stateComp.width/2 + 10} ${cy - 6 - stateComp.strokeWidth/2} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <path d={`M${cx + stateComp.width/2} ${cy - stateComp.strokeWidth/2} ${cx + stateComp.width/2 - 10} ${cy -  6 - stateComp.strokeWidth/2 } `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
        <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
          style={{transform: `translate(${cx + stateComp.width/2 - width/2.2 }px, ${cy -  height/2.4  - stateComp.strokeWidth/2}px)`}}>
          {stateComp.comment}
        </text>
      </>
    );
  };
  if (option.name === 'path') {
    const stateComp = option[option.name]
    const points = stateComp.points
    const cx = points[points.length - 2]
    const cy = points[points.length - 1]
    const width = stateComp.comment.length * 11;
    const opacity = option.visible === true ? 1 : 0;
    const height = 30;
    return (<>
      <rect width={width} height={height} className={styles.informationWndow} x={cx - width/2} y={cy - height - 5 - stateComp.strokeWidth/2}
        fill={'red'} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
      <path d={`M${cx} ${cy -  stateComp.strokeWidth/2 } ${cx - 10} ${cy - 5 - stateComp.strokeWidth/2} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <path d={`M${cx} ${cy - stateComp.strokeWidth/2} ${cx + 10} ${cy -  5 - stateComp.strokeWidth/2 } `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
        <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
          style={{transform: `translate(${cx - width / 2.4}px, ${cy -  height/2  - stateComp.strokeWidth/2}px)`}}>
          {stateComp.comment}
        </text>
      </>
    );
  };
  if (option.name === 'circle') {
    const stateComp = option[option.name]
    const cx = stateComp.cx
    const cy = stateComp.cy
    const width = stateComp.comment.length * 10;
    const opacity = option.visible === true ? 1 : 0;
    const height = 30
    return (<>
      <rect width={width} height={height} className={styles.informationWndow} x={cx - width /2} y={cy - stateComp.r - height - 5 - stateComp.strokeWidth/2}
        fill={stateComp.fill} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
      <path d={`M${cx} ${cy - stateComp.r - stateComp.strokeWidth/2 } ${cx - 10} ${cy - stateComp.r - 5 - stateComp.strokeWidth/2} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <path d={`M${cx} ${cy - stateComp.r- stateComp.strokeWidth/2} ${cx + 10} ${cy - stateComp.r - 5 - stateComp.strokeWidth/2 } `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
        <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
          style={{transform: `translate(${cx - width / 2.4}px, ${cy - stateComp.r -  height/2  - stateComp.strokeWidth/2}px)`}}>
          {stateComp.comment}
        </text>
      </>
    );
  };
  if (option.name === 'ellipse') {
    const stateComp = option[option.name]
    const cx = stateComp.cx
    const cy = stateComp.cy
    const width = stateComp.comment.length * 10;
    const opacity = option.visible === true ? 1 : 0;
    const height = 30
    return (<>
      <rect width={width} height={height} className={styles.informationWndow} x={cx - width /2} y={cy - stateComp.ry - height - 5 - stateComp.strokeWidth/2}
        fill={stateComp.fill} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
      <path d={`M${cx} ${cy - stateComp.ry - stateComp.strokeWidth/2 } ${cx - 10} ${cy - stateComp.ry - 5 - stateComp.strokeWidth/2} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <path d={`M${cx} ${cy - stateComp.ry - stateComp.strokeWidth/2} ${cx + 10} ${cy - stateComp.ry - 5 - stateComp.strokeWidth/2 } `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
        <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
          style={{transform: `translate(${cx - width / 2.4}px, ${cy - stateComp.ry -  height/2  - stateComp.strokeWidth/2}px)`}}>
          {stateComp.comment}
        </text>
      </>
    );
  };

  const text = `${option.name} ${option.value}`;
  const width = text.length * 10;
  const cx = option.x
  const cy = option.y
  const opacity = option.visit === true ? 1 : 0
  return (<>
    <rect width={width} height="30" className={styles.informationWndow} x={cx - width /2} y={cy - 35}
      fill={option.color} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
      <path d={`M${cx} ${cy} ${cx - 10} ${cy - 5} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <path d={`M${cx} ${cy} ${cx + 10} ${cy - 5} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
        style={{transform: `translate(${cx - width / 2.4}px, ${cy - 15}px)`}}>
        {text}
      </text>
    </>
  );
};

const VertillePlot = (props: IGraphProps) => {
 
  const upDate = () => {
    const colors = ['blue', 'red', '#5aa5c4', 'tomato', 'green', 'MediumOrchid', 'Yellow', 'Lime', 'Fuchsia'];
    const newData = [];
      for(let i = 0; i<= props.values.length - 1; i++) {
        const el: any = props.values[i];
        const value = el.value ?? el;
        const name = el.name ?? `${value}`;
        const color = el.color ?? colors[i];
        const id: string = _.uniqueId();
        newData[i] = {id, value, name, color};
      };
    return newData;
  };
  const dataSort = upDate().sort().sort((a, b) => b.value - a.value);
  const lengthHorizontalLines = props.values.length * 100; // Длинна горизонтальных линий'

  const numberHorizontalLines = 10; //  Значение на которое будет делиться область графика
  const chartHeight = 800;  // высота графика
  const chartWidth = lengthHorizontalLines; // Ширина графика 
  const startPointBottomPointY = chartHeight + 25; // Начало графика по Y
  const wholeScreenValue = Math.round(chartHeight * dataSort[0].value / chartHeight - 40);  // Получаем значение 800 px  максимальное значение в данных всегда будет 760 px
  const roundedAverage = '0'.repeat(String(wholeScreenValue).length - 1); // Получаем количество нулей для округления среднего значения
  const horizontalLineInterval  = Math.ceil(wholeScreenValue / numberHorizontalLines / Number(`1${roundedAverage}`)) * Number(`1${roundedAverage}`); // Получаем шаг интервальных линий
  const roundedWholeScreenValue = horizontalLineInterval * numberHorizontalLines; // Округленное значение 400 px 
  const verticalLineSpacing = 100; // шаг вертикальных линиий
  
  const [option, setOption] = useState({x: 0, y: 0 , color: '', name: '', value: 0, visit: false, count: 0});

  const initComent: any = [];

  const [coments, setComent] = useState(initComent)

  ////////////////////////////////////////////////////////
  const renderComent = () => {
    if (coments.length === 0) {
      return null;
    }

    return (<>
      {coments.map((el: any) => {
        if (el.name === 'path') {
          const d = `M${el[el.name].points.join(' ')}`;
          return React.createElement(
            `${el.name}`,
            {...el[el.name], d, 
              onMouseEnter: () =>  {
                const newOption = {...el, visible: true};
                setOption(newOption);
              },
              onMouseOut: () =>  {
                const newOption = {...el, visible: false};
                setOption(newOption);
              },
              onDoubleClick: (e: { stopPropagation: () => void; }) => {
                e.stopPropagation();
                const newComents = coments.map((coment: any) => {
                  if (coment.id === el.id) {
                    coment.target = true;
                    return coment;
                  }
                  return coment;
                })
                setComent(newComents);
              },
            },
          )
        }
        return React.createElement(
          `${el.name}`,
          {...el[el.name], 
            onMouseEnter: () =>  {
              const newOption = {...el, visible: true};
              setOption(newOption);
            },
            onMouseOut: () =>  {
              const newOption = {...el, visible: false};
              setOption(newOption);
            },
            onDoubleClick: (e: { stopPropagation: () => void; }) => {
              e.stopPropagation();
              const newComents = coments.map((coment: any) => {
                if (coment.id === el.id) {
                  coment.target = true;
                  return coment;
                }
                return coment;
              })
              setComent(newComents);
            }
          },
        )
      })}
    </>);
  };

  useEffect(() => {
    return setComent(JSON.parse(localStorage.getItem('coments') || '{}'));
  }, []);

  useEffect(() => {
    localStorage.setItem("coments", JSON.stringify(coments));
  }, [coments]);

  const hendleonDoubleClick = () => (e: { preventDefault: () => void; clientY: number; clientX: number; }) => {
    const cx = e.clientX;
    const cy = e.clientY;
    const x = e.clientX;
    const y = e.clientY;
    const newComent: IpointComent = {visible: false, target: true, id: _.uniqueId(), cx, cy, x, y, name: null};

    if (coments.length === 0 || coments.every((el: any) => el.target === false)) {
      setComent([...coments, newComent]);
    return;
    };

    const targetConp = coments.filter((el: any) => el.target === true)[0];
    if (targetConp.name === null) {
      console.log('выберите фигуру')
      return;
    }

    if (!coments.every((el: any) => el.target === false) && targetConp.name === 'path') {
      const newComents = coments.map((el: any) => {
        if (el.target === true) {
          el[el.name].points = [...el[el.name].points, cx - 20, cy - 20];
        }
        return el;
      })
      setComent(newComents);
    }
  
  };
////////////////////////////////////////////////

  const createDataForRendering = () => {    // Функция обрисовывает пришедшие данные в график 
    let initPointX = 95;
    const maxValueEls = roundedWholeScreenValue / chartHeight
    const result = dataSort.map((elDate: IelDate) => {
      const valueY =  elDate.value / maxValueEls;
      const x = initPointX;

      const graphLine = <path 
      onMouseOut={() => { // Событие покидание курсора элемента 
        setOption({...option, visit: false})
      }}  
      onMouseEnter={() =>  { // Событие наведение курсора на элементs
        setOption({x: x, y: startPointBottomPointY - valueY, color: elDate.color, 
          name: elDate.name, value: elDate.value, visit: true, count: dataSort.length })
      }} 
      d={`M${initPointX} ${startPointBottomPointY} V ${startPointBottomPointY - valueY}`} fill="transparent" stroke={elDate.color} strokeWidth="50"/>

      const textStart = <text key={_.uniqueId()} x={initPointX - 25} y={840} fontSize="14" fill="black" >{`${elDate.name}`}</text>
      const result = (<svg  key={elDate.id}
        className={option.name === '' ? styles.containerGradient : ''}>
          {textStart}
          {graphLine}
      </svg>)
      initPointX += verticalLineSpacing;
      return result;
    });
    return result;
  };
  const LengthVerticalLines = 82.5 * 10 // Длинна вериткальных линий

  const creatingVerticalGrid  = () => {  // Функция создает вертикальную линии для графика
    let initPointX = 45;
    const result = [];
      for(let i = 0; i <= dataSort.length - 1; i++) {
        result[i] =  <path key={_.uniqueId()} d={`M${initPointX} ${LengthVerticalLines} V ${25}Z`}  stroke='#696666' strokeWidth="0.5"/>
        initPointX += verticalLineSpacing
      };
    return result;
  };

  const creatingHorizontalGrid = () => { // Функция создает горизонтальные линии для графика со значением для каждой линии
    const result = [];
    let initPointY = 0;
    let acc = 0;
      for(let i = 0; i <= numberHorizontalLines ; i++) {
        const companent = <g key={_.uniqueId()}>
          <text  x={i === 0 ? 35 : 10} y={chartHeight + 28 - initPointY} fontSize="12" fill="black" >{`${acc.toFixed()}`}</text> 
          <path d={`M${chartWidth + 45} ${chartHeight + 25 - initPointY} H ${45}Z`} fill="transparent" stroke='#696666' strokeWidth="0.5"/>
        </g>
        result[i] =  companent;
        initPointY += 80;
        acc += horizontalLineInterval;
      };
    return result;
  };

  const ResComp = (
    <div className={styles.container} >
      <svg width={chartWidth + 80} height={chartHeight + 50} xmlns="http://www.w3.org/2000/svg" onDoubleClick={hendleonDoubleClick()}>
        <rect x="45" y="25" width={chartWidth}  height={chartHeight} fill="#E0FFFF"/>
        {creatingHorizontalGrid()}
        {creatingVerticalGrid()}
        {createDataForRendering()}
        {renderComent()}
        {PopUpWindow(option)}
      </svg>
    {AddComent(coments, setComent)}
    </div>
  );

  const componentRef = useRef<HTMLDivElement | null>(null)
 
  return (<>
    <button style={{left: '570px' , position: 'absolute'}} 
    onClick={() => {
      exportComponentAsJPEG(componentRef)
    }}>
      Export As JPEG
    </button>
    <button style={{left: '680px', position: 'absolute'}} 
    onClick={() => {
      exportComponentAsPDF(componentRef,  {pdfOptions: {w: 540, h: 200, y: 2}})
    }}>
      Export As PDF
    </button>
    <button style={{left: '782px' , position: 'absolute'}} 
    onClick={() => {
      exportComponentAsPNG(componentRef)
    }}>
      Export As PNG
    </button>
    <div ref={componentRef}>
      {ResComp}
    </div>
  </>);
   
};

export default VertillePlot;


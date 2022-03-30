import React, { useState, useRef, useEffect } from 'react';
import styles from './VertillePlot.module.css';
import _  from 'lodash'
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';

interface Ioption {
  x: number; 
  y: number; 
  color: string, 
  name: string, 
  value: number, 
  visit: boolean,
  count: number,
};

interface IGraphProps {
  values: number[] | object[],
};

interface IelDate {
  id: string; 
  value: number; 
  name: string; 
  color: string
};

const initCirkle = {name: 'circle', r: 25, fill: '#7FFFD4', stroke: '#000000', strokeWidth: 5}

const MenuComp = (props: any, setProps: any) => {
  
  const state = props.length === 0 ? false : props.every((el: any) => el.target === true)

  const formAddComent = () => {
    const targetCompanent = props.filter((el: any) => el.target)[0];
    if (targetCompanent.r === undefined) {
      const newProps = props.map((el: any) => {
        if (el.id === targetCompanent.id) {
          const newEL = {...el, ...initCirkle};
          console.log(newEL)
          return newEL;
        };
        return el;
      })
      setProps(newProps)
    }

    const form = (<>
   
      <div className={styles.FormS}>
      <tr>
      <label>Radius</label>
      <input name="r" value={targetCompanent.r} type="number"
      onChange={(e) => {
        const newProps = props.map((el: any) => {
          if (el.id === targetCompanent.id) {
           el.r =  Number(e.target.value)
            return el;
          };
          return el;
        })
        setProps(newProps)
      }} 
     />
      </tr>
      <tr>
      <label>fill</label>
      <input name="fill" value={targetCompanent.fill} type="color"  
        onChange={(e) => {
          const newProps = props.map((el: any) => {
            if (el.id === targetCompanent.id) {
             el.fill =  e.target.value
              return el;
            };
            return el;
          })
          setProps(newProps)
        }} 
      />
      </tr>
      <tr>
      <label>strokeWidth</label>
      <input name="strokeWidth" value={targetCompanent.strokeWidth} type="number" 
        onChange={(e) => {
          const newProps = props.map((el: any) => {
            if (el.id === targetCompanent.id) {
              el.strokeWidth =  Number(e.target.value)
              return el;
            };
            return el;
        })
        setProps(newProps)
      }} 
      />
      </tr>
      <tr>
      <label>stroke</label>
      <input name="stroke" type="color" value={targetCompanent.stroke} 
        onChange={(e) => {
          const newProps = props.map((el: any) => {
            if (el.id === targetCompanent.id) {
              el.stroke =  e.target.value
              return el;
            };
          return el;
        })
      setProps(newProps)
    }} 
      />
      </tr>
    </div>
    </>
    );
    return form;
  }

  const onClickCloseMenu = () => {
    const newProps = props.filter((el: any) => el.target !== true);
    setProps(newProps)
  }

    const openMenu  = (<div style={{width: '250'}}  >
     {state === false ? null : formAddComent()}
     <div className={styles.ButtonMenu}>
     {state === false ? null :  <button onClick={onClickCloseMenu} >{'Закрыть'}</button>}
    </div>
  </div>)


  return (<>
    {openMenu}
  </>
  )
};



const PopUpWindow = (option: Ioption) => { // окно информации

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

  const initComent: any = []

  const [coment, setComent] = useState(initComent)


//////

  const renderComent = () => {
    if (coment.length === 0) {
      return null;
    }

    return (<>
      {coment.map((el: any) => {
        return React.createElement(
          `${el.name}`,
          {...el},
        )
      })}
       </>);
  };

  const hendleonDoubleClick = () => (e: { preventDefault: () => void; clientY: number; clientX: number; }) => {
    const cx = e.clientX
    const cy = e.clientY
    const newComent : any = {visible: true, target: true, id: _.uniqueId(), cx, cy}
    //console.log(newComent);

    if (coment.every((el: any) => el.target === true) && coment.length !== 0) {
      console.log('закончети создание коментария  для создания нового')
      return;
    }
    setComent([...coment, newComent]);
    return;
  }

//////




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
      onMouseEnter={() =>  { // Событие наведение курсора на элемент
        setOption({x: x, y: startPointBottomPointY - valueY, color: elDate.color, name: elDate.name, value: elDate.value, visit: true, count: dataSort.length })
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
        {PopUpWindow(option)}
        {renderComent()}
      </svg>
     {MenuComp(coment, setComent)}
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


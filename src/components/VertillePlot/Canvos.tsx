import React, { useState, useEffect  } from 'react';
import AddComent from './AddComent'
import _  from 'lodash'
import styles from './VertillePlot.module.css';

interface Icanvos {
  width: number; 
  height: number;
  x: number;
  y: number
};

interface Icircle { name: string; r: number; fill: string; stroke: string; strokeWidth: number; comment: string;};
interface Irect { name: string; width: number;  height: number; fill: string; stroke: string; strokeWidth: number; comment: string;};
interface Iellipse { name: string, rx: number, ry: number, fill: string, stroke: string, strokeWidth: number, comment: string};
interface Ipath { name: string, fill: string, stroke?: string, strokeWidth: number, comment: string; d?: string};

interface IpointComent {
  visible: boolean, target: boolean, id: string, 
  cx: number, cy: number, x: number, y: number, name?: string, circle?: Icircle, rect?: Irect, ellipse?: Iellipse, Ipath?: Ipath;
  [name: string]: any;
};

// Плавающее окно, которое показывает текст комментария прикрепленный к этому объекту
const PopUpWindow = (option: IpointComent) => { // окно информации
  const name = option.name;
  if (option.name === undefined) {
    return null;
  }
  const state = option[option.name]; // // $$##Aristov 
  if (name === 'rect') {
    const cx = state.x;
    const cy = state.y;
    const width = state.comment.length * 12;
    const opacity = option.visible === true ? 1 : 0;
    const height = 30;
    return (<>
      <rect width={width} height={height} className={styles.informationWndow} x={cx + state.width/2 - width/2 } y={cy - height - 8}
        fill={'red'} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
      <path d={`M${cx + state.width/2} ${cy -  state.strokeWidth/2 } ${cx + state.width/2 + 10} ${cy - 6 - state.strokeWidth/2} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <path d={`M${cx + state.width/2} ${cy - state.strokeWidth/2} ${cx + state.width/2 - 10} ${cy -  6 - state.strokeWidth/2 } `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
        <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
          style={{transform: `translate(${cx + state.width/2 - width/2.2 }px, ${cy -  height/2.4  - state.strokeWidth/2}px)`}}>
          {state.comment}
        </text>
      </>
    );
  };
  if (name === 'path') {
    const points = option.points;
    const cx = points[points.length - 2];
    const cy = points[points.length - 1];
    const width = state.comment.length * 11;
    const opacity = option.visible === true ? 1 : 0;
    const height = 30;
    return (<>
      <rect width={width} height={height} className={styles.informationWndow} x={cx - width/2} y={cy - height - 5 - state.strokeWidth/2}
        fill={'red'} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
      <path d={`M${cx} ${cy -  state.strokeWidth/2 } ${cx - 10} ${cy - 5 - state.strokeWidth/2} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <path d={`M${cx} ${cy - state.strokeWidth/2} ${cx + 10} ${cy -  5 - state.strokeWidth/2 } `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
        <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
          style={{transform: `translate(${cx - width / 2.4}px, ${cy -  height/2  - state.strokeWidth/2}px)`}}>
          {state.comment}
        </text>
      </>
    );
  };
  if (name === 'circle') {
    const cx = state.cx
    const cy = state.cy
    const width = state.comment.length * 10;
    const opacity = option.visible === true ? 1 : 0;
    const height = 30
    return (<>
      <rect width={width} height={height} className={styles.informationWndow} x={cx - width /2} y={cy - state.r - height - 5 - state.strokeWidth/2}
        fill={state.fill} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
      <path d={`M${cx} ${cy - state.r - state.strokeWidth/2 } ${cx - 10} ${cy - state.r - 5 - state.strokeWidth/2} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <path d={`M${cx} ${cy - state.r- state.strokeWidth/2} ${cx + 10} ${cy - state.r - 5 - state.strokeWidth/2 } `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
        <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
          style={{transform: `translate(${cx - width / 2.4}px, ${cy - state.r -  height/2  - state.strokeWidth/2}px)`}}>
          {state.comment}
        </text>
      </>
    );
  };
  if (name === 'ellipse') {
    const cx = state.cx
    const cy = state.cy
    const width = state.comment.length * 10;
    const opacity = option.visible === true ? 1 : 0;
    const height = 30
    return (<>
      <rect width={width} height={height} className={styles.informationWndow} x={cx - width /2} y={cy - state.ry - height - 5 - state.strokeWidth/2}
        fill={state.fill} strokeWidth='1' stroke="LightCyan" opacity={opacity}></rect>
      <path d={`M${cx} ${cy - state.ry - state.strokeWidth/2 } ${cx - 10} ${cy - state.ry - 5 - state.strokeWidth/2} `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
      <path d={`M${cx} ${cy - state.ry - state.strokeWidth/2} ${cx + 10} ${cy - state.ry - 5 - state.strokeWidth/2 } `} className={styles.informationWndow} opacity={opacity} stroke="black"/>
        <text fontSize="16" fill="black" className={styles.informationWndow} opacity={opacity}
          style={{transform: `translate(${cx - width / 2.4}px, ${cy - state.ry -  height/2  - state.strokeWidth/2}px)`}}>
          {state.comment}
        </text>
      </>
    );
  };
};

// компонент принимает пропсом размеры за счет которых будет созданы размеры поля для рисования
const Canvos = (props: Icanvos) => {
  const initComents: any = [];
  const initRender: any = {}
  const [coments, setComent] = useState(initComents);
  const [rendered, setRendered] = useState(initRender);
  const drawingCanvasElements = () => {
    if (coments.length === 0) {
      return null;
    };
    const comentsElemets = coments.map((el: IpointComent) => {
      if (el.name === undefined) {
        return null;
      }
      if (el.name === 'path') {
        const d = `M${el.points.join(' ')}`;
        const renderEl = React.createElement(
          `${'path'}`,
          {...el[el.name], d, 
            onMouseEnter: () =>  {
              const newOption = {...el, visible: true};
              setRendered(newOption);
            },
            onMouseOut: () =>  {
              const newOption = {...el, visible: false};
              setRendered(newOption);
            },
            onDoubleClick: () => {
              const newComents = coments.map((coment: IpointComent) => {
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
        return renderEl;
      };
      return React.createElement(
        `${el.name}`,
        {...el[el.name], 
          onMouseEnter: () =>  {
            const newOption = {...el, visible: true};
            setRendered(newOption);
          },
          onMouseOut: () =>  {
            const newOption = {...el, visible: false};
            setRendered(newOption);
          },
          onDoubleClick: (e: { stopPropagation: () => void; }) => {
            e.stopPropagation();
            const newComents = coments.map((coment: IpointComent) => {
              if (coment.id === el.id) {
                coment.target = true;
                return coment;
              };
              coment.target = false;
              return coment;
            });
            setComent(newComents);
          },
          onMouseMove: (e: { nativeEvent: { buttons: number; offsetX: any; offsetY: any; }; }) => {
            if (e.nativeEvent.buttons !== 1 ) {
              return;
            }
            if (el.target === true) {
              const newComents = coments.map((coment: IpointComent) => {
                if (coment.name === undefined) {
                  return null;
                }
                if (coment.id === el.id) {
                  const x = e.nativeEvent.offsetX;
                  const y = e.nativeEvent.offsetY;
                  if (coment[coment.name].hasOwnProperty('cx')) {
                    coment[coment.name].cx = x;
                    coment[coment.name].cy = y;
                    return coment
                  }
                  coment[coment.name].x = x - coment[coment.name].width/2;
                  coment[coment.name].y = y - coment[coment.name].height/2;
                  return coment
                }
                return coment
              });
              setComent(newComents);
              return;
            }
          },
        },
      )
    });
    return (comentsElemets);
  };
  
  useEffect(() => {
    return setComent(JSON.parse(localStorage.getItem('coments') || '{}'));
  }, []);
  
  useEffect(() => {
    localStorage.setItem("coments", JSON.stringify(coments));
  }, [coments]);

  // Событие которое если комментарий path задает координаты для рисования, в противном случает использоваться для перетаскивания созданных комментариев
  const handleMouseMove = (e: {nativeEvent: { offsetX: number; offsetY: number; buttons: number; }; }) => {
    if (e.nativeEvent.buttons !== 1) {
      return;
    };
    if (coments.length === 0 || coments.every((el: IpointComent) => el.target === false)) {
      return;
    };
    const comentTarget = coments.filter((el: IpointComent) => el.target === true)[0];
    if (comentTarget.name === null) {
      return;
    };
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    if (comentTarget.name === 'path') {
      const points = comentTarget.points;
      comentTarget.points = [...points, x, y];
      const newComents = coments.map((el: IpointComent) => el.id === comentTarget.id ? comentTarget: el);
      setComent(newComents);
    };
  };

  // Событие, которое добавляет комментарий с неизвестным именем и начальными координатами
  const hendleonDoubleClick = () => (e: {clientY: number; clientX: number; }) => { 
    const cx = e.clientX;
    const cy = e.clientY;
    const x = e.clientX;
    const y = e.clientY;
    const newComent: IpointComent = {visible: false, target: true, id: _.uniqueId(), cx, cy, x, y, name: undefined};
    if (coments.length === 0 || coments.every((el: IpointComent) => el.target === false)) {
      console.log('добавил');
      setComent([...coments, newComent]);
      return;
    };
    const targetConp = coments.filter((el: IpointComent) => el.target === true)[0];
    if (targetConp.name === null) {
      console.log('выберите фигуру');
      return;
    };
  };
  return(<>
    <rect width={props.width + props.x * 2} height={props.height + props.y * 2} fill="red" opacity={0} 
    onDoubleClick={hendleonDoubleClick()} onMouseMove={handleMouseMove}
    />
    {drawingCanvasElements()}
    {<foreignObject x={props.width + props.x * 2} y={20} width="350" height="750">
    {AddComent(coments, setComent)}
    </foreignObject>}
    {PopUpWindow(rendered)}
    </>
  )
};

export default Canvos;

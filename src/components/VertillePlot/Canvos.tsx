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

  interface IpointComent {visible: boolean, target: boolean, id: string, 
    cx: number, cy: number, x: number, y: number, name?: string | null, circle?: Icircle, rect?: Irect, ellipse?: Iellipse, Ipath?: Ipath; 
  };
  
  const PopUpWindow = (option: IpointComent | any) => { // окно информации
    const name = option.name
    const state = option[option.name];
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
      const points = state.points;
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


  const Canvos = (props: Icanvos) => {

  const arr: any = []
  const [coments, setComent] = useState(arr);

  const [rendered, setRendered] = useState({});

    const drawingCanvasElements = () => {
     
      if (coments.length === 0) {
        return null;
      };
      return (<>
        {coments.map((el: IpointComent | any) => {
          if (el.name === 'path') {
            const d = `M${el[el.name].points.join(' ')}`;
            return React.createElement(
              `${el.name}`,
              {...el[el.name], d, 
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
              onMouseMove: (e: any) => {
                if (e.nativeEvent.buttons === 1) {
                  const newComents = coments.map((coment: IpointComent | any) => {
                    if (coment.id === el.id) {
                      const x = e.nativeEvent.offsetX;
                      const y = e.nativeEvent.offsetY;
                      if (coment[coment.name].hasOwnProperty('cx')) {
                        coment[coment.name].cx = x;
                        coment[coment.name].cy = y;
                        return coment
                      }
                      coment[coment.name].x = x - 50;
                      coment[coment.name].y = y - 50;
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
        })}
      </>);
    };
  
    useEffect(() => {
      return setComent(JSON.parse(localStorage.getItem('coments') || '{}'));
    }, []);
  
    useEffect(() => {
      localStorage.setItem("coments", JSON.stringify(coments));
    }, [coments]);

    const handleMouseMove = (e: { preventDefault: () => void; nativeEvent: { offsetX: any; offsetY: any; buttons: number; }; }) => {
      e.preventDefault();
      if (coments.length === 0 || coments.every((el: IpointComent) => el.target === false)) {
        return;
      };
      const comentTarget = coments.filter((el: IpointComent) => el.target === true)[0];
      if (comentTarget.name === null) {
        return;
      };
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY
      if (comentTarget.name === 'path') {
        const points = comentTarget[comentTarget.name].points;
        if (e.nativeEvent.buttons === 1) {
          comentTarget[comentTarget.name].points = [...points, x, y];
          const newComents = coments.map((el: IpointComent) => el.id === comentTarget.id ? comentTarget: el);
          setComent(newComents);
          return;
        };
      };
    };
  
    const hendleonDoubleClick = () => (e: { preventDefault: () => void; clientY: number; clientX: number; }) => {
      const cx = e.clientX;
      const cy = e.clientY;
      const x = e.clientX;
      const y = e.clientY;
      const newComent: IpointComent = {visible: false, target: true, id: _.uniqueId(), cx, cy, x, y, name: null};
  
      if (coments.length === 0 || coments.every((el: IpointComent) => el.target === false)) {
        console.log('добавил')
        setComent([...coments, newComent]);
      return;
      };
  
      const targetConp = coments.filter((el: IpointComent) => el.target === true)[0];
      if (targetConp.name === null) {
        console.log('выберите фигуру')
        return;
      }
    };

    return (
      <>
      <rect width={props.width + props.x * 2} height={props.height + props.y * 2} fill="red" opacity={0} 
        onDoubleClick={hendleonDoubleClick()} onMouseMove={handleMouseMove}
      />
      {drawingCanvasElements()}
      {<foreignObject x={props.width + props.x * 2} y={props.y + 100} width="250" height="380">
      {AddComent(coments, setComent)}
      </foreignObject>}
      {PopUpWindow(rendered)}
      </>
    )
  };

export default Canvos;
import React, { useState, useEffect  } from 'react';
import AddComent from './AddComent'
import styles from './VertillePlot.module.css';
import _  from 'lodash'

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


  const Canvos = (props: Icanvos) => {

  const s: any = []
  const [coments, setComent] = useState(s);

    const drawingCanvasElements = () => {
     
      if (coments.length === 0) {
        console.log('пустой комент')
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
                  //setOption(newOption);
                },
                onMouseOut: () =>  {
                  const newOption = {...el, visible: false};
                  //setOption(newOption);
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
                //setOption(newOption);
              },
              onMouseOut: () =>  {
                const newOption = {...el, visible: false};
                //setOption(newOption);
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

    const handleMouseMove = (e: any) => {
      e.preventDefault();
      if (coments.length === 0 || coments.every((el: IpointComent) => el.target === false)) {
        return;
      };
      const comentTarget = coments.filter((el: IpointComent) => el.target === true)[0];
      if (comentTarget.name === null) {
        return;
      }
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY
      if (comentTarget.name === 'path' && e.nativeEvent.buttons === 1) {
        comentTarget[comentTarget.name].points = [...comentTarget[comentTarget.name].points, x, y];
        const newComents = coments.map((el: IpointComent) => el.id === comentTarget.id ? comentTarget: el);
        setComent(newComents)
      }
      return;
    }
  
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
  
      if (!coments.every((el: IpointComent) => el.target === false) && targetConp.name === 'path') {
        const newComents = coments.map((el: IpointComent | any) => {
          if (el.target === true) {
            el[el.name].points = [...el[el.name].points, cx - 20, cy - 20];
          }
          return el;
        })
        setComent(newComents);
      }
    };
    
    return (
      <>
      <rect width={props.width + props.x} height={props.height + props.y} opacity={0} 
        onDoubleClick={hendleonDoubleClick()} onMouseMove={handleMouseMove}
      />
      <svg x={700} y={props.y + 100} width="250" height="350">

      </svg>
      {drawingCanvasElements()}
      {<foreignObject x={975} y={props.y + 100} width="250" height="380">
      {AddComent(coments, setComent)}
      </foreignObject>}
      </>
    )
  };

export default Canvos;
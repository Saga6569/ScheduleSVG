
import styles from './VertillePlot.module.css';
import React from 'react';

interface Icircle { name: string; r: number; fill: string; stroke: string; strokeWidth: number; comment: string;};
interface Irect { name: string; width: number;  height: number; fill: string; stroke: string; strokeWidth: number; comment: string;};
interface Iellipse { name: string, rx: number, ry: number, fill: string, stroke: string, strokeWidth: number, comment: string};
interface Ipath { name: string, fill: string, stroke?: string, strokeWidth: number, comment: string; d?: string};

interface IpointComent {visible: boolean; target: boolean; id: string; 
  cx: number; cy: number; x: number; y: number; name?: any; circle?: Icircle; rect?: Irect; ellipse?: Iellipse; Ipath?: Ipath;}

const circleInit: Icircle = {name: 'circle', r: 20, fill: '#7FFFD4', stroke: '#000000', strokeWidth: 5, comment: ''};
const rectInit: Irect = {name: 'rect', width: 100, height: 150, fill: '#7FFFD4', stroke: '#000000' ,strokeWidth: 5, comment: ''};
const ellipseInit: Iellipse = {name: 'ellipse', rx: 100, ry: 50, fill: '#7FFFD4', stroke: '#000000', strokeWidth: 5, comment: ''};
const pathInit: Ipath = {name: 'path', fill: 'none',  stroke: '#000000', strokeWidth: 5, comment: '', };

const allCompanent = (props: IpointComent | any, setProps: Function) => {
  const targetCompanent = props.filter((el: IpointComent) => el.target)[0];
  const stateCompanent = targetCompanent[targetCompanent.name];
  const keysTargetCompanent = Object.keys(stateCompanent);
  return (
    <div className={styles.FormS}>
      {keysTargetCompanent.map((key: string) => {
        if (key === 'name') {
          return null;
        }
        const name = key;
        const value = stateCompanent[key];
        const type = key === 'fill' || key === 'stroke' ? 'color' : typeof value;
        const label = <label>{[key]}</label>
        const imput = React.createElement(
          `${key === 'comment' ? 'textarea' : 'input'}`,
          {value: value, name: name, type: key === 'fill' || key === 'stroke' ? 'color' : typeof value,
            onChange: (e: {target: { value: string }, } ) => {
              const newProps = props.map((el: IpointComent | any) => {
                if (el.id === targetCompanent.id) {
                  el[el.name][key] =  type === 'number' ? Number(e.target.value) : e.target.value
                };
                return el;
              })
            setProps(newProps)}
          },
        );
        return (<tr>{label}{imput}</tr>)
      })}
        {<button onClick={() => {
          setProps(props.filter((el: IpointComent) => el.target !== true))
        }} >{'Удалить'}</button>}
        <button onClick={() => {
          const newProps = props.map((el: IpointComent) => {
            if (el.id === targetCompanent.id) {
              el.target = false;
            }
            return el;
          });
          setProps(newProps)
        }}>{'Сохранить'}
        </button>
    </div>
  )
};

const AddComent = (props: IpointComent | any, setProps: Function) => {
  const state = props.length === 0 ? false : props.filter((el: IpointComent) => el.target === true)[0] === undefined ? false : true;
    if (!state) {
      return null;
    };
  const targetCompanent: IpointComent = props.filter((el: IpointComent) => el.target === true)[0];
    if (targetCompanent.name === null) {
      return (<div className={styles.ButtonMenu}>
        <button onClick={() => {
          setProps(props.map((el: IpointComent) => {
            if ( el.id === targetCompanent.id) {
              el.name = 'circle';
              const centreX = el.x - circleInit.r;
              const centreY = el.y - circleInit.r;
              const newEl: IpointComent = {...el, [el.name]:{cx: centreX, cy: centreY, ...circleInit}};
              return newEl;
            }
            return el;
          }))
        }}>circle</button>
         <button onClick={() => {
          setProps(props.map((el: IpointComent) => {
            if ( el.id === targetCompanent.id) {
              el.name = 'path';
              const points: [] = [];
              const newEl = {...el, points, [el.name]:{...pathInit}};
              return newEl;
            }
            return el;
          }))
        }}>path</button>
        <button onClick={() => {
          setProps(props.map((el: IpointComent) => {
            if ( el.id === targetCompanent.id) {
              el.name = 'rect';
              const centreX = el.x - 20 - rectInit.width/2 - rectInit.strokeWidth/2;
              const centreY = el.y - 18 - rectInit.height/2 - rectInit.strokeWidth/2;
              const newEl = {...el, [el.name]:{x: centreX, y: centreY, ...rectInit}};
              return newEl;
            }
            return el;
          }))
        }}>rect</button>
        <button onClick={() => {
          setProps(props.map((el: IpointComent) => {
            if ( el.id === targetCompanent.id) {
              el.name = 'ellipse';
              const centreX = el.x;
              const centreY = el.y;
              const newEl = {...el, [el.name]:{cx: centreX, cy: centreY, ...ellipseInit}};
              return newEl;
            }
            return el;
          }))
        }}>ellipse</button>
      </div>)
    };
  return allCompanent(props, setProps);
};

export default AddComent;

import styles from './VertillePlot.module.css';
import React from 'react';

const circleInit = {name: 'circle', r: 20, fill: '#7FFFD4', stroke: '#000000', strokeWidth: 5, comment: ''};
const rectInit = {name: 'rect', width: 100, height: 150, fill: '#7FFFD4', stroke: '#000000' ,strokeWidth: 5, comment: '' };
const ellipseInit = {name: 'ellipse', rx: 100, ry: 50, fill: '#7FFFD4', stroke: '#000000', strokeWidth: 5, comment: ''};

const allCompanent = (props: any, setProps: Function) => {
  const targetCompanent = props.filter((el: any) => el.target)[0];
  const stateCompanent = targetCompanent[targetCompanent.name];
  const keysTargetCompanent = Object.keys(stateCompanent);
  return (
    <div className={styles.FormS}>
      {keysTargetCompanent.map((key: any) => {
        if ( key === 'name') {
          return;
        }
        const name = key;
        const value = stateCompanent[key];
        const type = key === 'fill' || key === 'stroke' ? 'color' : typeof value;
        //const type = typeof value;
        const label = <label>{[key]}</label>
        const imput = React.createElement(
          `${key === 'comment' ? 'textarea' : 'input'}`,
          {value: value, name: name, type: key === 'fill' || key === 'stroke' ? 'color' : typeof value,
            onChange: (e: any) => {
              const newProps = props.map((el: any) => {
                if (el.id === targetCompanent.id) {
                  console.log(el[el.name])
                  el[el.name][key] =  type === 'number' ? Number(e.target.value) : e.target.value
                  return el;
                };
                return el;
              })
            setProps(newProps)}
          },
        );
        return (<tr>{label}{imput}</tr>)
      })}
    </div>
  )
};

const AddComent = (props: any, setProps: Function) => {
  const state = props.length === 0 ? false : props.filter((el: any) => el.target === true)[0] === undefined ? false : true;
    if (!state) {
      return null;
    };
  const targetCompanent: any = props.filter((el: any) => el.target === true)[0];
  //console.log(targetCompanent)
    if (targetCompanent.name === null) {
      return (<div className={styles.ButtonMenu}>
        <button onClick={() => {
          setProps(props.map((el: any) => {
            if ( el.id === targetCompanent.id) {
              el.name = 'circle';
              const centreX = el.x - circleInit.r
              const centreY = el.y - circleInit.r
              const newEl = {...el, [el.name]:{cx: centreX, cy: centreY, ...circleInit}}
              return newEl
            }
            return el;
          }))
        }} >circle</button>
        <button onClick={() => {
          setProps(props.map((el: any) => {
            if ( el.id === targetCompanent.id) {
              el.name = 'rect';
              const centreX = el.x - circleInit.r
              const centreY = el.y - circleInit.r
              const newEl = {...el, [el.name]:{x: centreX, y: centreY, ...rectInit}}
              return newEl;
            }
            return el;
          }))
        }} >rect</button>
        <button onClick={() => {
          setProps(props.map((el: any) => {
            if ( el.id === targetCompanent.id) {
              el.name = 'ellipse';
              const centreX = el.x - circleInit.r
              const centreY = el.y - circleInit.r
              const newEl = {...el, [el.name]:{cx: centreX, cy: centreY, ...ellipseInit}}
              return newEl
            }
            return el;
          }))
        }}>ellipse</button>
      </div>)
    };

    return (<div style={{width: '250'}}>
      {allCompanent(props, setProps)}
      <div className={styles.ButtonMenu}>
        {<button onClick={() => {
          setProps(props.filter((el: any) => el.target !== true))
        }} >{'Удалить'}</button>}
        <button onClick={() => {
          const newProps = props.map((el: any) => {
            if (el.id === targetCompanent.id){
              el.target = false;
              console.log(el)
              return el;
            }
            return el;
          });
          console.log(newProps)
          setProps(newProps)
        }}>{'Сохранить'}
        </button>
      </div>
    </div>)
};

export default AddComent;
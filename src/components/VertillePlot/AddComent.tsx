import Cirkle from './Components/Cirkle'
import Rect from './Components/Rect'
import Ellipse from './Components/Ellipse';
import styles from './VertillePlot.module.css';

const circleInit = {name: 'circle', r: 25, fill: '#7FFFD4', stroke: '#000000', strokeWidth: 5};
const rectInit = {name: 'rect', width: 100, height: 150, fill: '#7FFFD4', strokeWidth: 5 };
const ellipseInit = {name: 'ellipse', rx: 100, ry: 50, fill: '#7FFFD4', stroke: '#000000', strokeWidth: 5};

const maping: any = {
  circle: Cirkle,
  rect: Rect,
  ellipse: Ellipse,
};

const AddComent = (props: any, setProps: Function) => {
  const state = props.length === 0 ? false : props.filter((el: any) => el.target === true)[0] === undefined ? false : true;
    if (!state) {
      return null;
    };
  const targetCompanent: any = props.filter((el: any) => el.target === true)[0];
    if (targetCompanent.name === null) {
      return (<div className={styles.ButtonMenu}>
        <button onClick={() => {
          setProps(props.map((el: any) => {
            if ( el.id === targetCompanent.id) {
              el.name = 'circle';
              return {...el, ...circleInit}
            }
            return el;
          }))
        }} >circle</button>
        <button onClick={() => {
          setProps(props.map((el: any) => {
            if ( el.id === targetCompanent.id) {
              el.name = 'rect';
              return {...el, ...rectInit}
            }
            return el;
          }))
        }} >rect</button>
        <button onClick={() => {
          setProps(props.map((el: any) => {
            if ( el.id === targetCompanent.id) {
              el.name = 'ellipse';
              return {...el,  ...ellipseInit}
            }
            return el;
          }))
        }} >ellipse</button>
      </div>)
    };
    
    // if (!targetCompanent.hasOwnProperty('r')) {
    //   const newProps = props.map((el: any) => {
    //     if (el.id === targetCompanent.id) {
    //       const newEL = {...el, ...map[el.name]};
    //       console.log(newEL)
    //       return newEL;
    //     };
    //     return el;
    //   })
    //   setProps(newProps)
    // };

    return (<div style={{width: '250'}}  >
      {maping[targetCompanent.name](props, setProps)}
      <div className={styles.ButtonMenu}>
        {<button onClick={() => {
          setProps(props.filter((el: any) => el.target !== true))
        }} >{'Закрыть'}</button>}
        <button onClick={() => {
          setProps(props.map((el: any) => {
            if (el.id === targetCompanent.id){
              el.target = false;
              return el;
            }
            return el;
          }))}}>{'Сохранить'}
        </button>
      </div>
    </div>)
};

export default AddComent;
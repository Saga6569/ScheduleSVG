import styles from '../VertillePlot.module.css';

const rectInit = {name: 'rect', width: 100, height: 150, fill: '#7FFFD4', strokeWidth: 5 };

const Rect = (props: any, setProps: any) => {
    const targetCompanent = props.filter((el: any) => el.target)[0];
   return (<>
        <div className={styles.FormS}>
        <tr>
        <label>width</label>
        <input name="width" value={targetCompanent.width} type="number"
        onChange={(e) => {
          const newProps = props.map((el: any) => {
            if (el.id === targetCompanent.id) {
             el.width =  Number(e.target.value)
              return el;
            };
            return el;
          })
          setProps(newProps)
        }} 
       />
        </tr>
        <tr>
        <label>height</label>
        <input name="height" value={targetCompanent.height} type="number"
        onChange={(e) => {
          const newProps = props.map((el: any) => {
            if (el.id === targetCompanent.id) {
             el.height =  Number(e.target.value)
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
      </div>
      </>
      );
  };

export default Rect;
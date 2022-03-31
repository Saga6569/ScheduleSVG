import styles from '../VertillePlot.module.css';

const ellipseInit = {name: 'ellipse', rx: 100, ry: 50, fill: '#7FFFD4', stroke: '#000000', strokeWidth: 5};

const Ellipse = (props: any, setProps: any) => {
    const targetCompanent = props.filter((el: any) => el.target)[0];
   return (<>
        <div className={styles.FormS}>
        <tr>
        <label>rx</label>
        <input name="rx" value={targetCompanent.rx} type="number"
        onChange={(e) => {
          const newProps = props.map((el: any) => {
            if (el.id === targetCompanent.id) {
             el.rx =  Number(e.target.value)
              return el;
            };
            return el;
          })
          setProps(newProps)
        }} 
       />
        </tr>
        <tr>
        <label>ry</label>
        <input name="ry" value={targetCompanent.ry} type="number"
        onChange={(e) => {
          const newProps = props.map((el: any) => {
            if (el.id === targetCompanent.id) {
             el.ry =  Number(e.target.value)
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

export default Ellipse;
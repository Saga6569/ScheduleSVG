import styles from '../VertillePlot.module.css';

const circleInit = {name: 'circle', r: 25, fill: '#7FFFD4', stroke: '#000000', strokeWidth: 5};

const Cirkle = (props: any, setProps: any) => {
  const targetCompanent = props.filter((el: any) => el.target)[0];
 return (<>
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
      <tr>
        <label>Комментарий</label>
        <textarea name="comment" cols={40} rows={3} value={targetCompanent.comment} onChange={(e) => {
          const newProps = props.map((el: any) => {
            if (el.id === targetCompanent.id) {
              el.comment =  e.target.value
              return el;
            };
          return el;
        })
        setProps(newProps)
        }}></textarea>
        <input type="reset"  value="Очистить" onClick={() => {
          const newProps = props.map((el: any) => {
            if (el.id === targetCompanent.id) {
              el.comment = ''
              return el;
            };
          return el;
        })
        setProps(newProps)
        }} />
      </tr>
    </div>
    </>
    );
};

export default Cirkle;
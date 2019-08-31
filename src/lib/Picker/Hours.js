import React from 'react';
import {mapToFarsi} from '../dateUtils';

class Hours extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  start = (e, step) => {
    e.preventDefault();
    if(this.interval){
      clearInterval(this.interval);
    }
    this.fireChange(this.props.hour + step);
    this.interval = setInterval(()=>{
      this.fireChange(this.props.hour + step);
    }, 200);
  };

  stop = (e) => {
    e.preventDefault();
    if(this.interval){
      clearInterval(this.interval);
      this.interval = undefined;
    }
  };

  fireChange = (newHour) => {
    if(newHour > 23) newHour = 0;
    if(newHour < 0) newHour = 23;
    this.props.changeEvent(newHour);
  }

  render() {
    const { hour } = this.props;
    const hourString = mapToFarsi(hour);
    return (
      <div className="JC-HourMinute">
        <div className="JC-Nav"
          onMouseDown={(e)=>this.start(e, 1)} onMouseUp={(e)=>this.stop(e)}
          onTouchStart={(e)=>this.start(e, 1)} onTouchEnd={(e)=>this.stop(e)}
        >&#9650;</div>
        <span className="JC-Title" style={{textAlign: 'right'}}>{hourString}</span>
        <div className="JC-Nav"
          onMouseDown={(e)=>this.start(e, -1)} onMouseUp={(e)=>this.stop(e)}
          onTouchStart={(e)=>this.start(e, -1)} onTouchEnd={(e)=>this.stop(e)}
        >&#9660;</div>
      </div>
    )
  }
}

export default Hours;

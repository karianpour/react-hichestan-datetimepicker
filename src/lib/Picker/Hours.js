import React from 'react';
import {mapToFarsi} from '../dateUtils';
import {UpIcon, DownIcon} from './Icons';

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
    let hourString = hour.toString();
    hourString = mapToFarsi('00'.substring(0, 2 - hourString.length) + hourString);
    return (
      <div className="JC-HourMinute">
        <div className="JC-Nav JC-Nav-Hour"
          onMouseDown={(e)=>this.start(e, 1)} onMouseUp={(e)=>this.stop(e)}
          onTouchStart={(e)=>this.start(e, 1)} onTouchEnd={(e)=>this.stop(e)}
        ><UpIcon/></div>
        <span className="JC-Title" style={{textAlign: 'right'}}>{hourString}</span>
        <div className="JC-Nav JC-Nav-Hour"
          onMouseDown={(e)=>this.start(e, -1)} onMouseUp={(e)=>this.stop(e)}
          onTouchStart={(e)=>this.start(e, -1)} onTouchEnd={(e)=>this.stop(e)}
        ><DownIcon/></div>
      </div>
    )
  }
}

export default Hours;

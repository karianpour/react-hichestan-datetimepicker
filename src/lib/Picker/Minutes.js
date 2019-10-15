import React from 'react';
import {mapToFarsi} from '../dateUtils';
import {UpIcon, DownIcon} from './Icons';

class Minutes extends React.Component {

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
    this.fireChange(this.props.minute + step);
    this.interval = setInterval(()=>{
      this.fireChange(this.props.minute + step);
    }, 200);
  };

  stop = (e) => {
    e.preventDefault();
    if(this.interval){
      clearInterval(this.interval);
      this.interval = undefined;
    }
  };

  fireChange = (newMinute) => {
    if(newMinute > 59) newMinute = 0;
    if(newMinute < 0) newMinute = 59;
    this.props.changeEvent(newMinute);
  }

  render() {
    const { minute } = this.props;
    let minuteString = minute.toString();
    minuteString = mapToFarsi('00'.substring(0, 2 - minuteString.length) + minuteString);

    return (
      <div className="JC-HourMinute">
        <div className="JC-Nav"
          onMouseDown={(e)=>this.start(e, 1)} onMouseUp={(e)=>this.stop(e)}
          onTouchStart={(e)=>this.start(e, 1)} onTouchEnd={(e)=>this.stop(e)}
        ><UpIcon/></div>
        <span className="JC-Title" style={{textAlign: 'left'}}>{minuteString}</span>
        <div className="JC-Nav"
          onMouseDown={(e)=>this.start(e, -1)} onMouseUp={(e)=>this.stop(e)}
          onTouchStart={(e)=>this.start(e, -1)} onTouchEnd={(e)=>this.stop(e)}
        ><DownIcon/></div>
      </div>
    )
  }
}

export default Minutes;

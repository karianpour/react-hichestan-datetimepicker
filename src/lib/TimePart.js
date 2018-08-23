import React, { Component } from 'react';
import "./DateTimeInput.css";
import {isEqualTime} from './dateUtils';

class TimePart extends Component{
  state = {
    hour: '',
    minute: '',
    time: undefined,
    last_props_value: undefined,
  };

  lastUpdatedField = undefined;

  static setupState(newTime) {
    if (newTime) {
      const i = newTime.indexOf(':');
      if (i>0) {
        return {
          hour: newTime.substring(0, i),
          minute: newTime.substring(i+1),
          time: newTime,
        };
      }
    }

    if(newTime===null){
      return ({
        hour: '',
        minute: '',
        time: '',
      });
    }

    return {
      time: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.last_props_value !== nextProps.value) {
      const newTime = nextProps.value;
      if (!isEqualTime(prevState.time, newTime)) {
        console.log('Time Received Props', prevState.last_props_value, nextProps.value);
        const newState = TimePart.setupState(newTime);
        newState.last_props_value = newTime;
        return newState;
      }else{
        return {
          last_props_value: newTime
        };
      }
    }
    return null;
  }

  handleChange = (element, value) => {
    const newState = {
      hour: this.state.hour,
      minute: this.state.minute,
    };
    this.lastUpdatedField = element;
    newState[element] = this.checkAndReturn(element, value);
    newState.time = this.format(newState);
    this.setState(newState, ()=>{
      this.fireOnChange();
    });
  };

  format = ({hour, minute})=>{
    const h = Number(hour);
    const m = Number(minute);

    if(h<0 || h>23){
      return;
    }
    if(m<0 || m>59){
      return;
    }
    if(h===0 && m===0) return '';
    return `${hour}:${minute}`;
  };

  checkAndReturn = (element, value)=>{
    if(value==='') return '';
    const v = Number(value);

    if(element === 'hour' && (v<0 || v>23)){
      return '';
    }
    if(element === 'minute' && (v<0 || v>59)){
      return '';
    }

    if(value.length===2)
      return value;
    else if(value.length<2)
      return '00'.substring(0, 2 - value.length) + value;
    else
      return value.substring(value.length - 2, value.length);
  };

  fireOnChange = () => {
    if(this.props.onChange){
      const e = {
        target: {
          name: this.props.name,
          value: this.state.time,
        }
      };
      this.props.onChange(e);
    }
  };

  render(){
    const {hour, minute} = this.state;

    const {disabled, readonly: readOnly} = this.props;

    return (
    <div className="input-group">
      <input
        type="text"
        className="hour-input"
        disabled={disabled}
        readOnly={readOnly}
        value={hour}
        onChange={e => this.handleChange('hour', e.target.value)}
      />
      <span className={'input-colon'}>:</span>
      <input
        type="text"
        className="minute-input"
        disabled={disabled}
        readOnly={readOnly}
        value={minute}
        onChange={e => this.handleChange('minute', e.target.value)}
      />
    </div>
  )
  }
}

export default TimePart;

import React, { Component } from 'react';
import "./DateTimeInput.css";
import {isEqualDate} from './dateUtils';
import moment from 'moment-jalaali';

class DatePart extends Component{

  state = {
    year: '',
    month: '',
    day: '',
    date: undefined,
    last_props_value: undefined,
  };

  lastUpdatedField = undefined;

  static setupState(newDate) {
    if(newDate) {
      return ({
        year: newDate.substring(0, 4),
        month: newDate.substring(5, 7),
        day: newDate.substring(8, 10),
        date: newDate,
      });
    }

    if(newDate===null){
      return ({
        year: '',
        month: '',
        day: '',
        date: '',
      });
    }
    return ({
      date: '',
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.last_props_value !== nextProps.value) {
      const newDate = nextProps.value;
      if (!isEqualDate(prevState.date, newDate)) {
        console.log('Date Received Props', prevState.last_props_value, nextProps.value);
        const newState = DatePart.setupState(newDate);
        newState.last_props_value = newDate;
        return newState;
      }else{
        return {
          last_props_value: newDate
        };
      }
    }
    return null;
  }

  handleChange = (element, value) => {
    const newState = {};
    this.lastUpdatedField = element;
    newState[element] = this.checkAndReturn(element, value);
    this.setState(newState, ()=>{
      const formatted = `${this.state.year}/${this.state.month}/${this.state.day}`;
      const m = moment(formatted, 'jYYYY/jMM/jDD');
      const newState2 = {};
      if(m.isValid()){
        newState2.date = formatted;
      }else{
        newState2.date = undefined;
      }
      this.setState(newState2, ()=> {
        this.fireOnChange();
      })
    });
  };

  checkAndReturn = (element, value)=>{
    if(value==='') return '';
    const v = Number(value);
    console.log('d', element, value)

    if(element === 'year' && (v<0 || v>1500)){
      return '';
    }
    if(element === 'year' && (v>90 && v<99)){
      return (v + 1300).toString();
    }
    if(element === 'month' && (v<1 || v>12)){
      return '';
    }
    if(element === 'day' && (v<1 || v>31)){
      return '';
    }

    const l = element === 'year' ? 4 : 2;

    if(value.length===l)
      return value;
    else if(value.length<l)
      return '0000'.substring(0, l - value.length) + value;
    else
      return value.substring(value.length - l, value.length);
  };

  fireOnChange = () => {
    if(this.props.onChange){
      const e = {
        target: {
          name: this.props.name,
          value: this.state.date,
        }
      };
      this.props.onChange(e);
    }
  };

  render(){
    const {year, month, day} = this.state;

    const {disabled, readonly: readOnly} = this.props;

    return (
    <div className="input-group-date">
      <input
        type="text"
        className="day-input"
        disabled={disabled}
        readOnly={readOnly}
        value={day}
        onChange={e => this.handleChange('day', e.target.value)}
      />
      <span className={'input-slash'}>/</span>
      <input
        type="text"
        className="month-input"
        disabled={disabled}
        readOnly={readOnly}
        value={month}
        onChange={e => this.handleChange('month', e.target.value)}
      />
      <span className={'input-slash'}>/</span>
      <input
        type="text"
        className="year-input"
        disabled={disabled}
        readOnly={readOnly}
        value={year}
        onChange={e => this.handleChange('year', e.target.value)}
      />
    </div>
  )
  }
}

export default DatePart;

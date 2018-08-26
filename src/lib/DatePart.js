import React, { Component } from 'react';
import "./DateTimeInput.css";
import {isEqualDate, mapToFarsi, mapToLatin, stripAnyThingButDigits} from './dateUtils';
import moment from 'moment-jalaali';

class DatePart extends Component{

  state = {
    year: '',
    month: '',
    day: '',
    date: undefined,
    last_props_value: undefined,
  };

  constructor(props) {
    super(props);
    this.dayRef = React.createRef();
    this.monthRef = React.createRef();
    this.yearRef = React.createRef();
  }

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
        // console.log('Date Received Props', prevState.last_props_value, nextProps.value);
        const newState = DatePart.setupState(newDate);
        newState.last_props_value = newDate;
        return newState;
      }else{
        return {
          last_props_value: newDate
        };
      }
    // }else{
    //   const formatted = DatePart.formatState(prevState);
    //   if(prevState.date !== formatted){
    //     console.log('b', prevState.date, formatted)
    //     return {
    //       date: formatted
    //     };
    //   }
    }
    return null;
  }

  static formatState = (state) => {
    if(!state.year || !state.month || !state.day) return undefined;
    return `${state.year}/${state.month}/${state.day}`;
  };

  handleChange = (element, value) => {
    const newState = {};
    newState[element] = this.checkAndReturn(element, value);
    this.setState(newState, ()=>{
      const formatted = DatePart.formatState(this.state);
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
    // console.log('d', element, value);

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

  focusOnElement = () => {
    if(this.dayRef.current){
      this.dayRef.current.focus();
    }
  };

  focusNext = (e) => {
    e.preventDefault();
    if(!this.monthRef.current || !this.yearRef.current || !this.dayRef.current) {
      return;
    }

    if(document.activeElement === this.dayRef.current){
      this.monthRef.current.focus();
    }else if(document.activeElement === this.monthRef.current){
      this.yearRef.current.focus();
    }else if(document.activeElement === this.yearRef.current){
      if(this.props.focusNext) this.props.focusNext('date');
    }
  };

  render(){
    const {year, month, day} = this.state;

    const {disabled, readonly: readOnly} = this.props;

    return (
    <div className="input-group-date">
      <form className="input-group-date">
      <input ref={this.dayRef}
        type="text"
        inputMode={"numeric"}
        className="day-input"
        disabled={disabled}
        readOnly={readOnly}
        value={mapToFarsi(day)}
        onChange={e => this.handleChange('day', mapToLatin(stripAnyThingButDigits(e.target.value)))}
      />
      <span className={'input-slash'}>/</span>
      <input ref={this.monthRef}
        type="text"
        inputMode={"numeric"}
        className="month-input"
        disabled={disabled}
        readOnly={readOnly}
        value={mapToFarsi(month)}
        onChange={e => this.handleChange('month', mapToLatin(stripAnyThingButDigits(e.target.value)))}
      />
      <span className={'input-slash'}>/</span>
      <input ref={this.yearRef}
        type="text"
        inputMode={"numeric"}
        className="year-input"
        disabled={disabled}
        readOnly={readOnly}
        value={mapToFarsi(year)}
        onChange={e => this.handleChange('year', mapToLatin(stripAnyThingButDigits(e.target.value)))}
      />
      <button onClick={this.focusNext} style={{display: 'none'}}/>
      </form>
    </div>
  )
  }
}

export default DatePart;

import React, { Component } from 'react';
import "./DateTimeInput.css";
import Years from './Picker/Years';
import Months from './Picker/Months';
import Days from './Picker/Days';
import Hours from './Picker/Hours';
import Minutes from './Picker/Minutes';
import jalaali from 'jalaali-js';
import {calcFirstDayOfMonth, isNotEqualDate, gregorianMonthLength} from './dateUtils';
import { createPortal } from 'react-dom';

let modalRoot = null;

class DatePicker extends Component {

  constructor(props) {
    super(props);
    if(!modalRoot){
      modalRoot = document.createElement( 'div' );
      // modalRoot.className = 'JDialogModal';
      document.body.appendChild(modalRoot);
    }

    const { gregorian, selectedDay, pickTime=false } = props;
    let currentDay = selectedDay;
    if(!currentDay){
      currentDay = new Date();
    }else{
      currentDay = new Date(currentDay.getTime());
    }
    if(!pickTime){
      currentDay.setHours(0);
      currentDay.setMinutes(0);
    }
    // currentDay.setSeconds(0);
    let selectedYear, currentMonth, selectedMonthFirstDay, daysCount, selectedHour, selectedMinute;
    if(gregorian){
      let j = currentDay;
      selectedYear = j.getFullYear();
      currentMonth = j.getMonth() + 1;
    }else{
      let j = jalaali.toJalaali(currentDay);
      selectedYear = j.jy;
      currentMonth = j.jm;
    }
    daysCount = gregorian ? gregorianMonthLength(selectedYear, currentMonth) : jalaali.jalaaliMonthLength(selectedYear, currentMonth);
    selectedMonthFirstDay = calcFirstDayOfMonth(selectedYear, currentMonth, gregorian);
    selectedHour = currentDay.getHours();
    selectedMinute = currentDay.getMinutes();
    // console.log({selectedDay})
    this.state = {
      gregorian,
      selectedYear,
      currentMonth,
      selectedMonthFirstDay,
      daysCount,
      selectedDay: selectedDay ? selectedDay : null,
      selectedHour,
      selectedMinute,
    };
  }

  cancelPicker = (e)=>{
    e.preventDefault();
    if(this.props.onDismiss){
      this.props.onDismiss();
    }
    this.props.cancelHandler();
  };

  daysClicked = (dayDate) => {
    if(isNotEqualDate(this.state.selectedDay, dayDate)){
      let newDate;

      if(this.props.pickTime){
        const {selectedHour, selectedMinute} = this.state;
        newDate = new Date(dayDate.getTime());
        newDate.setHours(selectedHour);
        newDate.setMinutes(selectedMinute);
      }else{
        newDate = new Date(Date.UTC(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0));
      }

      this.setState({
        selectedDay: newDate,
      }, this.fireChange);
    }else{
      this.props.cancelHandler();
    }
  };

  fireChange = ()=>{
    this.props.onChange({target: {name: this.props.name, value: this.state.selectedDay}});
  }

  monthsClicked = (month) => {
    let {selectedYear, gregorian} = this.state;
    let currentMonth, daysCount, selectedMonthFirstDay;

    if(month === 0){
      currentMonth = 12;
      selectedYear = selectedYear - 1;
    }else if(month === 13){
      currentMonth = 1;
      selectedYear = selectedYear + 1;
    } else {
      currentMonth = month;
    }
    daysCount = gregorian ? gregorianMonthLength(selectedYear, currentMonth) : jalaali.jalaaliMonthLength(selectedYear, currentMonth);
    selectedMonthFirstDay = calcFirstDayOfMonth(selectedYear, currentMonth, gregorian);

    this.setState({
      currentMonth,
      daysCount,
      selectedYear,
      selectedMonthFirstDay,
    });
  };

  yearSelected = (selectedYear) => {
    let selectedMonthFirstDay, daysCount;
    selectedMonthFirstDay = calcFirstDayOfMonth(selectedYear, this.state.currentMonth, this.state.gregorian);
    daysCount = this.state.gregorian ? gregorianMonthLength(selectedYear, this.state.currentMonth) : jalaali.jalaaliMonthLength(selectedYear, this.state.currentMonth);
    this.setState({
      selectedYear,
      selectedMonthFirstDay,
      daysCount,
    });
  };

  hourSelected = (selectedHour) => {
    let {selectedDay} = this.state;
    if(selectedDay){
      selectedDay.setHours(selectedHour);
    }
    this.setState({
      selectedDay,
      selectedHour,
    }, this.fireChange);
  };

  minuteSelected = (selectedMinute) => {
    let {selectedDay} = this.state;
    if(selectedDay){
      selectedDay.setMinutes(selectedMinute);
    }
    this.setState({
      selectedDay,
      selectedMinute,
    }, this.fireChange);
  };

  gregorianPicker = () => {
    const gregorian = !this.state.gregorian;

    let {selectedDay} = this.state;
    let currentMonth, daysCount, selectedYear, selectedMonthFirstDay;

    if(gregorian){
      let j = selectedDay ? selectedDay : new Date();
      selectedYear = j.getFullYear();
      currentMonth = j.getMonth() + 1;
    }else{
      let j = jalaali.toJalaali(selectedDay ? selectedDay : new Date());
      selectedYear = j.jy;
      currentMonth = j.jm;
    }
    daysCount = gregorian ? gregorianMonthLength(selectedYear, currentMonth) : jalaali.jalaaliMonthLength(selectedYear, currentMonth);
    selectedMonthFirstDay = calcFirstDayOfMonth(selectedYear, currentMonth, gregorian);

    this.setState({
      gregorian, currentMonth, daysCount, selectedYear, selectedMonthFirstDay,
    });
  };

  render() {
    const {
      className,
      closeLabel='بستن',
      style,
      filterDate,
      ltr,
      pickTime=false,
      divRef,
    } = this.props;

    const myStyle = !divRef ? style : {...style,
      position: 'absolute',
      top: divRef.current.offsetTop + divRef.current.offsetHeight + 5, 
      left: ltr ? 
        divRef.current.offsetLeft
        : divRef.current.offsetLeft + divRef.current.offsetWidth - 310,
    };

    const {gregorian, daysCount, selectedDay, currentMonth, selectedYear, selectedMonthFirstDay, selectedHour, selectedMinute} = this.state;

    return createPortal(
      <div className={`JDatePicker${ltr ? ' ltr':''} ${className?className:''}`} style={myStyle}
        onClick={(e)=>{e.preventDefault()}}>
        <Years gregorian={gregorian} changeEvent={(returnedYear)=>this.yearSelected(returnedYear)} year={selectedYear} />
        <Months gregorian={gregorian} clickEvent={(returnedMonth)=>this.monthsClicked(returnedMonth)} month={currentMonth} />
        <div className="days-titles">
          <div>ش</div>
          <div>ی</div>
          <div>د</div>
          <div>س</div>
          <div>چ</div>
          <div>پ</div>
          <div>ج</div>
        </div>
        <Days gregorian={gregorian} selectedYear={selectedYear} selectedDay={selectedDay} currentMonth={currentMonth} daysCount={daysCount} firstDay={selectedMonthFirstDay} clickEvent={this.daysClicked} filterDate={filterDate}/>
        {pickTime && (
          <div className="JC-Clock">
            <Hours changeEvent={(returnedHour)=>this.hourSelected(returnedHour)} hour={selectedHour} />
            &nbsp;:&nbsp;
            <Minutes changeEvent={(returnedMinute)=>this.minuteSelected(returnedMinute)} minute={selectedMinute} />
          </div>
        )}
        <div className="JC-Buttons">
          <button onClick={this.cancelPicker}>{closeLabel}</button>
          {!gregorian && <button onClick={this.gregorianPicker}>{'میلادی'}</button>}
          {gregorian && <button onClick={this.gregorianPicker}>{'شمسی'}</button>}
        </div>
      </div>
    , modalRoot);
  }
}

export default DatePicker;

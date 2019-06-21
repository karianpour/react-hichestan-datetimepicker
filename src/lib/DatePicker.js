import React, { Component } from 'react';
import "./DateTimeInput.css";
import Years from './Picker/Years';
import Months from './Picker/Months';
import Days from './Picker/Days';
import jalaali from 'jalaali-js';
import {calcFirstDayOfMonth, isEqualDate, gregorianMonthLength} from './dateUtils';

class DatePicker extends Component {

  constructor(props) {
    super(props);
    const { gregorian } = props;
    let selectedYear, currentMonth, selectedMonthFirstDay, daysCount;
    if(gregorian){
      let j = new Date();
      selectedYear = j.getFullYear();
      currentMonth = j.getMonth() + 1;
    }else{
      let j = jalaali.toJalaali(new Date());
      selectedYear = j.jy;
      currentMonth = j.jm;
    }
    daysCount = gregorian ? gregorianMonthLength(selectedYear, currentMonth) : jalaali.jalaaliMonthLength(selectedYear, currentMonth);
    selectedMonthFirstDay = calcFirstDayOfMonth(selectedYear, currentMonth, gregorian);
    this.state = {
      gregorian,
      selectedYear,
      currentMonth,
      selectedMonthFirstDay,
      daysCount,
      selectedDay: this.props.selectedDay ? this.props.selectedDay : null,
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
    if(isEqualDate(this.state.selectedDay, dayDate)){
      this.setState({
        selectedDay: dayDate,
      }, ()=>{
        this.props.onChange({target: {name: this.props.name, value: dayDate}});
      });
    }else{
      this.props.cancelHandler();
    }
  };

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
    } = this.props;

    const {gregorian, daysCount, selectedDay, currentMonth, selectedYear, selectedMonthFirstDay} = this.state;

    return (
      <div className={"JDatePicker "+(className?className:"")} style={style}>
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
        <div>
          <button className="JD-Cancel" onClick={this.cancelPicker}>{closeLabel}</button>
          {!gregorian && <button className="JD-Cancel" onClick={this.gregorianPicker}>{'میلادی'}</button>}
          {gregorian && <button className="JD-Cancel" onClick={this.gregorianPicker}>{'شمسی'}</button>}
        </div>
      </div>
    );
  }
}

export default DatePicker;

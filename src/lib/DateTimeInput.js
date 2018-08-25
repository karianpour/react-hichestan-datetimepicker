import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePart from './DatePart';
import TimePart from './TimePart';
import {isEqualDateTime, isEqualMoment} from './dateUtils';
import moment from 'moment-jalaali';
import "./DateTimeInput.css";
import DatePicker from './DatePicker';
import {CalendarIcon, DeleteIcon} from './Picker/Icons';

class DateTimeInput extends Component{

  static propTypes = {
    /**
     * The name that will be set while firing the onChange event in the target object
     */
    name: PropTypes.string,
    /**
     * Callback function that is fired when the date value changes.
     * @param {string} date and time, The new date and time in iso 8601 format like 2018-08-23T21:06:50Z
     * it is always UTC
     */
    onChange: PropTypes.func,
    /**
     * If true, automatically accept and close the picker on select a date.
     */
    autoOk: PropTypes.bool,
    /**
     * Override the default text of the 'OK' button.
     */
    closeLabel: PropTypes.node,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * The css class name of the root element.
     */
    className: PropTypes.string,
    /**
     * Override the inline-styles of DatePickerDialog's Container element.
     */
    dialogContainerStyle: PropTypes.object,
    /**
     * Override the inline-styles of DatePickerDialog's Container element.
     */
    dialogContainerClassName: PropTypes.object,
    /**
     * Disables the DateTimeInput.
     */
    disabled: PropTypes.bool,
    /**
     * makes the DateTimeInput readonly.
     */
    readOnly: PropTypes.bool,
    /**
     * Callback function that is fired when a click event occurs on the Date Picker's `TextField`.
     * @param {object} event Click event targeting the `main div element`.
     */
    onClick: PropTypes.func,
    /**
     * Callback function that is fired when the Date-Time input's dialog is dismissed.
     */
    onDismiss: PropTypes.func,
    /**
     * Callback function that is fired when the Date-Time input's `main div` gains focus.
     */
    onFocus: PropTypes.func,
    /**
     * Callback function that is fired when the Date-Time input's dialog is shown.
     */
    onShow: PropTypes.func,
    /**
     * a function to filter some dates, return true means that it accept the date and false is to reject it. It gives a date 'jYYYY/jMM/jDD' format as the first parameter.
     */
    filterDate: PropTypes.func,
    /**
     * Sets the value for the Date-Time input.
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(moment)
    ]),
  };

  static defaultProps = {
    autoOk: true,
    style: {},
  };


  state = {
    date: undefined,
    time: undefined,
    last_props_value: undefined,
    openDialog: false,
  };

  constructor(props) {
    super(props);
    this.containerPart = React.createRef();
    this.timePart = React.createRef();
  }

  static setupState(m){
    const newState = {};
    if(m && m.isValid()){
      const formatted = m.format('jYYYY/jMM/jDD HH:mm');
      newState.date = formatted.substring(0, 10);
      newState.time = formatted.substring(11, 17);
    }else{
      newState.date = undefined;
      newState.time = undefined;
    }
    return newState;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newDate = DateTimeInput.getControlledDate(nextProps);
    if (!isEqualMoment(prevState.last_props_value, newDate)) {
      if (!isEqualDateTime(prevState.date, newDate)) {
        // console.log('DateTime Received Props', prevState.last_props_value, newDate);
        const newState = DateTimeInput.setupState(newDate);
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

  handleFocus = (event) => {
    // event.target.blur(); // K1: running this makes the input readonly!
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    // if (!this.props.disabled) {
    //   setTimeout(() => {
    //     this.openDialog();
    //   }, 0);
    // }
  };

  static getControlledDate(props) {
    if(!props.value) return;

    if (typeof props.value === 'string') {
      return moment(new Date(props.value));
    }else if (props.value instanceof moment) {
      return props.value;
    }else{
      console.warn('unknown value type ', props.value)
    }
  }

  handleChange = (element, value) => {
    const newState = {};
    newState[element] = value;
    this.setState(newState, ()=>{
      this.fireOnChange();
    });
  };

  fireOnChange = () => {
    if(this.props.onChange){
      const formatted = this.formatValue(this.state.date, this.state.time);
      const e = {
        target: {
          name: this.props.name,
          value: formatted,
        }
      };
      this.props.onChange(e);
    }
  };

  formatValue = (date, time) => {
    const formatted = `${date} ${time}`;
    const m = moment(formatted, 'jYYYY/jMM/jDD HH:mm');
    return m.toISOString();
  };

  handleEmpty = () => {
    this.setState({
      date: null,
      time: null,
    }, ()=>{
      this.fireOnChange();
    });
  };

  handleCalendar = (e) => {
    if(e && e.preventDefault){
      e.preventDefault();
    }

    if(!!(this.state.openDialog && this.state.date && (!this.state.time || this.state.time === '00:00'))){
      this.timePart.current.focusOnElement();
    }else{
      this.containerPart.current.focus();
    }

    this.setState({
      openDialog: !this.state.openDialog
    }, ()=>{
      if(this.state.openDialog && this.props.onShow){
        this.props.onShow();
      }
    });
  };


  render(){
    const {
      disabled,
      readOnly,
      className,
      dialogContainerStyle,
      dialogContainerClassName,
      closeLabel,
      autoOk,
      onDismiss,
      style,
      filterDate,
      // ...other
    } = this.props;

    const {date, time, focusOnHour} = this.state;

    return (
    <div ref={this.containerPart} className={"main-input-group"+(className?" "+className:"")} tabIndex="-1"
         onFocus={this.handleFocus}
         onClick={this.handleClick}
         style={style}
    >
      {this.state.openDialog && (
        <React.Fragment>
          <div className={'OutSideClick'} onClick={this.handleCalendar}> </div>
          <DatePicker
            onChange={e => {
              this.handleChange('date', e.target.value);
              if(autoOk){
                this.handleCalendar();
              }
            }}
            cancelHandler={this.handleCalendar}
            selectedDay={date}
            style={dialogContainerStyle}
            className={dialogContainerClassName}
            closeLabel={closeLabel}
            onDismiss={onDismiss}
            filterDate={filterDate}
          />
        </React.Fragment>
      )}
      <div className={'sub-input-group'}>
        <DatePart
          value={date} disabled={disabled} readOnly={readOnly}
          onChange={e => this.handleChange('date', e.target.value)}
        />&nbsp;
        <TimePart ref={this.timePart}
          value={time} focusOnHour={focusOnHour} disabled={disabled} readOnly={readOnly}
          onChange={e => this.handleChange('time', e.target.value)}
        />
      </div>
      <div className={'input-buttons'} onClick={this.handleCalendar}><CalendarIcon/></div>
      <div className={'input-buttons'} onClick={this.handleEmpty}><DeleteIcon/></div>
    </div>
  )
  }
}

export default DateTimeInput;

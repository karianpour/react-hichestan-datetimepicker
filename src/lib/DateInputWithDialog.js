import React, { Component } from 'react';
import DateInput from './DateInput';
import {CalendarIcon, DeleteIcon} from './Picker/Icons';
import DatePicker from './DatePicker';
import moment from 'moment-jalaali';
import './DateInputWithDialog.css';

class DateInputWithDialog extends Component {

  state = {
    openDialog: false,
  };

  constructor(props){
    super(props);
    this.handleEmpty = this.handleEmpty.bind(this);
  }

  handleCalendar = (e) => {
    if(e && e.preventDefault){
      e.preventDefault();
    }

    if(!!(this.state.openDialog && this.state.date && (!this.state.time || this.state.time === '00:00'))){
      // this.timePart.current.focusOnElement();
    }else{
      // this.containerPart.current.focus();
    }

    this.setState({
      openDialog: !this.state.openDialog
    }, ()=>{
      if(this.state.openDialog && this.props.onShow){
        this.props.onShow();
      }
    });
  };

  handleDateChange = (value) => {
    const newState = {};

    if(!value){
      newState.formatted = '';
      newState.moment = null;
      newState.iso = '';
    }else{
      newState.formatted = value;
      newState.moment = moment(value, 'jYYYY/jMM/jDD');
      const date = newState.moment.toDate();
      newState.moment = moment(new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000));
      newState.iso = newState.moment.toISOString();
    }

    this.setState(newState, ()=>{
      this.fireOnChange();
    });
  };

  handleEmpty(){
    this.handleDateChange('');
  }

  fireOnChange = () => {
    if(this.props.onChange){
      const e = {
        target: {
          name: this.props.name,
          value: this.state.iso,
          formatted: this.state.formatted,
          moment: this.state.moment,
        }
      };
      this.props.onChange(e);
    }
  };

  render(){
    const {
      disabled,
      readOnly,
      className,
      value,
      dialogContainerStyle,
      dialogContainerClassName,
      closeLabel,
      autoOk,
      onDismiss,
      style,
      filterDate,
      ...rest
    } = this.props;

    return (
      <div className='date-input-with-dialog-main'>
        <DateInput
          className={`date-input-with-dialog-input ${this.props.className ? this.props.className : ''}`} 
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          {...rest}
        />
        <div className={'date-input-with-dialog-input-buttons date-input-with-dialog-calendar'} onClick={this.handleCalendar}><CalendarIcon/></div>
        <div className={'date-input-with-dialog-input-buttons date-input-with-dialog-empty'} onClick={this.handleEmpty}><DeleteIcon/></div>
        {this.state.openDialog && (
          <React.Fragment>
            <div className={'OutSideClick'} onClick={this.handleCalendar}> </div>
            <DatePicker
              onChange={e => {
                this.handleDateChange(e.target.value);
                if(autoOk){
                  this.handleCalendar();
                }
              }}
              cancelHandler={this.handleCalendar}
              selectedDay={value}
              style={dialogContainerStyle}
              className={dialogContainerClassName}
              closeLabel={closeLabel}
              onDismiss={onDismiss}
              filterDate={filterDate}
            />
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default DateInputWithDialog;
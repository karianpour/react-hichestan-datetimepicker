import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowEqualObjects from 'shallow-equal/objects';
import {isValueEmpty, isValueValidDateTime, splitDateTimeValue, formatGregorian, formatJalaali, formatTime, inspectYear, inspectMonth, inspectDay, inspectHour, inspectMinute, mapToLatin, mapToFarsi, readDateFromValue, hasStringACharToGoToNext, maxDayFor, baseYear, NUMBER_FORMAT_LATIN, NUMBER_FORMAT_FARSI} from './dateUtils';
import jalaali from 'jalaali-js';

const DATE_SEPERATOR =  '/';// this is arabic date seperator ' ؍' but it is right to left glyph and as the numbers are left to right there will be caret position problem
const MIDDLE_SEPERATOR =  '\xa0';
const TIME_SEPERATOR =  ':';
const EMPTY_VALUE = `    ${DATE_SEPERATOR}  ${DATE_SEPERATOR}  ${MIDDLE_SEPERATOR}  ${TIME_SEPERATOR}  `;

class DateInput extends Component {

  static propTypes = {
    /**
     * The ref to pass on the input, if empty it will be created internally
     */
    inputRef: PropTypes.any,
    /**
     * The name that will be set while firing the onChange event in the target object
     */
    name: PropTypes.string,
    /**
     * The number format to show 'FARSI' / 'LATIN'
     */
    numberFormat: PropTypes.string,
    /**
     * Callback function that is fired when the date value changes.
     * @param {string} date and time, The new date and time in iso 8601 format like 2018-08-23T21:06:50Z
     * it is always UTC
     */
    onChange: PropTypes.func,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * The css class name of the root element.
     */
    className: PropTypes.string,
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
     * Callback function that is fired when the Date-Time input's `main div` gains focus.
     */
    onFocus: PropTypes.func,
    /**
     * Callback function that is fired when the user press F4 to open the dialog.
     */
    onShowDialog: PropTypes.func,
    /**
     * makes the DateTimeInput gregorian.
     */
    gregorian: PropTypes.bool,
    /**
     * Sets the value for the Date-Time input.
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
  };

  static defaultProps = {
    style: {},
  };

  constructor(props) {
    super(props);
    this.emptyValue = this.emptyValue.bind(this);

    let ref;
    if(props.inputRef && typeof props.inputRef === 'function'){
      ref = props.inputRef();
    }else if(props.inputRef && typeof props.inputRef === 'object'){
      ref = props.inputRef;
    }

    this.inputRef = ref ? ref : React.createRef();
    // this.rr = React.createRef();

    this.values = this.readValuesFromProps(props);
    this.previousValue = this.values.value;
  }

  readValuesFromProps = (props) => {
    const j = readDateFromValue(props.value);
    const valueIsValid = !!j;
    const value = valueIsValid ? (props.gregorian ? formatGregorian(j.value) : formatJalaali(j.j)) + MIDDLE_SEPERATOR + formatTime(j.value) : '';
    const date = valueIsValid ? j.value :  null;
    const iso = valueIsValid ? j.value.toISOString() :  '';
    const valueToShow = this.mapValue(value, props.numberFormat);


    return {
      value,
      valueToShow,
      valueIsValid,
      iso,
      date,
      selectionStart: undefined,
      selectionEnd: undefined,
    };
  };

  emptyValue() {
    this.updateState(this.resetValues());
  };

  handleFocus = (event) => {
    if(isValueEmpty(this.values.value)){
      this.jumpToDay();
    }
    if(this.props.onFocus){
      this.props.onFocus(event);
    }
  };

  handleBlur = (event) => {
    const splittedValue = splitDateTimeValue(this.values.value);
    this.updateState(this.sanitizeValues(splittedValue, this.values, true, true, true, true, true));
    if(this.props.onBlur){
      this.props.onBlur(event);
    }
  };

  jumpToNext = () => {
    const selectionStart = this.inputRef.current.selectionStart;
    const splittedValue = splitDateTimeValue(this.values.value);

    if(this.isCaretAtDay(splittedValue, selectionStart)){
      this.updateState(this.sanitizeValues(splittedValue, this.values, true, false, false, false, false));
      this.jumpToMonth();
      return true;
    }else if(this.isCaretAtMonth(splittedValue, selectionStart)){
      this.updateState(this.sanitizeValues(splittedValue, this.values, false, true, false, false, false));
      this.jumpToYear();
      return true;
    }else if(this.isCaretAtYear(splittedValue, selectionStart)){
      this.updateState(this.sanitizeValues(splittedValue, this.values, false, false, true, false, false));
      this.jumpToHour();
      return true;
    }else if(this.isCaretAtHour(splittedValue, selectionStart)){
      this.updateState(this.sanitizeValues(splittedValue, this.values, false, false, false, true, false));
      this.jumpToMinute();
      return true;
    }else if(this.isCaretAtMinute(splittedValue, selectionStart)){
      this.updateState(this.sanitizeValues(splittedValue, this.values, false, false, false, false, true));
    }
    return false;
  };

  jumpToPrevious = () => {
    const selectionStart = this.inputRef.current.selectionStart;
    const splittedValue = splitDateTimeValue(this.values.value);

    if(this.isCaretAtDay(splittedValue, selectionStart)){
      this.updateState(this.sanitizeValues(splittedValue, this.values, true, false, false, false, false));
    }else if(this.isCaretAtMonth(splittedValue, selectionStart)){
      this.updateState(this.sanitizeValues(splittedValue, this.values, false, true, false, false, false));
      this.jumpToDay();
      return true;
    }else if(this.isCaretAtYear(splittedValue, selectionStart)){
      this.updateState(this.sanitizeValues(splittedValue, this.values, false, false, true, false, false));
      this.jumpToMonth();
      return true;
    }else if(this.isCaretAtHour(splittedValue, selectionStart)){
      this.updateState(this.sanitizeValues(splittedValue, this.values, false, false, false, true, false));
      this.jumpToYear();
      return true;
    }else if(this.isCaretAtMinute(splittedValue, selectionStart)){
      this.updateState(this.sanitizeValues(splittedValue, this.values, false, false, false, false, true));
      this.jumpToHour();
      return true;
    }
    return false;
  };

  jumpToDay = () => {
    this.values.selectionStart = 10;
    this.values.selectionEnd = 10;
    this.inputRef.current.setSelectionRange(this.values.selectionStart, this.values.selectionEnd);
  };

  jumpToMonth = () => {
    this.values.selectionStart = 7;
    this.values.selectionEnd = 7;
    this.inputRef.current.setSelectionRange(this.values.selectionStart, this.values.selectionEnd);
  };

  jumpToYear = () => {
    this.values.selectionStart = 4;
    this.values.selectionEnd = 4;
    this.inputRef.current.setSelectionRange(this.values.selectionStart, this.values.selectionEnd);
  };

  jumpToHour = () => {
    this.values.selectionStart = 13;
    this.values.selectionEnd = 13;
    this.inputRef.current.setSelectionRange(this.values.selectionStart, this.values.selectionEnd);
  };

  jumpToMinute = () => {
    this.values.selectionStart = 16;
    this.values.selectionEnd = 16;
    this.inputRef.current.setSelectionRange(this.values.selectionStart, this.values.selectionEnd);
  };

  handleKeyDown = (event) => {
    // console.log('keyCode: ', event.keyCode, 'key: ', event.key);
    if(event.keyCode===8) { //backspace
      event.preventDefault();
      this.updateState(this.deleteValue(event.target, -1));
    }else if(event.keyCode===46){ //delete
      event.preventDefault();
      this.updateState(this.deleteValue(event.target, 1));
    }else if(event.keyCode>=48 && event.keyCode<=57){ //digits
      event.preventDefault();
      // console.log('digit');
      this.updateState(this.updateValue(event.target, (event.keyCode - 48).toString(), this.props.numberFormat));
    }else if(event.keyCode>=96 && event.keyCode<=105){ //digits
      event.preventDefault();
      // console.log('digit');
      this.updateState(this.updateValue(event.target, (event.keyCode - 96).toString(), this.props.numberFormat));
    }else if(event.key>='۰' && event.key<='۹'){ //digits
      event.preventDefault();
      // console.log('digit');
      this.updateState(this.updateValue(event.target, event.key, this.props.numberFormat));
    }else if(event.key==='.' || event.key==='/' || event.key==='-' || event.key==='*' || event.key==='#' 
             || 
             event.keyCode===188 || event.keyCode===189 || event.keyCode===190 || event.keyCode===191 
             ){
      event.preventDefault();
      if(event.ctrlKey || event.shiftKey || event.metaKey || event.key==='#'){
        this.jumpToPrevious();
      }else{
        this.jumpToNext();
      }
    }else if(event.keyCode>=35 && event.keyCode<=40){ //arrows
    }else if(event.keyCode===9){ //tab
      if(Math.abs(this.inputRef.current.selectionStart - this.inputRef.current.selectionEnd)===this.inputRef.current.value.length){
        return;
      }
      if(event.ctrlKey || event.shiftKey || event.metaKey){
        if(this.jumpToPrevious()) event.preventDefault();
      }else{
        if(this.jumpToNext()) event.preventDefault();
      }
    }else if(event.keyCode===13){ //return
      this.hideKeyboard();
    }else if((event.ctrlKey || event.metaKey) && (event.keyCode===67 || event.keyCode===86)){ //copy/paste
    }else if((event.ctrlKey || event.metaKey) && (event.keyCode===82)){ //refresh key
    }else if((event.ctrlKey || event.metaKey) && (event.keyCode===73)){ //inspector
    }else if((event.ctrlKey || event.metaKey) && (event.keyCode===65)){ //select all
    }else if(event.keyCode===115){ // F4
      if(this.props.onShowDialog) {
        event.preventDefault();
        this.props.onShowDialog();
      }
    }else if(event.keyCode>=112 && event.keyCode<=123){ // All other F keys
    }else if(event.keyCode===229){ //android bug workaround
      //K1 : I guess that we have to save the caret position as the input will change it, we need it to know where we have to jump to in handleInput function
      this.values.selectionStart = this.inputRef.current.selectionStart;
      this.values.selectionEnd = this.inputRef.current.selectionEnd;
    }else{
      // console.log('other');
      //console.log('keyCode: ', event.keyCode, 'key: ', event.key, 'ctrlKey: ', event.ctrlKey);
      //  this.rr.current.innerText = `keyCode: ${event.keyCode} key:  ${event.key} ctrlKey: ${event.ctrlKey}`;
      event.preventDefault();
    }
  };

  hideKeyboard = () => {
    this.inputRef.current.blur();
  }

  handlePaste = (event) => {
    event.preventDefault();

    const d = (event.clipboardData || window.clipboardData).getData('text').trim();
    this.stringArrived(d);
  };

  handleInput = (event) => {
    event.preventDefault();
    if(this.values.valueToShow===event.target.value) return;
    const d = event.target.value;
    this.stringArrived(d)
    
    if(this.inputRef.current.value !== this.values.valueToShow){
      this.inputRef.current.value = this.values.valueToShow;
      this.inputRef.current.setSelectionRange(this.values.selectionStart, this.values.selectionEnd);
    }

    if(hasStringACharToGoToNext(d)){
      this.jumpToNext();
    }
  };

  stringArrived = (d) => {
    d = mapToLatin(d);
    let date = isValueValidDateTime(d, this.props.gregorian);
    if(!date){
      date = new Date(d);
      if(date.toString() === 'Invalid Date') {
        date = false;
      }
    }
    if(!!date){
      let value;
      if(this.props.gregorian){
        value = formatGregorian(date);
      }else{
        const j = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate());
        value = formatJalaali(j);
      }
      value = value + MIDDLE_SEPERATOR + formatTime(date);
      const valueIsValid = true;
      const iso = date.toISOString();
      const valueToShow = this.mapValue(value, this.props.numberFormat);

      const newState = {
        value,
        valueToShow,
        valueIsValid,
        iso,
        date,
        selectionStart: undefined,
        selectionEnd: undefined,
      };

      this.updateState(newState);
    }
  }


  mapValue = (value, numberFormat) => {
    if(numberFormat===NUMBER_FORMAT_FARSI){
      const mapped = mapToFarsi(value);
      return mapped;
    }else if(numberFormat===NUMBER_FORMAT_LATIN){
      const mapped = mapToLatin(value);
      return mapped;
    }
    const mapped = mapToFarsi(value);
    return mapped;
  };


  updateState = (newState) => {
    if(!newState) return;

    this.values = newState;

    if(!this.values.value) {
      this.values.iso = '';
      this.values.date = null;
      this.values.valueIsValid = false;
    }else{
      if(newState.date){
        this.values.valueIsValid = true;
        this.values.date = newState.date;
        this.values.iso = newState.iso ? newState.iso : this.values.date.toISOString();
      }else{
        const date = isValueValidDateTime(this.values.value, this.props.gregorian);
        this.values.valueIsValid = !!date;
        if(this.values.valueIsValid){
          this.values.date = date;
          this.values.iso = this.values.date.toISOString();
        }else{
          this.values.date = null;
          this.values.iso = '';
        }
      }
    }

    let fireOnChangeInTheEnd = false;
    // console.log('values on updateState', this.values)
    if(this.inputRef.current.value !== this.values.valueToShow){
      fireOnChangeInTheEnd = true;
      this.inputRef.current.value = this.values.valueToShow;
    }
    if(this.inputRef.current===document.activeElement){
      // console.log('has focus :D', this.values.selectionStart, this.values.selectionEnd);
      this.inputRef.current.setSelectionRange(this.values.selectionStart, this.values.selectionEnd);
    }else{
      // console.log('has not focus :(');
    }
    if(fireOnChangeInTheEnd){
      this.fireOnChange();
    }
  };

  updateValue = (element, enteredValue, numberFormat) => {
    const enteredValueMapped = this.mapValue(enteredValue, numberFormat);
    let valueToShow = element.value;
    let selectionStart = element.selectionStart;
    let selectionEnd = element.selectionEnd;
    if(valueToShow===''){
      valueToShow = EMPTY_VALUE;
      selectionStart = 10;
      selectionEnd = 10;
    }

    valueToShow = valueToShow.substring(0, selectionStart) + enteredValueMapped + valueToShow.substring(selectionEnd);

    selectionStart += enteredValueMapped.length;
    selectionEnd = selectionStart;

    const value = mapToLatin(valueToShow);

    const values = this.inspectValues({
      value,
      valueToShow,
      selectionStart,
      selectionEnd,
    });
    return values; 
  };


  isCaretAtDay = (splittedValue, selectionStart) => {
    return splittedValue && selectionStart<=splittedValue.seperator3 && selectionStart>splittedValue.seperator2;
  };

  isCaretAtMonth = (splittedValue, selectionStart) => {
    return splittedValue && selectionStart<=splittedValue.seperator2 && selectionStart>splittedValue.seperator1;
  };

  isCaretAtYear = (splittedValue, selectionStart) => {
    return splittedValue && selectionStart<=splittedValue.seperator1;
  };

  isCaretAtHour = (splittedValue, selectionStart) => {
    return splittedValue && selectionStart<=splittedValue.seperator4 && selectionStart>splittedValue.seperator3;
  };

  isCaretAtMinute = (splittedValue, selectionStart) => {
    return splittedValue && selectionStart>splittedValue.seperator4;
  };


  sanitizeValues = (splittedValue, values, sanitizeDay, sanitizeMonth, sanitizeYear, sanitizeHour, sanitizeMinute) => {
    const {value} = values;
    if(splittedValue==='') {
      return null;
    }

    if(!splittedValue) {
      return this.resetValues();
    }

    let {year, month, day, hour, minute} = splittedValue;

    if(sanitizeDay){
      if(day.length===0){
        day = '  ';
      }else if(day.length===1){
        if(day === '0' || day === ' '){
          day = '  ';
        }else{
          day = '0' + day;
        }
      }
    }

    if(sanitizeMonth){
      if(month.length===0){
        month = '  ';
      }else if(month.length===1){
        if(month === '0' || month === ' '){
          month = '  ';
        }else{
          month = '0' + month;
        }
      }
    }

    if(sanitizeYear){
      year = year.trim();
      year = baseYear(this.props.gregorian).substring(0, 4 - year.length) + year;
    }

    if(sanitizeHour){
      if(hour.length===0){
        hour = '00';
      }else if(hour.length===1){
        if(hour === '0' || hour === ' '){
          hour = '00';
        }else{
          hour = '0' + hour;
        }
      }
    }

    if(sanitizeMinute){
      if(minute.length===0){
        minute = '00';
      }else if(minute.length===1){
        if(minute === '0' || minute === ' '){
          minute = '00';
        }else{
          minute = '0' + minute;
        }
      }
    }

    const newValue = `${year}${DATE_SEPERATOR}${month}${DATE_SEPERATOR}${day}${MIDDLE_SEPERATOR}${hour}${TIME_SEPERATOR}${minute}`;

    if(value !== newValue){
      return {
        ...values, 
        value: newValue, 
        valueToShow: this.mapValue(newValue, this.props.numberFormat),
      };
    }
  };

  inspectValues = (values) => {
    const {value} = values;
    const splittedValue = splitDateTimeValue(value);
    if(!splittedValue) {
      return this.resetValues();
    }
    let {year, month, day, hour, minute} = splittedValue;
    let newStartPosition = values.selectionStart;

    if(this.isCaretAtDay(splittedValue, values.selectionStart)){
      const inspected = inspectDay(day, values.selectionStart, splittedValue.seperator2, maxDayFor(year, month, this.props.gregorian));
      newStartPosition =  inspected.newStartPosition;
      day = inspected.newDay;
    }else if(this.isCaretAtMonth(splittedValue, values.selectionStart)){
      const inspected = inspectMonth(month, values.selectionStart, splittedValue.seperator1);
      newStartPosition =  inspected.newStartPosition;
      month = inspected.newMonth;
    }else if(this.isCaretAtYear(splittedValue, values.selectionStart)){
      const inspected = inspectYear(year, values.selectionStart);
      newStartPosition =  inspected.newStartPosition;
      year = inspected.newYear;
    }else if(this.isCaretAtHour(splittedValue, values.selectionStart)){
      const inspected = inspectHour(hour, values.selectionStart, splittedValue.seperator3);
      newStartPosition =  inspected.newStartPosition;
      hour = inspected.newHour;
    }else if(this.isCaretAtMinute(splittedValue, values.selectionStart)){
      const inspected = inspectMinute(minute, values.selectionStart, splittedValue.seperator4);
      newStartPosition =  inspected.newStartPosition;
      minute = inspected.newMinute;
    }

    const newValue = `${year}${DATE_SEPERATOR}${month}${DATE_SEPERATOR}${day}${MIDDLE_SEPERATOR}${hour}${TIME_SEPERATOR}${minute}`;

    return {
      value: newValue,
      valueToShow: this.mapValue(newValue, this.props.numberFormat),
      selectionStart: newStartPosition,
      selectionEnd: newStartPosition,
    };
  };

  resetValues = () => {
    const value = '';
    return {
      value,
      valueToShow: this.mapValue(value, this.props.numberFormat),
      selectionStart: 10,
      selectionEnd: 10,
    };
  };

  deleteValue = (element, qty) => {
    let valueToShow = element.value;
    let selectionStart = element.selectionStart;
    let selectionEnd = element.selectionEnd;

    if(selectionStart===selectionEnd){
      if(qty < 0) {
        if(selectionStart===0) return;
        const toBeDeleted = valueToShow.substring(selectionStart + qty, selectionStart);
        if(toBeDeleted===DATE_SEPERATOR || toBeDeleted===MIDDLE_SEPERATOR || toBeDeleted===TIME_SEPERATOR) return;
        valueToShow = valueToShow.substring(0, selectionStart + qty) + valueToShow.substring(selectionEnd);
        selectionStart += qty;
      }else{
        if(selectionEnd===valueToShow.length) return;
        const toBeDeleted = valueToShow.substring(selectionStart, selectionStart + qty);
        if(toBeDeleted===DATE_SEPERATOR || toBeDeleted===MIDDLE_SEPERATOR || toBeDeleted===TIME_SEPERATOR) return;
        valueToShow = valueToShow.substring(0, selectionStart) + valueToShow.substring(selectionEnd+qty);
      }
    }else{
      valueToShow = valueToShow.substring(0, selectionStart) + valueToShow.substring(selectionEnd);
    }

    selectionEnd = selectionStart;

    const value = mapToLatin(valueToShow);

    const values = this.inspectValues({
      value,
      valueToShow,
      selectionStart,
      selectionEnd,
    });

    return values; 
  };

  fireOnChange = () => {
    if(this.props.onChange){
      const value = this.values.valueIsValid ? this.values.value : '';
      if(this.previousValue !== value){
        this.previousValue = value;
        const target = !this.values.valueIsValid ? {name: this.props.name, formatted: '', value: '', date: null} : {
          name: this.props.name,
          value: this.values.iso,
          formatted: this.values.value,
          date: this.values.date,
        };
        this.props.onChange({target});
      }
    }
  };

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.value !== this.values.iso || nextProps.gregorian !== this.props.gregorian || nextProps.numberFormat !== this.props.numberFormat){
      this.updateState(this.readValuesFromProps(nextProps));
    }
    if(!shallowEqualObjects(nextProps.style, this.props.style)){
      return true;
    }
    if(nextProps.className !== this.props.className){
      this.inputRef.current.className = nextProps.className;
    }
    return false;
  }

  render() {
    const {gregorian, value, onChange, onFocus, onBlur, onInput, onPaste, onKeyDown, onShowDialog, pattern, inputMode, defaultValue, type, inputRef, numberFormat, ...rest} = this.props;
    const {valueToShow} = this.values;

    // const localInputMode = this.props.type === 'tel' ? 'tel' : 'numeric'; // as we use type=tel, then we do not need it any more
    // const localPattern = '[0-9]*'; // it has problem with the form checking, as we insert persian digit, it is not acceptable for the browser

    return (
      <input
        ref={this.inputRef}
        type={"tel"} // I tried to use text and using inputMode, but it does not work on Safari
        // inputMode={localInputMode}
        // xInputMode={localnputMode} // in firefox OS it is x-inputmode, I do not know how to handle it
        dir={"ltr"}
        // pattern={localPattern}
        defaultValue={valueToShow}
        onKeyDown={this.handleKeyDown}
        onPaste={this.handlePaste}
        onInput={this.handleInput}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        {...rest}
      />
      );
    //<p ref={this.rr} type={"text"}>empty</p></div>

  }
}
export default DateInput;
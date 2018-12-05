import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowEqualObjects from 'shallow-equal/objects';
import moment from 'moment-jalaali';

export const NUMBER_FORMAT_FARSI = 'FARSI';
export const NUMBER_FORMAT_LATIN = 'LATIN';
const DATE_SEPERATOR =  '/';// this is arabic date seperator ' ؍' but it is right to left glyph and as the numbers are left to right there will be caret position problem
const MIDDLE_SEPERATOR =  '\xa0';
const TIME_SEPERATOR =  ':';
const SEPERATORES_REGEX = new RegExp(` [${DATE_SEPERATOR}${MIDDLE_SEPERATOR}${TIME_SEPERATOR}]`, 'g');
const DATE_FORMAT = `jYYYY${DATE_SEPERATOR}jMM${DATE_SEPERATOR}jDD${MIDDLE_SEPERATOR}HH${TIME_SEPERATOR}mm`;
const LeapYears = [1387, 1391, 1395, 1399, 1403, 1408, 1412, 1416, 1383, 1379, 1375, 1370, 1366, 1362, 1358, 1354];

class DateInput extends Component {

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
     * Sets the value for the Date-Time input.
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(moment)
    ]),
  };

  static defaultProps = {
    style: {},
  };

  constructor(props) {
    super(props);
    this.emptyValue = this.emptyValue.bind(this);

    this.inputRef = props.ref ? props.ref : React.createRef();
    // this.rr = React.createRef();

    this.values = this.readValuesFromProps(props);
    this.previousValue = this.values.value;
  }

  readDateFromValue = (value) => {
    if(!value) return '';
    if (typeof value === 'string') {
      value = mapToLatin(value);
      let m = moment(new Date(value));
      if(m.isValid() && m.year() > 1700) return m;
      m = moment(value, DATE_FORMAT);
      if(m.isValid()) return m;
    }else if (value instanceof moment) {
      return value;
    }else{
      console.warn('unknown value type ', value)
    }
    return '';
  };

  readValuesFromProps = (props) => {
    const moment = this.readDateFromValue(props.value);
    const valueIsValid = moment && moment.isValid();
    const value = valueIsValid ? moment.format(DATE_FORMAT) : '';
    const iso = valueIsValid ? moment.format(): '';
    const valueToShow = this.mapValue(value, props.numberFormat);

    return {
      value,
      valueToShow,
      valueIsValid,
      iso,
      moment,
      selectionStart: undefined,
      selectionEnd: undefined,
    };
  };

  emptyValue() {
    this.updateState(this.resetValues());
  };

  handleFocus = (event) => {
    if(this.isValueEmpty(this.values.value)){
      this.jumpToDay();
    }
    if(this.props.onFocus){
      this.props.onFocus(event);
    }
  };

  handleBlur = (event) => {
    this.updateState(this.sanitizeValues(this.values, true, true, true, true, true));
    if(this.props.onBlur){
      this.props.onBlur(event);
    }
  };

  jumpToNext = () => {
    const selectionStart = this.inputRef.current.selectionStart;
    if(this.isCaretAtDay(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, true, false, false, false, false));
      this.jumpToMonth();
      return true;
    }else if(this.isCaretAtMonth(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, true, false, false, false));
      this.jumpToYear();
      return true;
    }else if(this.isCaretAtYear(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, false, true, false, false));
      this.jumpToHour();
      return true;
    }else if(this.isCaretAtHour(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, false, false, true, false));
      this.jumpToMinute();
      return true;
    }else if(this.isCaretAtMinute(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, false, false, false, true));
    }
    return false;
  };

  jumpToPrevious = () => {
    const selectionStart = this.inputRef.current.selectionStart;
    if(this.isCaretAtDay(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, true, false, false, false, false));
    }else if(this.isCaretAtMonth(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, true, false, false, false));
      this.jumpToDay();
      return true;
    }else if(this.isCaretAtYear(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, false, true, false, false));
      this.jumpToMonth();
      return true;
    }else if(this.isCaretAtHour(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, false, false, true, false));
      this.jumpToYear();
      return true;
    }else if(this.isCaretAtMinute(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, false, false, false, true));
      this.jumpToHour();
      return true;
    }
    return false;
  };

  isValueEmpty = (value) => {
    if(value.replace(SEPERATORES_REGEX, '')==='') return true;
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

  isCaretAtDay = (selectionStart) => {
    return selectionStart>=8 && selectionStart<=10;
  };

  isCaretAtMonth = (selectionStart) => {
    return selectionStart>=5 && selectionStart<=7;
  };

  isCaretAtYear = (selectionStart) => {
    return selectionStart>=0 && selectionStart<=4;
  };

  isCaretAtHour = (selectionStart) => {
    return selectionStart>=11 && selectionStart<=13;
  };

  isCaretAtMinute = (selectionStart) => {
    return selectionStart>=14 && selectionStart<=16;
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
    }else if(event.keyCode>=36 && event.keyCode<=40){ //arrows
    }else if(event.keyCode===9){ //tab
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
      // console.log('keyCode: ', event.keyCode, 'key: ', event.key, 'ctrlKey: ', event.ctrlKey);
      //  this.rr.current.innerText = `keyCode: ${event.keyCode} key:  ${event.key} ctrlKey: ${event.ctrlKey}`;
      event.preventDefault();
    }
  };

  hideKeyboard = () => {
    this.inputRef.current.blur();
  }

  handlePaste = (event) => {
    event.preventDefault();

    const moment = this.readDateFromValue((event.clipboardData || window.clipboardData).getData('text'));

    const valueIsValid = moment && moment.isValid();
    if(valueIsValid){
      // console.log({parsedValue: moment.format()});
      const value = valueIsValid ? moment.format(DATE_FORMAT) : '';
      const iso = valueIsValid ? moment.format(): '';
      const valueToShow = this.mapValue(value, this.props.numberFormat);
  
      const newState = {
        value,
        valueToShow,
        valueIsValid,
        iso,
        moment,
        selectionStart: undefined,
        selectionEnd: undefined,
      };

      this.updateState(newState);
    }
  
  };

  handleInput = (event) => {
    event.preventDefault();
    if(this.values.valueToShow===event.target.value) return;
    const inputValue = event.target.value;
    // this.rr.current.innerText = `${inputValue}`;
    
    if(this.inputRef.current.value !== this.values.valueToShow){
      this.inputRef.current.value = this.values.valueToShow;
      this.inputRef.current.setSelectionRange(this.values.selectionStart, this.values.selectionEnd);
    }

    if(this.hasStringACharToGoToNext(inputValue)){
      this.jumpToNext();
    }

    // this.updateState(this.rollbackValue());
  };

  hasStringACharToGoToNext = (str) => {
    if(str.indexOf('.')>=0) return true;
    if(str.indexOf(',')>=0) return true;
    // if(str.indexOf('/')>=0) return true;
    if(str.indexOf('-')>=0) return true;
    if(str.indexOf(';')>=0) return true;
    if(str.indexOf('*')>=0) return true;
    if(str.indexOf('#')>=0) return true;
    if(str.indexOf(' ')>=0) return true;
    if(str.indexOf('،')>=0) return true;
    return false;
  };

  mapValue = (value, numberFormat) => {
    if(numberFormat===NUMBER_FORMAT_FARSI){
      return mapToFarsi(value);
    }else if(numberFormat===NUMBER_FORMAT_LATIN){
      return mapToLatin(value);
    }
    return mapToFarsi(value);
  };


  updateState = (newState) => {
    if(!newState) return;

    this.values = newState;

    if(!this.values.value) {
      this.values.iso = '';
      this.values.moment = null;
      this.values.valueIsValid = false;
    }else{
      this.values.valueIsValid = this.isValueValidData(this.values.value);
      if(this.values.valueIsValid){
        this.values.moment = moment(this.values.value, DATE_FORMAT);
        this.values.iso = this.values.moment.format();
      }else{
        this.values.moment = null;
        this.values.iso = '';
      }
    }

    let fireOnChangeInTheEnd = false;
    // console.log('values on updateState', this.values)
    if(this.inputRef.current.value !== this.values.valueToShow){
      fireOnChangeInTheEnd = true;
      this.inputRef.current.value = this.values.valueToShow;
    }
    if(this.inputRef.current===document.activeElement){
      // console.log('has focus :D');
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


  maxDayFor = (month, year) => {
    if(!month) return 31;
    month = Number(month);
    if(month < 7) return 31;
    if(month > 7 && month < 12) return 30;
    if(!year) return 30;
    year = Number(year);
    if(month === 12 && LeapYears.find(y => y===year)) return 30;
    return 29;
  };


  isValueValidData = (value) => {
    if(!value) return false;
    const seperator1 = value.indexOf(DATE_SEPERATOR);
    const seperator2 = value.indexOf(DATE_SEPERATOR, seperator1+1);
    const seperator3 = value.indexOf(MIDDLE_SEPERATOR, seperator2+1);
    const seperator4 = value.indexOf(TIME_SEPERATOR, seperator3+1);
    if(seperator1===-1 || seperator2===-1 || seperator3===-1 || seperator4===-1) {
      return false;
    }

    let year = Number(value.substring(0, seperator1));
    let month = Number(value.substring(seperator1+1, seperator2));
    let day = Number(value.substring(seperator2+1, seperator3));
    let hour = value.substring(seperator3+1, seperator4);
    let minute = value.substring(seperator4+1);

    if(hour.trim()==='' || minute.trim()==='') return false;

    hour = Number(hour);
    minute = Number(minute);

    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) return false;

    if(year < 1300 || year > 1450) return false;

    if(month < 1 || month > 12) return false;
    
    if(day < 1 || day > 31) return false;

    if(month > 6 && day > 30) return false;
 
    if(month === 12 && day > 29 && !LeapYears.find(y => y === year)) return false;

    if(hour < 0 || hour >= 24) return false;

    if(minute < 0 || minute >= 60) return false;

    return true;
  };

  sanitizeValues = (values, sanitizeDay, sanitizeMonth, sanitizeYear, sanitizeHour, sanitizeMinute) => {
    const {value} = values;
    if(this.isValueEmpty(this.values.value)){
      //console.log('no sanitation')
      return null;
    }
    const seperator1 = value.indexOf(DATE_SEPERATOR);
    const seperator2 = value.indexOf(DATE_SEPERATOR, seperator1+1);
    const seperator3 = value.indexOf(MIDDLE_SEPERATOR, seperator2+1);
    const seperator4 = value.indexOf(TIME_SEPERATOR, seperator3+1);
    if(seperator1===-1 || seperator2===-1 || seperator3===-1 || seperator4===-1) {
      return this.resetValues();
    }

    let year = value.substring(0, seperator1);
    let month = value.substring(seperator1+1, seperator2);
    let day = value.substring(seperator2+1, seperator3);
    let hour = value.substring(seperator3+1, seperator4);
    let minute = value.substring(seperator4+1);

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
      const baseYear = '1397';
      year = year.trim();
      year = baseYear.substring(0, 4 - year.length) + year;
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
    const seperator1 = value.indexOf(DATE_SEPERATOR);
    const seperator2 = value.indexOf(DATE_SEPERATOR, seperator1+1);
    const seperator3 = value.indexOf(MIDDLE_SEPERATOR, seperator2+1);
    const seperator4 = value.indexOf(TIME_SEPERATOR, seperator3+1);
    if(seperator1===-1 || seperator2===-1 || seperator3===-1 || seperator4===-1) {
      return this.resetValues();
    }

    let year = value.substring(0, seperator1);
    let month = value.substring(seperator1+1, seperator2);
    let day = value.substring(seperator2+1, seperator3);
    let hour = value.substring(seperator3+1, seperator4);
    let minute = value.substring(seperator4+1);

    // console.log({value, year, month, day, hour, minute, seperator1, seperator2, seperator3, seperator4, selectionStart: values.selectionStart});

    let newStartPosition = values.selectionStart;
    let newDay = day;
    let newMonth = month;
    let newYear = year;
    let newHour = hour;
    let newMinute = minute;

    if(values.selectionStart<=seperator3 && values.selectionStart>seperator2){
      const inspected = this.inspectDay(day, values.selectionStart, seperator2, this.maxDayFor(newMonth));
      newStartPosition =  inspected.newStartPosition;
      newDay = inspected.newDay;
    }else if(values.selectionStart<=seperator2 && values.selectionStart>seperator1){
      const inspected = this.inspectMonth(month, values.selectionStart, seperator1);
      newStartPosition =  inspected.newStartPosition;
      newMonth = inspected.newMonth;
    }else if(values.selectionStart<=seperator1){
      const inspected = this.inspectYear(year, values.selectionStart);
      newStartPosition =  inspected.newStartPosition;
      newYear = inspected.newYear;
    }else if(values.selectionStart<=seperator4 && values.selectionStart>seperator3){
      const inspected = this.inspectHour(hour, values.selectionStart, seperator3);
      newStartPosition =  inspected.newStartPosition;
      newHour = inspected.newHour;
    }else if(values.selectionStart>seperator4){
      const inspected = this.inspectMinute(minute, values.selectionStart, seperator4);
      newStartPosition =  inspected.newStartPosition;
      newMinute = inspected.newMinute;
    }

    const newValue = `${newYear}${DATE_SEPERATOR}${newMonth}${DATE_SEPERATOR}${newDay}${MIDDLE_SEPERATOR}${newHour}${TIME_SEPERATOR}${newMinute}`;

    return {
      value: newValue,
      valueToShow: this.mapValue(newValue, this.props.numberFormat),
      selectionStart: newStartPosition,
      selectionEnd: newStartPosition,
    };
  };

  inspectDay = (day, selectionStart, seperator2, max) => {
    let newDay = day.trim() === '' ? day : day.replace(/ /g, '0');
    let newStartPosition = selectionStart;

    const caretPosition = selectionStart - seperator2 - 1;
    if(newDay.length>2){
      if(caretPosition<=2){
        newDay = newDay.substring(0, 2);
        newStartPosition = 8 + caretPosition;
      }else if(caretPosition>2){
        newDay = newDay.substring(caretPosition-2, caretPosition);
        newStartPosition = 10;
      }
    }
    if(newDay>max){
      if(caretPosition===0){
        newDay = '  ';
        newStartPosition = 10;
      }else{
        newDay = day.substring(caretPosition-1, caretPosition);
        newStartPosition = 9;
      }
    }

    return {newDay, newStartPosition};
  };

  inspectMonth = (month, selectionStart, seperator1) => {
    let newMonth = month.trim() === '' ? month : month.replace(/ /g, '0');
    let newStartPosition = selectionStart;
    const caretPosition = selectionStart - seperator1 - 1;
    if(newMonth.length>2){
      if(caretPosition<=2){
        newMonth = newMonth.substring(0, 2);
        newStartPosition = 5 + caretPosition;
      }else if(caretPosition>2){
        newMonth = newMonth.substring(caretPosition-2, caretPosition);
        newStartPosition = 7;
      }
    }
    if(newMonth>12){
      if(caretPosition===0){
        newMonth = '  ';
        newStartPosition = 7;
      }else{
        newMonth = month.substring(caretPosition-1, caretPosition);
        newStartPosition = 6;
      }
    }

    return {newMonth, newStartPosition};
  };

  inspectYear = (year, selectionStart) => {
    let newYear = year;
    let newStartPosition = selectionStart;
    const caretPosition = selectionStart;
    if(newYear.length>4){
      if(caretPosition<=4){
        newYear = newYear.substring(0, 4);
        newStartPosition = caretPosition;
      }else if(caretPosition>4){
        newYear = newYear.substring(caretPosition-4, caretPosition);
        newStartPosition = 4;
      }
    }

    return {newYear, newStartPosition};
  };

  inspectHour = (hour, selectionStart, seperator) => {
    let newHour = hour.trim() === '' ? hour : hour.replace(/ /g, '0');
    let newStartPosition = selectionStart;
    const caretPosition = selectionStart - seperator - 1;
    if(newHour.length>2){
      if(caretPosition<=2){
        newHour = newHour.substring(0, 2);
        newStartPosition = 11 + caretPosition;
      }else if(caretPosition>2){
        newHour = newHour.substring(caretPosition-2, caretPosition);
        newStartPosition = 13;
      }
    }
    if(newHour>23){
      if(caretPosition===0){
        newHour = '  ';
        newStartPosition = 13;
      }else{
        newHour = hour.substring(caretPosition-1, caretPosition);
        newStartPosition = 12;
      }
    }

    return {newHour, newStartPosition};
  };

  inspectMinute = (minute, selectionStart, seperator) => {
    let newMinute = minute.trim() === '' ? minute : minute.replace(/ /g, '0');
    let newStartPosition = selectionStart;
    const caretPosition = selectionStart - seperator - 1;
    if(newMinute.length>2){
      if(caretPosition<=2){
        newMinute = newMinute.substring(0, 2);
        newStartPosition = 14 + caretPosition;
      }else if(caretPosition>2){
        newMinute = newMinute.substring(caretPosition-2, caretPosition);
        newStartPosition = 16;
      }
    }
    if(newMinute>59){
      if(caretPosition===0){
        newMinute = '  ';
        newStartPosition = 16;
      }else{
        newMinute = minute.substring(caretPosition-1, caretPosition);
        newStartPosition = 15;
      }
    }

    return {newMinute, newStartPosition};
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
        const target = !this.values.valueIsValid ? {name: this.props.name, formatted: '', value: '', moment: null} : {
          name: this.props.name,
          value: this.values.iso,
          formatted: this.values.value,
          moment: this.values.moment,
        };
        this.props.onChange({target});
      }
    }
  };

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.value !== this.values.iso || nextProps.numberFormat !== this.props.numberFormat){
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
    const {value, onChange, onFocus, onBlur, onInput, onPast, onKeyDown, onShowDialog, pattern, inputMode, type, ref, numberFormat, ...rest} = this.props;
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


export function mapToFarsi(str) {
  if(!str) return `    ${DATE_SEPERATOR}  ${DATE_SEPERATOR}  ${MIDDLE_SEPERATOR}  ${TIME_SEPERATOR}  `;
  return str.toString().replace(/[1234567890]/gi, e => String.fromCharCode(e.charCodeAt(0) + 1728))
}

export function mapToLatin(str) {
  if(!str) return `    ${DATE_SEPERATOR}  ${DATE_SEPERATOR}  ${MIDDLE_SEPERATOR}  ${TIME_SEPERATOR}  `;
  return str.toString().replace(/[۱۲۳۴۵۶۷۸۹۰]/gi, e => String.fromCharCode(e.charCodeAt(0) - 1728))
}

import React, { Component } from 'react';
import shallowEqualObjects from 'shallow-equal/objects';
import moment from 'moment-jalaali';

export const NUMBER_FORMAT_FARSI = 'FARSI';
export const NUMBER_FORMAT_LATIN = 'LATIN';
const SEPERATOR =  '/';// this is arabic date seperator ' ؍' but it is right to left glyph and as the numbers are left to right there will be caret position problem
const LeapYears = [1387, 1391, 1395, 1399, 1403, 1408, 1412, 1416, 1383, 1379, 1375, 1370, 1366, 1362, 1358, 1354];

class DateInput extends Component {

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
      return moment(new Date(value));
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
    const value = valueIsValid ? moment.format('jYYYY/jMM/jDD') : '';
    const iso = valueIsValid ? moment.toISOString(): '';
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
    console.log('oh perfect ');
    this.updateState(this.resetValues());
  };

  handleFocus = (event) => {
    this.jumpToDay();
    if(this.props.onFocus){
      this.props.onFocus(event);
    }
  };

  handleBlur = (event) => {
    this.updateState(this.sanitizeValues(this.values, true, true, true));
    if(this.props.onBlur){
      this.props.onBlur(event);
    }
  };

  jumpToNext = () => {
    const selectionStart = this.inputRef.current.selectionStart;
    if(this.isCaretAtDay(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, true, false, false));
      this.jumpToMonth();
      return true;
    }else if(this.isCaretAtMonth(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, true, false));
      this.jumpToYear();
      return true;
    }else if(this.isCaretAtYear(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, false, true));
    }
    return false;
  };

  jumpToPrevious = () => {
    const selectionStart = this.inputRef.current.selectionStart;
    if(this.isCaretAtDay(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, true, false, false));
    }else if(this.isCaretAtMonth(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, true, false));
      this.jumpToDay();
      return true;
    }else if(this.isCaretAtYear(selectionStart)){
      this.updateState(this.sanitizeValues(this.values, false, false, true));
      this.jumpToMonth();
      return true;
    }
    return false;
  };

  jumpToDay = () => {
    this.inputRef.current.setSelectionRange(8, 10);
  };

  jumpToMonth = () => {
    this.inputRef.current.setSelectionRange(5, 7);
  };

  jumpToYear = () => {
    this.inputRef.current.setSelectionRange(0, 4);
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
    }else if(event.key==='.' || event.key==='/' || event.key==='-' 
             || 
             event.keyCode===188 || event.keyCode===189 || event.keyCode===190 || event.keyCode===191
             ){
      event.preventDefault();
      if(event.ctrlKey || event.shiftKey || event.metaKey){
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
    }else if((event.ctrlKey || event.metaKey) && (event.keyCode===67 || event.keyCode===86)){ //copy/paste
    }else if((event.ctrlKey || event.metaKey) && (event.keyCode===82)){ //refresh key
    }else if(event.keyCode===116){ // F5 refresh key
    }else if(event.keyCode===114){ // F4
      console.log('open dialog');
    }else if(event.keyCode===229){ //android bug workaround
    }else{
      // console.log('other');
      //console.log('keyCode: ', event.keyCode, 'key: ', event.key, 'ctrlKey: ', event.ctrlKey);
      // this.rr.current.innerText = `keyCode: ${event.keyCode} key:  ${event.key} ctrlKey: ${event.ctrlKey}`;
      event.preventDefault();
    }
  };

  handlePaste = (event) => {
    event.preventDefault();

    const enteredValue = stripAnyThingButDigits((event.clipboardData || window.clipboardData).getData('text'));

    this.updateState(this.updateValue(event.target, enteredValue, this.props.numberFormat));
  };

  handleInput = (event) => {
    if(this.values.valueToShow===event.target.value) return;

    const enteredValue = stripAnyThingButDigits(event.target.value);

    this.updateState(this.recheckValue(event.target, enteredValue, this.props.numberFormat));
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
        this.values.moment = moment(this.values.value, 'jYYYY/jMM/jDD');
        const date = this.values.moment.toDate();
        this.values.moment = moment(new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000));
        this.values.iso = this.values.moment.toISOString();
      }else{
        this.values.iso = '';
        this.values.moment = null;
      }
    }

    let fireOnChangeInTheEnd = false;
    console.log('values on updateState', this.values)
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
    const seperator1 = value.indexOf(SEPERATOR);
    const seperator2 = value.indexOf(SEPERATOR, seperator1+1);
    if(seperator1===-1 || seperator2===-1) {
      return false;
    }

    let year = Number(value.substring(0, seperator1));
    let month = Number(value.substring(seperator1+1, seperator2));
    let day = Number(value.substring(seperator2+1));

    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

    if(year < 1300 || year > 1450) return false;

    if(month <1 || month > 12) return false;
    
    if(day <1 || day > 31) return false;

    if(month > 6 && day > 30) return false;
 
    if(month === 12 && day > 29 && !LeapYears.find(y => y === year)) return false;

    return true;
  };

  sanitizeValues = (values, sanitizeDay, sanitizeMonth, sanitizeYear) => {
    const {value} = values;
    const seperator1 = value.indexOf(SEPERATOR);
    const seperator2 = value.indexOf(SEPERATOR, seperator1+1);
    if(seperator1===-1 || seperator2===-1) {
      return this.resetValues();
    }

    let year = value.substring(0, seperator1);
    let month = value.substring(seperator1+1, seperator2);
    let day = value.substring(seperator2+1);

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

    const newValue = `${year}${SEPERATOR}${month}${SEPERATOR}${day}`;

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
    const seperator1 = value.indexOf(SEPERATOR);
    const seperator2 = value.indexOf(SEPERATOR, seperator1+1);
    if(seperator1===-1 || seperator2===-1) {
      return this.resetValues();
    }

    let year = value.substring(0, seperator1);
    let month = value.substring(seperator1+1, seperator2);
    let day = value.substring(seperator2+1);

    //console.log({value, year, month, day, seperator1, seperator2, selectionStart: values.selectionStart});

    let newStartPosition = values.selectionStart;
    let newDay = day;
    let newMonth = month;
    let newYear = year;

    if(values.selectionStart>seperator2){
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
    }

    const newValue = `${newYear}${SEPERATOR}${newMonth}${SEPERATOR}${newDay}`;

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
    let newYear = year.trim() === '' ? year : year.replace(/ /g, '0');
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

  resetValues = () => {
    const value = '';
    return {
      value,
      valueToShow: this.mapValue(value, this.props.numberFormat),
      selectionStart: 8,
      selectionEnd: 10,
    };
  };

  recheckValue = (element, enteredValue, numberFormat) => {
    let valueToShow = this.mapValue(enteredValue, numberFormat);
    let selectionStart = element.selectionStart;
    let selectionEnd = element.selectionEnd;

    const value = mapToLatin(valueToShow);

    return {
      value,
      valueToShow,
      selectionStart,
      selectionEnd,
    };
  };

  deleteValue = (element, qty) => {
    let valueToShow = element.value;
    let selectionStart = element.selectionStart;
    let selectionEnd = element.selectionEnd;

    // console.log({selectionStart, selectionEnd})

    if(selectionStart===selectionEnd){
      if(qty < 0) {
        if(selectionStart===0) return;
        valueToShow = valueToShow.substring(0, selectionStart + qty) + valueToShow.substring(selectionEnd);
        selectionStart += qty;
      }else{
        if(selectionEnd===valueToShow.length) return;
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
    const {value, onChange, onFocus, onBlur, onInput, onPast, onKeyDown, pattern, inputMode, type, ref, numberFormat, ...rest} = this.props;
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
  if(!str) return `    ${SEPERATOR}  ${SEPERATOR}  `;
  return str.toString().replace(/[1234567890]/gi, e => String.fromCharCode(e.charCodeAt(0) + 1728))
}

export function mapToLatin(str) {
  if(!str) return `    ${SEPERATOR}  ${SEPERATOR}  `;
  return str.toString().replace(/[۱۲۳۴۵۶۷۸۹۰]/gi, e => String.fromCharCode(e.charCodeAt(0) - 1728))
}

export function stripAnyThingButDigits(str) {
  if(!str) return str;
  return str.toString().replace(/[^1234567890۱۲۳۴۵۶۷۸۹۰]/gi, '');
}

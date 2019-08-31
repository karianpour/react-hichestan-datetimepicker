import jalaali from 'jalaali-js';

export const NUMBER_FORMAT_FARSI = 'FARSI';
export const NUMBER_FORMAT_LATIN = 'LATIN';

export const DATE_SEPERATOR =  '/';// this is arabic date seperator ' ؍' but it is right to left glyph and as the numbers are left to right there will be caret position problem
export const MIDDLE_SEPERATOR =  '\xa0';
export const TIME_SEPERATOR =  ':';
export const SEPERATORES_REGEX = new RegExp(`[ ${DATE_SEPERATOR}]`, 'g');

export function isNotEqualDate(m1, m2) {
  if((m1 && !m2) || (!m1 && m2) || (m1 && m2 && !isTheSameDay(m1, m2))){
    return true;
  }
  return false;
}

export function isTheSameDay(date1, date2){
  if(
    date1.getFullYear()===date2.getFullYear() &&
    date1.getMonth()===date2.getMonth() &&
    date1.getDate()===date2.getDate()
  ){
    return true;
  }
  return false;
}

export function mapToFarsi(str) {
  if(!str && str!==0 && str!=='0') return str;
  return str.toString().replace(/[1234567890]/gi, e => String.fromCharCode(e.charCodeAt(0) + 1728))
}

export function mapToLatin(str) {
  if(!str) return str;
  return str.toString().replace(/[۱۲۳۴۵۶۷۸۹۰]/gi, e => String.fromCharCode(e.charCodeAt(0) - 1728))
}

export function stripAnyThingButDigits(str) {
  if(!str) return str;
  return str.toString().replace(/[^1234567890۱۲۳۴۵۶۷۸۹۰]/gi, '');
}

export function inspectDay (day, selectionStart, seperatorPosition, max) {
  let newDay = day.trim() === '' ? day : day.replace(/ /g, '0');
  let newStartPosition = selectionStart;

  const caretPosition = selectionStart - seperatorPosition - 1;
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
}

export function inspectMonth (month, selectionStart, seperatorPosition) {
  let newMonth = month.trim() === '' ? month : month.replace(/ /g, '0');
  let newStartPosition = selectionStart;
  const caretPosition = selectionStart - seperatorPosition - 1;
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
}

export function inspectYear (year, selectionStart) {
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
}


export function inspectHour (hour, selectionStart, seperatorPosition) {
  let newHour = hour.trim() === '' ? hour : hour.replace(/ /g, '0');
  let newStartPosition = selectionStart;
  const caretPosition = selectionStart - seperatorPosition - 1;
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

export function inspectMinute (minute, selectionStart, seperatorPosition) {
  let newMinute = minute.trim() === '' ? minute : minute.replace(/ /g, '0');
  let newStartPosition = selectionStart;
  const caretPosition = selectionStart - seperatorPosition - 1;
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
}

export function readDateFromValue (value) {
  if(!value) return '';
  if (typeof value === 'string') {
    value = mapToLatin(value);
    let v = new Date(value);
    if(v.toString() === 'Invalid Date') {
      let d = isValueValidDateTime(value, true);
      if(d){
        v = d;
      }else{
        d = isValueValidDate(value, true);
        if(d){
          v = d;
        }
      }
    }
    if(v.getFullYear() < 1700){
      let d = isValueValidDateTime(value, false);
      if(d){
        v = d;
      }else{
        d = isValueValidDate(value, false);
        if(d){
          v = d;
        }
      }
    }
    let j = jalaali.toJalaali(v);
    return { j, value: v };
  }else if (value instanceof Date) {
    if(value.toString() === 'Invalid Date') return '';
    const j = jalaali.toJalaali(value);
    return { j, value };
  }else{
    console.warn('unknown value type ', value)
  }
  return '';
}

export function hasStringACharToGoToNext (str) {
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
}

export function maxDayFor (year, month, gregorian) {
  if(!month) return 31;
  if(!year) return 31;
  month = Number(month);
  year = Number(year);

  if(!gregorian){
    return jalaali.jalaaliMonthLength(year, month);
  }else{
    return gregorianMonthLength(year, month);
  }
}


const jalaaliBaseYear = jalaali.toJalaali(new Date()).jy.toString();
const gregorianBaseYear = (new Date()).getFullYear().toString();
export function baseYear (gregorian) {
  return gregorian ? gregorianBaseYear : jalaaliBaseYear;
}

export function formatJalaali(j){
  if(j instanceof Date){
    j = jalaali.toJalaali(j);
  }
  return constructdate(j.jy, j.jm, j.jd, '/');
}

export function formatGregorian(g){
  return constructdate(g.getFullYear(), g.getMonth() + 1, g.getDate(), '/');
}

export function formatTime(date){
  const seperator = ':';
  let _minutes = date.getMinutes().toString();
	_minutes = '00'.substring(0, 2 - _minutes.length) + _minutes;
	let _hours = date.getHours().toString();
	_hours = '00'.substring(0, 2 - _hours.length) + _hours;
	return _hours + seperator + _minutes;
}

export function constructdate (_year, _month, _day, seperator) {
	let _yeary, _monthm, _dayd;

  _dayd = _day.toString();
	_dayd = '00'.substring(0, 2 - _dayd.length) + _dayd;
	_monthm = _month.toString();
	_monthm = '00'.substring(0, 2 - _monthm.length) + _monthm;
	_yeary = _year.toString();
	_yeary = '0000'.substring(0, 4 - _yeary.length) + _yeary;
	return _yeary + seperator + _monthm + seperator + _dayd;
}

export const isValueValidDate = (value, gregorian) => {
  if(!value) return false;
  const splittedValue = splitDateValue(value);
  if(splittedValue==='' || !splittedValue) {
    return false;
  }

  let {year, month, day} = splittedValue;
  year = Number(year);
  month = Number(month);
  day = Number(day);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;

  if(!gregorian && (year < 1300 || year > 1450)) return false;

  if(gregorian && (year < 1800 || year > 2150)) return false;

  if(month < 1 || month > 12) return false;
  
  if(day < 1 || day > 31) return false;

  if(day > maxDayFor(year, month, gregorian)) return false;

  if(gregorian){
    const date = new Date(year, month - 1, day, 0, 0);
    if(date.toString() === 'Invalid Date'){
      return false;
    }
    return date;
  }else{
    if(!jalaali.isValidJalaaliDate(year, month, day)) return false;
    const g = jalaali.toGregorian(year, month, day);
    const date = new Date(g.gy, g.gm - 1, g.gd, 0, 0);
    return date;
  }
};

export const isValueValidDateTime = (value, gregorian) => {
  if(!value) return false;
  const splittedValue = splitDateTimeValue(value);
  if(splittedValue==='' || !splittedValue) {
    return false;
  }

  let {year, month, day, hour, minute} = splittedValue;
  if(hour.trim()==='' || minute.trim()==='') return false;

  year = Number(year);
  month = Number(month);
  day = Number(day);
  hour = Number(hour);
  minute = Number(minute);

  if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) return false;

  if(!gregorian && (year < 1300 || year > 1450)) return false;

  if(gregorian && (year < 1800 || year > 2150)) return false;

  if(month < 1 || month > 12) return false;
  
  if(day < 1 || day > 31) return false;

  if(day > maxDayFor(year, month, gregorian)) return false;

  if(hour < 0 || hour >= 24) return false;

  if(minute < 0 || minute >= 60) return false;

  if(gregorian){
    const date = new Date(year, month - 1, day, hour, minute);
    if(date.toString() === 'Invalid Date'){
      return false;
    }
    return date;
  }else{
    if(!jalaali.isValidJalaaliDate(year, month, day)) return false;
    const g = jalaali.toGregorian(year, month, day);
    const date = new Date(g.gy, g.gm - 1, g.gd, hour, minute);
    return date;
  }
};

export const isValueEmpty = (value) => {
  if(value.replace(SEPERATORES_REGEX, '')==='') return true;
  return false;
}; 

export const splitDateValue = (value) => {
  if(isValueEmpty(value)){
    return '';
  }
  const seperator1 = value.indexOf(DATE_SEPERATOR);
  const seperator2 = value.indexOf(DATE_SEPERATOR, seperator1+1);
  if(seperator1===-1 || seperator2===-1) {
    return null;
  }

  const year = value.substring(0, seperator1);
  const month = value.substring(seperator1+1, seperator2);
  const day = value.substring(seperator2+1);
  return {
    year, month, day, seperator1, seperator2
  };
};

export const splitDateTimeValue = (value) => {
  if(isValueEmpty(value)){
    return '';
  }
  const seperator1 = value.indexOf(DATE_SEPERATOR);
  const seperator2 = value.indexOf(DATE_SEPERATOR, seperator1+1);
  const seperator3 = value.indexOf(MIDDLE_SEPERATOR, seperator2+1);
  const seperator4 = value.indexOf(TIME_SEPERATOR, seperator3+1);
  if(seperator1===-1 || seperator2===-1 || seperator3===-1 || seperator4===-1) {
    return null;
  }

  const year = value.substring(0, seperator1);
  const month = value.substring(seperator1+1, seperator2);
  const day = value.substring(seperator2+1, seperator3);
  const hour = value.substring(seperator3+1, seperator4);
  const minute = value.substring(seperator4+1);

  return {
    year, month, day, hour, minute, seperator1, seperator2, seperator3, seperator4
  };
};

export function calcFirstDayOfMonth(year, month, gregorian){
  year = +year;
  month = +month;
  let fistDayDate;
  if(gregorian){
    fistDayDate = new Date(year, month - 1, 1);
  }else{
    const firstDayJ = jalaali.toGregorian(year, month, 1);
    fistDayDate = new Date(firstDayJ.gy, firstDayJ.gm - 1, firstDayJ.gd);
  }
  return (fistDayDate.getDay() + 1) % 7;
}

export function gregorianMonthLength(year, month){
  return (new Date(year, month, 0)).getDate();
}
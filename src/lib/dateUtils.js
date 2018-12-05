import moment from 'moment-jalaali';

export function isEqualMoment(m1, m2) {
  return !!((!m1 && !m2) || (m1 && m2
    && (m1.jYear() === m2.jYear())
    && (m1.jMonth() === m2.jMonth())
    && (m1.jDate() === m2.jDate())
    && (m1.hour() === m2.hour())
    && (m1.minute() === m2.minute())
    && (m1.second() === m2.second())
  ));
}

export function isEqualDateTime(m1, m2) {
  return !!((!m1 && !m2) || (m1 && m2
    && (m1 === m2)
  ));
}

export function isEqualTime(m1, m2) {
  return !!((!m1 && !m2) || (m1 && m2
    && (m1 === m2)
  ));
}

export function isEqualDate(m1, m2) {
  return !!((!m1 && !m2) || (m1 && m2
    && (m1 === m2)
  ));
}

export function mapToFarsi(str) {
  if(!str) return str;
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

export function readDateFromValue (value, DATE_FORMAT) {
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

export const LeapYears = [1387, 1391, 1395, 1399, 1403, 1408, 1412, 1416, 1383, 1379, 1375, 1370, 1366, 1362, 1358, 1354];


export function maxDayFor (month, year) {
  if(!month) return 31;
  month = Number(month);
  if(month < 7) return 31;
  if(month > 7 && month < 12) return 30;
  if(!year) return 30;
  year = Number(year);
  if(month === 12 && LeapYears.find(y => y===year)) return 30;
  return 29;
}

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

//console.log(stripAnyThingButDigits('4523245dfkjgahdfg54y۸ثف۷خث۸قفصث۵۶۷۴۷۸'))

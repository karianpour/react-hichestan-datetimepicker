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

const mapDigit = {
  1: "۱",
  2: "۲",
  3: "۳",
  4: "۴",
  5: "۵",
  6: "۶",
  7: "۷",
  8: "۸",
  9: "۹",
  0: "۰"
};

export function mapToFarsi(str) {
  return str.toString().replace(/1|2|3|4|5|6|7|8|9|0/gi, function(e) { return mapDigit[e] })
}

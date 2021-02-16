import * as React from 'react';
import { DateTimeEventType, NumberFormat } from './utils';

export type DateTimeInputSimpleProps = {
  inputRef: any,
  numberFormat: NumberFormat,
  disabled: boolean,
  readOnly: boolean,
  onShowDialog: ()=>void,
  gregorian: boolean,
  value: string | Date,
  onChange: ((event: DateTimeEventType) => void) | undefined,
} & React.ComponentProps<"input">;

declare const DateTimeInputSimple: React.Component<DateTimeInputSimpleProps>;
export default DateTimeInputSimple;

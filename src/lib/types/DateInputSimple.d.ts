import * as React from 'react';
import { DateTimeEventType, NumberFormat } from './utils';

export type DateInputSimpleProps = {
  inputRef: any,
  numberFormat: NumberFormat,
  disabled: boolean,
  readOnly: boolean,
  onShowDialog: ()=>void,
  gregorian: boolean,
  value: string | Date,
  onChange: ((event: DateTimeEventType) => void) | undefined,
} & React.ComponentProps<"input">;

declare const DateInputSimple: React.Component<DateInputSimpleProps>;
export default DateInputSimple;

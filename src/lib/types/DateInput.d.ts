import * as React from 'react';
import CSS from 'csstype';
import { DateTimeEventType, NumberFormat } from './utils';



export type DateInputProps = {
  numberFormat: NumberFormat,
  autoOk: boolean,
  closeLabel: React.ReactNode,
  dialogContainerStyle: CSS.Properties,
  dialogContainerClassName: string,
  disabled: boolean,
  readOnly: boolean,
  onDismiss: ()=>void,
  onShow: ()=>void,
  filterDate: (date: Date)=>boolean,
  gregorian: boolean,
  ltr: boolean,
  autoPop: boolean,

  onShowDialog: ()=>void,
  value: string | Date,
  onChange: ((event: DateTimeEventType) => void) | undefined,
} & React.ComponentProps<"input">;


declare const DateInput: React.Component<DateInputProps>;
export default DateInput;

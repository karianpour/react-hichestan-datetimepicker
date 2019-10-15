import React, { Component } from 'react';
import {} from './lib';
import {DateTimeInput, DateTimeInputSimple, DateInput, DateInputSimple} from './lib';

class Example extends Component {
  state = {
    value1: '',
    value1_formatted: '',
    value2: '',
    value2_formatted: '',
    value3: '',
    value3_formatted: '',
    value4: '',
    value4_formatted: '',
    gregorian: false,
    disabled: false,
    readOnly: false,
  };

  handleChange = (event) => {
    const newState = {};
    const t = event.target;
    console.log('target change on the example page : ', t);
    newState[t.name] = t.value;
    newState[t.name+'_formatted'] = t.formatted ? t.formatted : '';
    this.setState(newState, ()=>{
      console.log('after', this.state)
    });
  };

  toggleGregorian = () => {
    this.setState({gregorian: !this.state.gregorian});
  };

  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    })
  };

  toggleReadOnly = () => {
    this.setState({
      readOnly: !this.state.readOnly,
    })
  };

  render(){

    const { gregorian, disabled, readOnly } = this.state;

    return (
      <React.Fragment>
        <div style={{width: 250}}>
        <label>ورودی تاریخ با پاپ‌آپ
            <br/>
            <DateInput
              value={this.state.value1}
              defaultValue={undefined}
              name={'value1'}
              gregorian={gregorian}
              disabled={disabled}
              readOnly={readOnly}
              autoOk
              onChange={this.handleChange}
              style={{textAlign: 'right'}}
              placeholder="فیلد تاریخ فقط تایپی" />
            <br/>
            خروجی
            <br/>
            <input type="text" dir={'ltr'} value={this.state.value1} readOnly/>
            <br/>
            <input type="text" dir={'ltr'} value={this.state.value1_formatted} readOnly/>
          </label>
          <br/>
          <br/>
          <label>ورودی تاریخ بدون پاپ‌آپ
            <br/>
            <DateInputSimple
              value={this.state.value2}
              name={'value2'}
              gregorian={gregorian}
              disabled={disabled}
              readOnly={readOnly}
              onChange={this.handleChange}
              placeholder="فیلد تاریخ فقط تایپی" />
            <br/>
            خروجی
            <br/>
            <input type="text" dir={'ltr'}  value={this.state.value2} readOnly/>
            <br/>
            <input type="text" dir={'ltr'}  value={this.state.value2_formatted} readOnly/>
          </label>
          <br/>
          <br/>
          <br/>
          <label>
            ورود زمان با پاپ‌آپ
            <br/>
            <DateTimeInput
              value={this.state.value3}
              name={'value3'}
              gregorian={gregorian}
              disabled={disabled}
              readOnly={readOnly}
              onChange={this.handleChange}
              placeholder="فیلد تاریخ فقط تایپی" />
            <br/>
            خروجی
            <br/>
            <input type="text" dir={'ltr'}  value={this.state.value3} readOnly/>
            <br/>
            <input type="text" dir={'ltr'}  value={this.state.value3_formatted} readOnly/>
          </label>
          <br/>
          <br/>
          <label>
            ورود زمان بدون پاپ‌آپ
            <br/>
            <DateTimeInputSimple
              value={this.state.value4}
              name={'value4'}
              gregorian={gregorian}
              disabled={disabled}
              readOnly={readOnly}
              onChange={this.handleChange}/>
            <br/>
            خروجی
            <br/>
            <input type="text" dir={'ltr'}  value={this.state.value4} readOnly/>
            <br/>
            <input type="text" dir={'ltr'}  value={this.state.value4_formatted} readOnly/>
          </label>
          <br/>
          <br/>
          <button type="button" onClick={this.toggleDisabled}>{disabled?'enable':'disable'}</button>
          <button type="button" onClick={this.toggleReadOnly}>{readOnly?'writable':'read only'}</button>
          <button type="button" onClick={this.toggleGregorian}>{gregorian ? 'شمسی' : 'میلادی'}</button>
          <p style={{height: 1000}}>
          <br/>
          خروجی زمان استاندارد را در دیتابیس استفاده کنید
          </p>
          <br/>
        </div>
      </React.Fragment>
    );
  }
}

export default Example;

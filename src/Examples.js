import React, { Component } from 'react';
import {DateTimeInput} from './lib';
import {DateInput, DateInputWithDialog} from './lib';

class Example extends Component {
  state = {
    value1: '2018-12-04T00:00:00Z',
    value1_formatted: '',
    value2: '',
    value2_formatted: '',
    date_sample_1: undefined,
    date_sample_2: '2018-08-23T04:57:12Z',
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

  render(){
    return (
      <React.Fragment>
        <div style={{width: 250}}>
          <label>ورودی تاریخ بدون پاپ‌آپ
            <br/>
            <DateInput
              value={this.state.value1}
              name={'value1'}
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
          <label>ورودی تاریخ با پاپ‌آپ
            <br/>
            <DateInputWithDialog
              value={this.state.value2}
              name={'value2'}
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
            نمونه ۱
            <br/>
            <DateTimeInput
              value={this.state.date_sample_1}
              name={'date_sample_1'}
              onChange={this.handleChange}/>
            <br/>
            خروجی زمان استاندارد. این را در دیتابیس استفاده کنید
            <br/>
            <input type="text" dir={'ltr'}  value={this.state.date_sample_1} readOnly/>
            <br/>
            <input type="text" dir={'ltr'}  value={this.state.date_sample_1_formatted} readOnly/>
          </label>
        </div>
        <br/>
        <div>
          <label>
            نمونه ۲
            <br/>
            <DateTimeInput
              value={this.state.date_sample_2}
              name={'date_sample_2'}
              onChange={this.handleChange}/>
            <br/>
            خروجی زمان استاندارد. این را در دیتابیس استفاده کنید
            <br/>
            <input type="text" dir={'ltr'}  value={this.state.date_sample_2} readOnly/>
            <br/>
            <input type="text" dir={'ltr'}  value={this.state.date_sample_2_formatted} readOnly/>
          </label>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
      </React.Fragment>
    );
  }
}

export default Example;

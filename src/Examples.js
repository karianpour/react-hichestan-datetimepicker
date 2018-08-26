import React, { Component } from 'react';
import {DateTimeInput} from './lib';

class Example extends Component {
  state = {
    value: '',
    value2: '',
    date_sample_1: undefined,
    date_sample_2: '2018-08-23T04:57:12Z',
  };

  handleChange = (event) => {
    const newState = {};
    const t = event.target;
    console.log(t.formatted);
    newState[t.name] = t.value;
    newState.value = t.value ? t.value : '';
    newState.value2 = t.formatted && t.formatted.formatted ? t.formatted.formatted : '';
    this.setState(newState, ()=>{
      console.log('after', this.state)
    });
  };

  render(){
    return (
      <React.Fragment>
        <div>
          <br/>
          <br/>
          <br/>
          <label>خروجی زمان استاندارد. این را در دیتا استفاده کنید
            <br/>
            <input type="text" dir={'ltr'} style={{width: 250}} value={this.state.value} placeholder="از اینجا کلید تب را چند بار بزنید" />
          </label>
          <br/>
          <br/>
          <label>
            نمونه ۱
            <br/>
            <DateTimeInput
              value={this.state.date_sample_1}
              name={'date_sample_1'}
              onChange={this.handleChange}/>
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
          </label>
        </div>
        <br/>
        <br/>
        <label>خروجی تاریخ شمسی
          <br/>
          <input type="text" dir={'ltr'} style={{width: 250}} value={this.state.value2} placeholder="این فیلد آخر است" />
        </label>
      </React.Fragment>
    );
  }
}

export default Example;

import React, { Component } from 'react';
import { DateTimeInput, DateTimeInputSimple, DateInput, DateInputSimple } from './lib';
import './lib/Theme/ocean.css';

class Example extends Component {
  state = {
    value1: '2018-08-23T06:57:12+03:00',
    value1_formatted: '',
    value2: '2018-08-23T06:57:12+03:00',
    value2_formatted: '',
    value3: '2018-08-23T06:57:12+03:00',
    value3_formatted: '',
    value4: '2018-08-23T06:57:12+03:00',
    value4_formatted: '',
    gregorian: true,
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

  handleThemeChange = (themeName) => {
    this.setState({
      currentTheme: themeName
    })
  }
  render(){
    console.log(this.state)
    const { gregorian } = this.state;

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
              onChange={this.handleChange}
              style={{textAlign: 'right'}}
              className={this.state.currentTheme}
              placeholder="فیلد تاریخ فقط تایپی" />
            <br/>
            خروجی
            <br/>
            <input type="text" dir={'ltr'} value={this.state.value1} readOnly/>
            <br/>
            <input type="text" dir={'ltr'} value={this.state.value1_formatted} readOnly/>
            <br/>
            <div style={{}}>
              <button 
                onClick={()=>this.handleThemeChange("ocean")}
                style={{
                  border: "none",
                  borderRadius: 4,
                  background: "#5d88d0",
                  color: "#fff",
                  padding: 10,
                  margin: 5
                }}
              >
                Ocean
              </button>
              <button 
                onClick={()=>this.handleThemeChange("undefined")}
                style={{
                  border: "none",
                  borderRadius: 4,
                  padding: 10,
                  margin: 5
                }}
              >
                Default
              </button>
            </div>
          </label>
          <br/>
          <br/>
          <label>ورودی تاریخ بدون پاپ‌آپ
            <br/>
            <DateInputSimple
              value={this.state.value2}
              name={'value2'}
              gregorian={gregorian}
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
              onChange={this.handleChange}/>
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
          <button onClick={this.toggleGregorian}>{gregorian ? 'شمسی' : 'میلادی'}</button>
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

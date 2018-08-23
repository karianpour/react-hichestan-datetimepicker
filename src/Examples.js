import React, { Component } from 'react';
import DateTimeInput from './lib/DateTimeInput';

class Example extends Component {
  state = {
    date_sample_1: undefined,
    date_sample_2: '2018-08-23T04:57:12Z',
  };

  handleChange = (event) => {
    const newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState, ()=>{
      console.log('after', this.state)
    });
  };

  render(){
    return (
      <React.Fragment>
        <div>
          <label>
            نمونه ۱
            <DateTimeInput
              value={this.state.date_sample_1}
              name={'date_sample_1'}
              onChange={this.handleChange}/>
          </label>
        </div>
        <div>
          <label>
            نمونه ۲
            <DateTimeInput
              style={{width:200}}
              value={this.state.date_sample_2}
              name={'date_sample_2'}
              onChange={this.handleChange}/>
          </label>
        </div>
      </React.Fragment>
    );
  }
}

export default Example;

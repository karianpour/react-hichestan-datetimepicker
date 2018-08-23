import React, { Component } from 'react';
import {DateTimeInput} from './lib';

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
      </React.Fragment>
    );
  }
}

export default Example;

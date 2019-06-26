import React from 'react';
import {mapToFarsi} from '../dateUtils';
import jalaali from 'jalaali-js';

const jalaaliYearArray = [], gregorianYearArray = [];
{
  const now = new Date();
  const j = jalaali.toJalaali(now);
  let n = j.jy+20;
  for(let i = 1370; i<n; i++){
    jalaaliYearArray.push({year: i, yearString: mapToFarsi(i)});
  }

  n = now.getFullYear() + 20;
  for(let i = 1980; i<n; i++){
    gregorianYearArray.push({year: i, yearString: mapToFarsi(i)});
  }
}

class Years extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  nextYear = (e) => {
    e.preventDefault();
    this.props.changeEvent(this.props.year + 1);
  };

  prevYear = (e) => {
    e.preventDefault();
    this.props.changeEvent(this.props.year - 1);
  };

  nextDecade = (e) => {
    e.preventDefault();
    this.props.changeEvent(this.props.year + 10);
  };

  prevDecade = (e) => {
    e.preventDefault();
    this.props.changeEvent(this.props.year - 10);
  };

  render() {
    const { year } = this.props;
    const yearString = mapToFarsi(year);
    return (
      <div className="JC-Section">
        <div className="JC-Nav" onClick={this.prevDecade}>&#9654;&#9654;</div>
        <div className="JC-Nav" onClick={this.prevYear}>&#9654;</div>
        <span className="JC-Title">{yearString}</span>
        <div className="JC-Nav" onClick={this.nextYear}>&#9664;</div>
        <div className="JC-Nav" onClick={this.nextDecade}>&#9664;&#9664;</div>
      </div>
    )
  }
}

export default Years;

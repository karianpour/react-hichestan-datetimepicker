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
      editable: false,
    }
  }

  yearChanged = (e) => {
    if(e && e.preventDefault()) e.preventDefault();
    const {year} = this.refs;
    const {changeEvent} = this.props;

    this.setState({editable: false, error: ''});
    if (!!changeEvent) changeEvent(parseInt(year.value, 10));
  };

  renderYearEditor = (year) => {
    const yearArray = this.props.gregorian ? gregorianYearArray : jalaaliYearArray;
    return (
      <select className="JC-YearInput" ref="year" onChange={this.yearChanged}
              value={year}
      >
        {yearArray.map(i => <option key={i.year} value={i.year}>{i.yearString}</option>)}
      </select>
    );
  };

  render() {
    const { editable } = this.state;
    const { year } = this.props;
    const yearString = mapToFarsi(year);
    return (
      <div className="JC-Section">
        {!editable && <span className="JC-Title" onClick={() => this.setState({editable: true})}>{yearString}</span>}
        {editable && this.renderYearEditor(year)}
        {editable && <div className={'OutSideClick'} onClick={this.yearChanged}> </div>}
      </div>
    )
  }
}

export default Years;

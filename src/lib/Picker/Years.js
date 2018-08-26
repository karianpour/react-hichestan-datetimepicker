import React from 'react';
import {mapToFarsi} from '../dateUtils';
import moment from 'moment-jalaali';

const yearArray = [];
{
  const m = moment();
  for(let i = 1370; i<m.jYear()+20; i++){
    yearArray.push({year: i, yearString: mapToFarsi(i)});
  }
}

class Years extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      year: this.props.year,
    }
  }

  yearChanged = (e) => {
    if(e && e.preventDefault()) e.preventDefault();
    const {year} = this.refs;
    const {changeEvent} = this.props;
    this.setState({
      year: year.value,
    });

    if (year.value.length === 4 && year.value > 1300 && year.value < 1500) {
      this.setState({editable: false, error: ''});
      if (!!changeEvent) changeEvent(parseInt(year.value, 10));
    }
  };

  componentWillReceiveProps(nextprops) {
    this.setState({year: nextprops.year})
  }

  renderYearEditor = (year) => {
    return (
      <select className="JC-YearInput" ref="year" onChange={this.yearChanged}
              value={year}>
        {yearArray.map(i => <option key={i.year} value={i.year}>{i.yearString}</option>)}
      </select>
    );
  };

  render() {
    const {year, editable} = this.state;
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

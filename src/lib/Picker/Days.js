import React from 'react';
import { mapToFarsi } from '../dateUtils';
import jalaali from 'jalaali-js';

class Days extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDay: this.props.selectedDay,
    };
    const now = new Date();
    this.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  dayClicked(element, e) {
    if(e){
      e.preventDefault();
    }
    if (!!this.state.selectedDay) {
      const selectedRef = this.state.selectedDay.getTime().toString();
      if(!!this.refs[selectedRef]){
        this.refs[selectedRef].className = this.refs[selectedRef].className.replace('selected', '');
      }
    }
    this.setState({selectedDay: element}, ()=>{
      this.refs[element.getTime().toString()].className += ' selected';
      this.props.clickEvent(element);
    });
  }

  isDateEnabled = (date) => {
    if(this.props.filterDate){
      return this.props.filterDate(date)
    }
    return true;
  };

  renderDays() {
    let { gregorian, firstDay, selectedYear, currentMonth, selectedDay, daysCount } = this.props;
    let year = selectedYear;
    let month = currentMonth;

    const result = [];
    for (let i = 1; i <= daysCount; i++) {
      let addedClass = '';
      let marginRight = '0%';
      let number = mapToFarsi(i);
      if (i === 1) marginRight = (firstDay * 14.28) + '%';

      let date;
      if(gregorian){
        date = new Date(year, month - 1, i);
      }else{
        const g = jalaali.toGregorian(year, month, i);
        date = new Date(g.gy, g.gm - 1, g.gd);
      }

      // console.log(this.today, date)

      if (this.today && date.getTime() === this.today.getTime()) addedClass += ' today';
      if (selectedDay && date.getTime() === selectedDay.getTime()) addedClass += ' selected';

      const enable = this.isDateEnabled(date);

      if (!enable) {
        result.push(<div className={'day-items' + addedClass}
                         ref={date.getTime().toString()} key={date.getTime().toString()}
                         style={{background: '#ccc', cursor: 'default', marginRight: marginRight}}
        >{number}</div>);
      } else if (enable) {
        result.push(<div className={'day-items' + addedClass}
                         ref={date.getTime().toString()} key={date.getTime().toString()}
                         style={{marginRight: marginRight}}
                         onClick={(e) => this.dayClicked(date, e)}
        >{number}</div>);
      }
    }
    return result;
  }

  render() {
    return (
      <div className="JC-days">
        <div className="holder">
          {!!this.props.daysCount && this.renderDays()}
        </div>
      </div>
    )
  }
}

export default Days;

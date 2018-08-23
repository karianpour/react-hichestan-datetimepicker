import React from 'react';
import {isEqualDate, mapToFarsi} from '../../dateUtils';

class Days extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDay: this.props.selectedDay,
      daysCount: this.props.daysCount,
      selectedYear: this.props.selectedYear,
      last_props_value: this.props.selectedDay,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.last_props_value !== nextProps.selectedDay) {
      if (!isEqualDate(prevState.selectedDay, nextProps.selectedDay)) {
        console.log('Days Received Props', prevState.selectedDay, nextProps.selectedDay);
        return {
          daysCount: nextProps.daysCount,
          selectedYear: nextProps.selectedYear,
          selectedDay: nextProps.selectedDay,
          last_props_value: nextProps.selectedDay,
        };
      }else{
        return {
          last_props_value: nextProps.selectedDay,
        };
      }
    }

    return null;
  }

  dayClicked(element) {
    if (!!this.state.selectedDay && !!this.refs[this.state.selectedDay]) {
      this.refs[this.state.selectedDay].className = this.refs[this.state.selectedDay].className.replace('selected', '');
    }
    this.setState({selectedDay: element}, ()=>{
      this.refs[element].className += ' selected';
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
    let {firstDay, currentMonth, selectedDay} = this.props;
    let {daysCount, selectedYear} = this.state;
    let year = selectedYear.toString();
    let month = currentMonth.toString();
    if (month.length === 1) month = '0' + month;

    const result = [];
    for (let i = 1; daysCount >= i; i++) {
      let addedClass = '';
      let marginRight = '0%';
      let number = mapToFarsi(i);
      if (i === 1) marginRight = (firstDay * 14.28) + '%';

      const date = year +'/'+ month +'/'+ (i < 10?'0':'') + i.toString();

      if (date === selectedDay) addedClass = ' selected';

      const enable = this.isDateEnabled(date);

      if (!enable) {
        result.push(<div className={'day-items' + addedClass}
                         ref={date} key={i}
                         style={{background: '#ccc', cursor: 'default', marginRight: marginRight}}
        >{number}</div>);
      } else if (enable) {
        result.push(<div className={'day-items' + addedClass}
                         ref={date} key={i}
                         style={{marginRight: marginRight}}
                         onClick={() => this.dayClicked(date)}
        >{number}</div>);
      }
    }
    return result;
  }

  render() {
    return (
      <div className="JC-days">
        <div className="holder">
          {!!this.state.daysCount && this.renderDays()}
        </div>
      </div>
    )
  }
}

export default Days;

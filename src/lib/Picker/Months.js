import React from 'react';

const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

class Months extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthPickerView: false,
      selectedMonth: this.props.month,
    }
  }

  monthClicked(i, e) {
    let {clickEvent} = this.props;
    if (clickEvent) clickEvent(i);
    this.setState({monthPickerView: false, selectedMonth: i})
  }

  renderMonths() {
    const {selectedMonth} = this.state;
    const result = [];
    for (let i = 1; months.length >= i; i++) {
      if (selectedMonth === i) {
        result.push(<div key={i} className="MonthItems selected">{months[i - 1]}</div>);
      }else {
        result.push(<div key={i} className="MonthItems"
                         onClick={(e) => this.monthClicked(i, e)}>{months[i - 1]}</div>);
      }
    }
    return result;
  }

  nextMonth = (e) => {
    e.preventDefault();
    this.monthClicked(this.props.month + 1)
  };

  prevMonth = (e) => {
    e.preventDefault();
    this.monthClicked(this.props.month - 1)
  };

  render() {
    const {month} = this.props;
    const {monthPickerView} = this.state;
    return (
      <div className="JC-Section">
        <div className="JC-Nav" onClick={this.prevMonth}>&#9654;</div>
        <div className="JC-Title" onClick={() => {
          this.setState({monthPickerView: !monthPickerView})
        }}>{months[month - 1]}</div>
        <div className="JC-Nav" onClick={this.nextMonth}>&#9664;</div>
        {monthPickerView && <div className="MonthPicker">{this.renderMonths()}</div>}
      </div>
    )
  }
}

export default Months;

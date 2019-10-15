import React from 'react';
import {NextIcon, PreviousIcon} from './Icons';

const jalaaliMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const gregorianMonths = ['ژانویه', 'فوریه', 'مارچ', 'آپریل', 'می', 'جون', 'جولای', 'آگوست', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'];

class Months extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthPickerView: false,
      selectedMonth: this.props.month,
    }
  }

  monthClicked(i, e) {
    e.preventDefault();
    let {clickEvent} = this.props;
    if (clickEvent) clickEvent(i);
    this.setState({monthPickerView: false, selectedMonth: i})
  }

  closeMonthPreview(e) {
    e.preventDefault();
    this.setState({monthPickerView: false})
  }

  renderMonths() {
    const {gregorian} = this.props;
    const {selectedMonth} = this.state;
    const result = [];
    const months = gregorian ? gregorianMonths : jalaaliMonths;
    for (let i = 1; months.length >= i; i++) {
      if (selectedMonth === i) {
        result.push(<div key={i} className="MonthItems selected"
                         onClick={(e) => this.closeMonthPreview(e)}>{months[i - 1]}</div>);
      }else {
        result.push(<div key={i} className="MonthItems"
                         onClick={(e) => this.monthClicked(i, e)}>{months[i - 1]}</div>);
      }
    }
    return result;
  }

  nextMonth = (e) => {
    this.monthClicked(this.props.month + 1, e)
  };

  prevMonth = (e) => {
    this.monthClicked(this.props.month - 1, e)
  };

  render() {
    const {month, gregorian} = this.props;
    const {monthPickerView} = this.state;

    const months = gregorian ? gregorianMonths : jalaaliMonths;

    return (
      <div className="JC-Section">
        <div className="JC-Nav" onClick={this.prevMonth}><PreviousIcon/></div>
        <div className="JC-Title" onClick={(e) => {
          e.preventDefault();
          this.setState({monthPickerView: !monthPickerView})
        }}>{months[month - 1]}</div>
        <div className="JC-Nav" onClick={this.nextMonth}><NextIcon/></div>
        {monthPickerView && <div className="MonthPicker">{this.renderMonths()}</div>}
      </div>
    )
  }
}

export default Months;

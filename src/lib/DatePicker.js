import React, {Component} from 'react';
import "./DateTimeInput.css";
import Years from './Picker/Years';
import Months from './Picker/Months';
import Days from './Picker/Days';
import moment from 'moment-jalaali';
import {isEqualDate} from './dateUtils';

moment.loadPersian([]);

class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedYear: parseInt(moment().format("jYYYY"), 10),
            currentMonth: parseInt(moment().format("jMM"), 10),
            selectedMonthFirstDay: moment(moment().format("jYYYY") + "/" + moment().format("jMM") + "/01", "jYYYY/jMM/jDD").weekday(),
            selectedDay: this.props.selectedDay ? moment(new Date(this.props.selectedDay)).format('jYYYY/jMM/jDD') : '',
        };

        this.state.daysCount = this.daysInMonth(moment().format("jMM"), moment().format("jYYYY"));
    }

    daysInMonth = (month, selectedYear) => {
        // console.log('month', month, typeof month);
        if (0 < month && month < 7) {
            return 31;
        } else if (6 < month && month < 12) {
            return 30;
        } else if (month === 12) {
            if (moment.jIsLeapYear(selectedYear)) {
                return 30;
            } else {
                return 29;
            }
        }
    };

    cancelPicker = (e) => {
        e.preventDefault();
        if (this.props.onDismiss) {
            this.props.onDismiss();
        }
        this.props.cancelHandler();
    };

    daysClicked = (momentDay) => {
        if (!isEqualDate(this.state.selectedDay, momentDay)) {
            this.setState({
                selectedDay: momentDay,
            }, () => {
                this.props.onChange({target: {name: this.props.name, value: momentDay}});
            });
        } else {
            this.props.cancelHandler();
        }
    };

    monthsClicked = (month) => {
        const {selectedYear} = this.state;
        let year = selectedYear;
        let thisMonth = month;
        this.setState({daysCount: 0});

        if (month === 0) {
            this.setState({
                currentMonth: 12,
                daysCount: this.daysInMonth(12, selectedYear - 1),
                selectedYear: selectedYear - 1
            });
            thisMonth = 12;
            year = selectedYear - 1;
        } else if (month === 13) {
            this.setState({
                currentMonth: 1,
                daysCount: this.daysInMonth(1, selectedYear + 1),
                selectedYear: selectedYear + 1
            });
            thisMonth = 1;
            year = selectedYear + 1;
        } else {
            this.setState({
                currentMonth: month,
                daysCount: this.daysInMonth(month, selectedYear)
            });
        }
        this.firstDayOfMonth(thisMonth, year);
    };

    firstDayOfMonth = (mo, ye) => {
        let month = mo.toString();
        let year = ye.toString();
        if (month.length === 1) month = "0" + month;
        this.setState({selectedMonthFirstDay: moment(year + "/" + month + "/01", "jYYYY/jMM/jDD").weekday()});
    };

    yearSelected = (year) => {
        this.setState({selectedYear: year});
        this.firstDayOfMonth(this.state.currentMonth, year);
    };

    render() {
        const {
            className,
            closeLabel = 'بستن',
            style,
            filterDate,
            // ...other
        } = this.props;

        const {daysCount, selectedDay, currentMonth, selectedYear, selectedMonthFirstDay} = this.state;

        return (
            <div className={"JDatePicker " + (className ? className : "")} style={style}>
                <Years changeEvent={(returnedYear) => this.yearSelected(returnedYear)} year={selectedYear}/>
                <Months clickEvent={(returnedMonth) => this.monthsClicked(returnedMonth)} month={currentMonth}/>
                <div className="days-titles">
                    <div>ش</div>
                    <div>ی</div>
                    <div>د</div>
                    <div>س</div>
                    <div>چ</div>
                    <div>پ</div>
                    <div>ج</div>
                </div>
                <Days selectedYear={selectedYear} selectedDay={selectedDay} currentMonth={currentMonth}
                      daysCount={daysCount} firstDay={selectedMonthFirstDay} clickEvent={this.daysClicked}
                      filterDate={filterDate}/>
                <div>
                    <button className="JD-Cancel" onClick={this.cancelPicker}>{closeLabel}</button>
                </div>
            </div>
        );
    }
}

export default DatePicker;

# React component for date and time input

A persian(jalaali, jalali, shamsi) date input with picker, 
which allows the user to type or select the date from the picker.

The component is compatible with react 16.

This module is written using  [jalaali-js](https://www.npmjs.com/package/jalaali-js), which is a light js library for jalaali date.

This module is written with inspiration of [react-advance-jalaali-datepicker](https://github.com/A-Kasaaian/react-advance-jalaali-datepicker).

#### Why an other date picker
There are multiple jalaali date and time pickers on npm and github, but there is a lack of simplicity and compatibility. This lib is aim to be compatible with React 16 and also be compatible with other field inputs.
The components simply get a `value` and a `name` as props, and fires `onChange` with `event` argument. The `event` object has `target` property containing the `name` and new `value`, so it can be put in a form just like any other input in that form and share the `handleChange` function.
Beside this module is `moment` free to have a smaller final boundle size.


## Demo

Here you can experience a live [demo](https://karianpour.github.io/react-hichestan-datetimepicker/)

### Features

- Date / DateTime fields.
- Farsi digits are rendered, and the farsi keyboard is supported as well as latin.
- Date picker, with month click and year click to change.
- Ability to type the date.
- Focus to the next field on enter.
- Correct tab indexes, day->month->year->hour->minute.
- Highlighting today.
- Align the picker to the right of the main input.
- Compatible input onChange event.
- Gregorian support and converter.

## Installation

Use `npm i react-hichestan-datetimepicker` in order to install the module.

## Usage
The component is quite the same as any other similar input, that means no label and decoration is provided for the component.

```jsx
import {DateTimeInput, DateTimeInputSimple, DateInput, DateInputSimple} from 'react-hichestan-datetimepicker';
```

and in the render function :
```jsx
<DateTimeInput
  value={this.state.myDateTime}
  name={'myDateTime'}
  onChange={this.handleChange}/>
<DateTimeInputSimple
  value={this.state.myDateTime}
  name={'myDateTime'}
  onChange={this.handleChange}/>
<DateInput
  value={this.state.myDateTime}
  name={'myDateTime'}
  onChange={this.handleChange}/>
<DateInputSimple
  value={this.state.myDateTime}
  name={'myDateTime'}
  onChange={this.handleChange}/>
```

and handle the change like normal input:
```jsx
  handleChange = (event) => {
    const newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  };

```

#### component types:

| name | Description |
| ---- | ----------- |
| **DateTimeInput** | shows a box allowing you to type or pick a _date_  and a _time_|



### -DateTimeInput

Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
name|string|no||The name that will be set while firing the onChange event in the target object
onChange|func|no||Callback function that is fired when the date value changes. @param {string} date and time, The new date and time in iso 8601 format like 2018-08-23T21:06:50Z. it is always UTC
autoOk|bool|no|true|If true, automatically accept and close the picker on select a date.
closeLabel|node|no||Override the default text of the &#x27;OK&#x27; button.
style|object|no|&lt;See the source code&gt;|Override the inline-styles of the root element.
className|string|no||The css class name of the root element.
dialogContainerStyle|object|no||Override the inline-styles of DatePickerDialog&#x27;s Container element.
dialogContainerClassName|object|no||Override the inline-styles of DatePickerDialog&#x27;s Container element.
disabled|bool|no||Disables the DateTimeInput.
readOnly|bool|no||makes the DateTimeInput readonly.
onClick|func|no||Callback function that is fired when a click event occurs on the Date Picker&#x27;s &#x60;TextField&#x60;.@param {object} event Click event targeting the &#x60;main div element&#x60;.
onDismiss|func|no||Callback function that is fired when the Date-Time input&#x27;s dialog is dismissed.
onFocus|func|no||Callback function that is fired when the Date-Time input&#x27;s &#x60;main div&#x60; gains focus.
onShow|func|no||Callback function that is fired when the Date-Time input&#x27;s dialog is shown.
filterDate|func|no||a function to filter some dates, return true means that it accept the date and false is to reject it. it gives a date &#x27;jYYYY/jMM/jDD&#x27; format as the first parameter
value|union|no||Sets the value for the Date-Time input.
-----


### Date and Time format
As we always save the date and time in back-end in timestamp, it does not make sense to send the data in any other format than  ISO 8601 date which I find the best date format. 

### On Mobile
On mobile the out side click works only if the page size and the view matches. In some cases the out side click div element cannot occupy all the page.

### Theming
The dialog box uses these css variables for the colors
```
  --datepicker-color: #8b4242;
  --datepicker-button-hover-color: #8b4242EE;
  --datepicker-background: #fff;
  --datepicker-days-background: #f7f7f7;
  --datepicker-today-background: #eec3c347;
  --datepicker-border-color: grey;
  --datepicker-shadow-color: #5959597a;
```
to change run a js like this:

```
document.documentElement.style.setProperty("--datepicker-color", "#");
document.documentElement.style.setProperty("--datepicker-button-hover-color", "black");
```

you can run it on the main `index.js` file

### ToDo
- In mobile device it is not a good experience to type in input text, having select make more sense.
- Data formatter function injection, to let the developer set and get the value in any other format that the back-end needs.



### Contribution
Feel free to fork and add some feature. If you have time to do improvement on the U/I that will be appreciated.
If some one for any reason wants to sand the date and time format in any other format than ISO 8601, we need to inject a date and time formatter into the component.

To start, make a clone and run:
```bash
npm install
npm start
```
and browse [http://localhost:3000](http://localhost:3000)

For publishing
```bash
./build-examples.sh
npm run build
npm publish
```

### Acknowledgement
The project is bootstrapped by create-component-lib.

Thanks to the [jalaali-js](https://www.npmjs.com/package/jalaali-js), library.

This module is written with inspiration of [react-advance-jalaali-datepicker](https://github.com/A-Kasaaian/react-advance-jalaali-datepicker).

Thanks for the beautiful font [Nahid](https://rastikerdar.github.io/nahid-font/)

### License

<sub>MIT License</sub>  
<sub>Copyright (c) 2017 Kayvan Arianpour (<karianpour@gmail.com>)</sub>  
<sub>Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:</sub>

<sub>The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.</sub>

<sub>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</sub>

import React from 'react';
import { render } from "react-dom";
import Example from './Examples';

const App = () => (
  <div style={{
    margin: "15px auto",
    padding: "0 15px",
    direction: 'rtl',
    fontSize: 16,
    fontWeight: 400,
  }}>
    <h1>تست فیلد تاریخ</h1>
    <p>ورژن ۲،۰ ساخت ۳</p>
    <ul>
      <li>نمایش عدد فارسی و ارسال به سرور اعداد لاتین</li>
      <li>ارسال داده به خارج از کمپوننت درصورت صحیح بودن</li>
      <li>کارکرد با کیبورد</li>
      <li>کپی و پیست کاربردوست</li>
      <li>نمایش کیبورد عددی در گوشی</li>
      <li>جابجایی با تب و علايم. با شیفت به عقب برمیگردد</li>
      <li>جابجایی بین المانها با # و * برای راحتی کار با گوشی</li>
    </ul>
    <Example/>
  </div>
);

render(<App />, document.getElementById("root"));

import React from 'react';
import { render } from "react-dom";
import Example from './Examples';

const App = () => (
  <div style={{
    margin: "15px 0",
    padding: "300px 650px 200px 600px",
    direction: 'rtl',
    fontSize: 16,
    fontWeight: 400,
    width: 400,
  }}>
    <h1>تست فیلد تاریخ</h1>
    <p>ورژن ۳،۰ ساخت ۲۴</p>
    <p>این صفحه به صورتی درست شده که با اسکرول بتوان دیالوگ را در مناطق مختلف صفحه تست کرد. ابعاد صفحه را کمی کوچک کنید</p>
    <ul>
      <li>نمایش عدد فارسی و ارسال به سرور اعداد لاتین</li>
      <li>ارسال داده به خارج از کمپوننت درصورت صحیح بودن</li>
      <li>کارکرد با کیبورد</li>
      <li>کپی و پیست کاربردوست</li>
      <li>نمایش کیبورد عددی در گوشی</li>
      <li>جابجایی با تب و علايم. با شیفت به عقب برمیگردد</li>
      <li>جابجایی بین المانها با # و * برای راحتی کار با گوشی</li>
      <li>قابل استفاده با Create-React-App / NextJs</li>
    </ul>
    <Example/>
  </div>
);

render(<App />, document.getElementById("root"));

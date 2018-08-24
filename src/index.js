import React from 'react';
import { render } from "react-dom";
import Example from './Examples';

const App = () => (
  <div style={{
    width: 640,
    margin: "15px auto",
    direction: 'rtl',
    fontSize: 16,
    fontWeight: 400,
  }}>
    <h1>تست فیلد تاریخ</h1>
    <p>برای تست چند فیلد تکست کنار فیلدها قرار گرفته‌اند تا ترتیب حرکت با کلید تب نیز تست شود.</p>
    <label>فیلد اول
      <br/>
      <input type="text" placeholder="از اینجا کلید تب را چند بار بزنید" />
    </label>
    <br/>
    <br/>
    <Example/>
    <br/>
    <br/>
    <label>فیلد آخر
      <br/>
      <input type="text" placeholder="این فیلد آخر است" />
    </label>
  </div>
);

render(<App />, document.getElementById("root"));

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
    <p>برای تست چند فیلد تکست کنار فیلدها قرار گرفته‌اند تا ترتیب حرکت با کلید تب نیز تست شود.</p>
    <Example/>
  </div>
);

render(<App />, document.getElementById("root"));

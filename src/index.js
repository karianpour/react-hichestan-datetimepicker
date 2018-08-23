import React from 'react';
import { render } from "react-dom";
import Example from './Examples';

const App = () => (
  <div style={{
    width: 640, margin: "15px auto", direction: 'rtl',
    fontSize: 16,
    fontWeight: 400,
  }}>
    <h1>Hello React</h1>
    <input type="text" placeholder="check the tab index" />
    <Example/>
    <input type="text" placeholder="focus on me to see the un-focus style" />
  </div>
);

render(<App />, document.getElementById("root"));

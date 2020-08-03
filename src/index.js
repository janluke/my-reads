import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ScrollMemory from 'react-router-scroll-memory';
import './index.scss';
import App from 'App';

ReactDOM.render(
  <React.StrictMode>
    <Router basename="/">
      <ScrollMemory />
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Routes from './navigation/Routes';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import './i18n';

ReactDOM.render(
  <Suspense fallback={null}>
    <React.StrictMode>
      <Routes />
    </React.StrictMode>
  </Suspense>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

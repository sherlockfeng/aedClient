import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Data from './data/data';
import Admin from './admin/admin';
import Login from './login/login';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter, Route } from 'react-router-dom'

ReactDOM.render((
    <HashRouter>
      <div style={{height: '100%'}}>
        <Route exact path="/" component={Data}/>
        <Route exact path="/admin" component={Admin}/>
        <Route exact path="/login" component={Login}/>
      </div>
    </HashRouter>
  ), document.getElementById('root'))
registerServiceWorker();

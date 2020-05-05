import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import HomeLayout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/login' component={LoginPage} />
          <Route path='/register' component={RegisterPage} />
          <Route path='/nav' component={HomeLayout} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

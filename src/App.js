import React from 'react';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import HomeLayout from './components/Layout'
import moment from 'moment';
import 'moment/locale/zh-cn';
import './common/css/pagestyle.css'
moment.locale('zh-cn');

function App() {

  return (
    <div className="App" >
      <HomeLayout />
    </div>
  );
}

export default App;

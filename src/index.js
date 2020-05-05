import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import App from './App';
import './common/css/default.css'
import './common/css/pagestyle.css'
import './common/css/common.css'
ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>, 
    document.getElementById('root')
);


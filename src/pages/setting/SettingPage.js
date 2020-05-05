import React from 'react'
import { Tabs, Icon } from 'antd';
import ProfilePage from './ProfilePage.js'
import BasicSettingPage from './BasicSettingPage.js'
import PasswordModifyPage from './PasswordModifyPage.js'
const { TabPane } = Tabs;

function SettingPage() {
    return (
        <Tabs tabPosition='top' style={{backgroundColor: '#fff'}}>
            <TabPane tab="基础设置" key="1">
                <BasicSettingPage />
            </TabPane>
            <TabPane tab="个人资料" key="3">
                <ProfilePage />
            </TabPane>
            <TabPane tab="修改密码" key="2">
                <PasswordModifyPage />
            </TabPane>
        </Tabs>
    )
}

export default SettingPage
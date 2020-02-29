import React from 'react'
import { Tabs, Icon } from 'antd';
import ProfilePage from './ProfilePage.js'
import BasicSettingPage from './BasicSettingPage.js'
const { TabPane } = Tabs;

function SettingPage() {
    return (
        <Tabs tabPosition='top' >
            <TabPane tab="基础设置" key="1">
                <BasicSettingPage />
            </TabPane>
            <TabPane tab="个人资料" key="2">
                <ProfilePage />
            </TabPane>
            <TabPane tab="软件设置" key="3">
                软件设置
            </TabPane>
        </Tabs>
    )
}

export default SettingPage
import React, { useState } from 'react';
import { Layout, Icon, Row, Col, Menu, Avatar, Dropdown, Modal } from 'antd';
import { Link } from 'react-router-dom'
const { Header } = Layout;
const { ipcRenderer } = window.require('electron')
const user_info = JSON.parse(localStorage.getItem('user_info'))
function HomeHeader(props) {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
        props.onHeaderClick && props.onHeaderClick(collapsed)
    }
    const handleQuit = () => {
        //关闭所有程序
        Modal.confirm({
            title: '提示',
            content: '是否要退出应用',
            onOk() {
                ipcRenderer.send('close-main-window')
                localStorage.clear();
            }
        });
    }
    const menu = (
        <Menu>
            <Menu.Item key="sub3">
                <Link to='/nav/setting'>
                    <Icon type="setting" />&nbsp;&nbsp;&nbsp;&nbsp;设置
                </Link>
            </Menu.Item>
            <Menu.Item key="sub4">
                <div onClick={handleQuit}>
                    <Icon type="logout" />&nbsp;&nbsp;&nbsp;&nbsp;退出
                </div>
            </Menu.Item>

        </Menu>
    )

    return (
        <Header style={{ background: '#fff', padding: 0, borderBottom: '1px solid #ccc', verticalAlign: 'baseline' }}>
            <Row type='flex' justify='space-between' align='middle'>
                <Col xs={3} sm={1}
                    className="d-flex ai-center jc-center pointer header-item"
                    onClick={toggleCollapsed}
                >
                    <Icon
                        className="trigger"
                        type={props.collapsed ? 'menu-unfold' : 'menu-fold'}

                    />
                </Col>
                <Col span={4} className='text-center pointer header-item'>
                    <Dropdown overlay={menu}>
                        <p style={{ height: 56 }}>
                            <Avatar src={user_info.avatar} />
                            <span style={{ padding: '0 10px', fontSize: 14 }}>{user_info.username}</span>
                        </p>
                    </Dropdown>
                </Col>
            </Row>

        </Header>
    )
}

export default HomeHeader
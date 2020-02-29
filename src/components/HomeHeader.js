import React, { useState } from 'react';
import { Layout, Icon, Row, Col, Menu, Avatar, Dropdown } from 'antd';
import { Link } from 'react-router-dom'
const { Header } = Layout;
const { SubMenu } = Menu;

function HomeHeader(props) {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
        props.onHeaderClick && props.onHeaderClick(collapsed)
    }
    const menu = (
        <Menu>
            <Menu.Item key="sub3">
                <Link to='/nav/setting'>
                    <Icon type="setting" />     设置
                </Link>
            </Menu.Item>
        </Menu>
    )

    return (
        <Header style={{ background: '#fff', padding: 0, height: 58, borderBottom: '1px solid #ccc', verticalAlign: 'baseline' }}>
            <Row type='flex' justify='space-between' align='middle'>
                <Col >
                    <Icon
                        className="trigger"
                        type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={toggleCollapsed}
                        style={{ paddingLeft: 10 }}
                    />
                </Col>
                <Col span={5}>
                    <Dropdown overlay={menu}>
                        <p style={{ height: 56 }}>
                            <Avatar src="https://i.loli.net/2020/02/16/4lt8NdM9yAZ3sLW.jpg" />
                            <span style={{ padding: '0 10px', fontSize: 14 }}>- 妙啊</span>
                        </p>
                    </Dropdown>
                </Col>
            </Row>

        </Header>
    )
}

export default HomeHeader
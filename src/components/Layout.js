import React, { useState } from 'react';
import { Layout, Icon, Row, Col } from 'antd';
import HomeNav from './HomeNav'
import HomeHeader from './HomeHeader'
import menuRouteConfig from '../common/menuRoute'
import menuInfo from '../common/menu'
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom'
const { Sider, Content } = Layout;
const { redirectPath } = menuInfo

const FileList = () => {
    return (
        <div className="">file list </div>
    )
}


function HomeLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const onHeaderClick = (data) => {
        setCollapsed(!collapsed)

    }
    return (
        <Router>
            <Layout >
                <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: '#fff' }}>
                    <div className="logo" />
                    <Row style={{ textAlign: 'center' }}>
                        <Col span={12}>
                            <Link to='/nav'>导航</Link>
                        </Col>
                        <Col span={12}>
                            <Link to='/fileList'>文件</Link>
                        </Col>
                    </Row>
                    <Switch>

                        <Route path='/nav' component={HomeNav} />
                        <Route path='/fileList' component={FileList} />

                    </Switch>
                    <Redirect path='/nav' to={redirectPath} />
                </Sider>
                <Layout>
                    <HomeHeader onHeaderClick={onHeaderClick} />
                    <Content
                        style={{
                            padding: 24,
                            background: '#f7f7f7',
                            minHeight: 280,
                        }}
                    >
                        <Switch>
                            {
                                menuRouteConfig.map((item, index) => {
                                    console.log(item)
                                    return (
                                        <Route
                                            key={index}
                                            exact={item.exact}
                                            path={item.path}
                                            component={item.component} />
                                    )
                                })
                            }
                        </Switch>
                    </Content>

                </Layout>
            </Layout>
        </Router>
    )
}

export default HomeLayout
import React, { useState } from 'react';
import { Layout, Row, Col, Icon } from 'antd';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom'
import HomeNav from './HomeNav'
import HomeHeader from './HomeHeader'
import FileListPage from '../pages/FileListPage'
import menuRouteConfig from '../common/menuRoute'
import menuInfo from '../common/menu'
const { Sider, Content } = Layout;
const { redirectPath } = menuInfo


function HomeLayout({ location }) {
    const [collapsed, setCollapsed] = useState(false);
    const onHeaderClick = () => {
        setCollapsed(!collapsed)

    }
    return (
        <Router>
            <Layout >
                <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: '#fff' }}>
                    <div className="logo">
                        <Link to={'/nav/home'} className='logo-item'>
                            {
                                collapsed ? <Icon type="slack-circle" theme="filled" style={{ color: '#1890ff', fontSize: 40 }} /> : <>
                                    <span className='logo-blue'>L</span>
                                    <span className='logo-yellow'>O</span>
                                    <span className='logo-orange'>G</span>
                                    <span className='logo-pink'>O</span>
                                </>
                            }
                        </Link>
                    </div>
                    <Switch>
                        <Route path='/nav' component={HomeNav} />
                        <Route path='/fileList/:id' component={FileListPage} />
                    </Switch>
                    <Redirect path='/nav' to={redirectPath} />
                </Sider>
                <Layout>
                    <HomeHeader onHeaderClick={onHeaderClick} />
                    <Content
                        style={{
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                            userSelect: 'none'
                        }}
                    >
                        <Switch>
                            {
                                menuRouteConfig.map((item, index) => {
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
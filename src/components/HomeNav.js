import React from 'react';
import { Menu, Icon, Button } from 'antd';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import menuInfo from '../common/menu'
const { SubMenu } = Menu;
const { menuConfig } = menuInfo


function HomeNav({ match, location }) {
    const handleMenuConfig = (menuData) => {
        let submenuIndex = 0; //累计的每一项展开菜单索引
        let menu = [];
        const createItem = (menuData, el) => {
            for (let i = 0; i < menuData.length; i++) {
                const item = menuData[i];
                if (item.children) {  //如果有子级菜单
                    let children = [];
                    createItem(item.children, children);
                    submenuIndex++;
                    el.push(
                        <SubMenu
                            key={`sub${submenuIndex}`}
                            title={(
                                <span>
                                    {item.icon ? <Icon type={item.icon} /> : null}
                                    <span>{item.title}</span>
                                </span>
                            )}
                        >
                            {children}
                        </SubMenu>
                    )
                } else {   //如果没有子级菜单
                    //itemIndex++;
                    el.push(
                        <Menu.Item key={item.path}>
                            <Link to={`${item.path}`} >
                                {item.icon ? <Icon type={item.icon} /> : null}
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }
            }

        };
        createItem(menuData, menu);
        return menu
    }
    return (
        <div >
            <Menu
                //defaultSelectedKeys={defaultSelectedKeys}
                //defaultOpenKeys={['sub1']}
                selectedKeys={[location.pathname]}
                mode="inline"
                style={{ minHeight: '100vh' }}
            >
                {handleMenuConfig(menuConfig)}
            </Menu>
        </div>
    )
}

export default HomeNav
import React from 'react';
import { Menu, Icon, Button } from 'antd';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import menuInfo from '../common/menu'
const { SubMenu } = Menu;
const { menuConfig } = menuInfo


function HomeNav({ match }) {

    const handleMenuConfig = (menuData) => {
        let submenuIndex = 0; //累计的每一项展开菜单索引
        let menu = [];
        let defaultSelectedKeys = [];
        const createItem = (menuData, el) => {
            for (let i = 0; i < menuData.length; i++) {
                const item = menuData[i];
                if (item.defaultSelected) {
                    defaultSelectedKeys.push(item.path)
                }
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
                            <Link to={`${match.url}/${item.path}`} >
                                {item.icon ? <Icon type={item.icon} /> : null}
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }
            }

        };

        createItem(menuData, menu);
        return {
            menu,
            defaultSelectedKeys
        };
    }
    const { menu, defaultSelectedKeys } = handleMenuConfig(menuConfig)

    return (
        <div >
            <Menu
                defaultSelectedKeys={defaultSelectedKeys}
                defaultOpenKeys={['sub1']}
                mode="inline"
                style={{ minHeight: '100vh' }}
            >
                {menu}
            </Menu>
        </div>
    )
}

export default HomeNav
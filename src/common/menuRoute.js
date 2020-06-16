import React from 'react'
import MdPage from '../pages/MdPage'
import HomePage from '../pages/HomePage'
import CreatePage from '../pages/CreatePage'
import EditorPage from '../pages/EditorPage'
import ProfilePage from '../pages/setting/ProfilePage'
import SettingPage from '../pages/setting/SettingPage'
import MaterialPage from '../pages/MaterialPage'
import DataCenterPage from '../pages/DataCenterPage'
import SuccessResult from '../pages/result/SuccessResult'
import NoReuslt from '../pages/result/NoReuslt'

const menuRouteConfig = [
    {
        path: "/nav/home",
        exact: true,
        component: HomePage
    },
    {
        path: "/nav/create",
        exact: true,
        component: CreatePage
    },
    {
        path: "/nav/md",
        exact: true,
        component: MdPage
    },
    {
        path: "/nav/editor",
        component: EditorPage
    },
    {
        path: "/nav/editor",
        exact: true,
        component: EditorPage
    },
    {
        path: "/nav/material",
        exact: true,
        component: MaterialPage
    },
    {
        path: "/nav/datacenter",
        exact: true,
        component: DataCenterPage
    },
    {
        path: "/nav/profile",
        exact: true,
        component: ProfilePage
    },
    {
        path: "/nav/setting",
        exact: true,
        component: SettingPage
    },
    {
        path: "/nav/404",
        exact: true,
        component: NoReuslt
    },
    {
        path: "/nav/success",
        exact: true,
        component: SuccessResult
    },
    {
        path: "*",
        exact: true,
        component: () => <div className="">* page</div>
    }

]

export default menuRouteConfig

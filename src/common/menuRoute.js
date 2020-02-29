import React from 'react'
import MdPage from '../pages/MdPage'
import CreatePage from '../pages/CreatePage'
import EditorPage from '../pages/EditorPage'
import FileManagePage from '../pages/FileManagePage'
import ProfilePage from '../pages/setting/ProfilePage'
import SettingPage from '../pages/setting/SettingPage'
import MaterialPage from '../pages/MaterialPage'

const menuRouteConfig = [
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
        path: "/nav/material",
        exact: true,
        component: MaterialPage
    },
    {
        path: "/nav/manage",
        exact: true,
        component: FileManagePage
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
        path: "*",
        exact: true,
        component: () => <div className="">* page</div>
    }

]

export default menuRouteConfig
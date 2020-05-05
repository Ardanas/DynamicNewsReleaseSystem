const menuConfig = [
    { path: "/nav/home", key: "home", title: "首页", icon: "home" },
    { path: "/nav/create", key: "create", title: "新闻管理", icon: "project" },
    /*{
        path: "release", key: "release", title: "编写新闻", icon: "edit", children: [
            { path: "md", key: "md", title: " Markdown", icon: "info-circle", },
            { path: "editor", key: "editor", title: "富文本编辑器", icon: "info-circle" }
        ]
    },*/
    { path: "/fileList/create", key: "editor", title: "发布文章", icon: "form" },
    { path: "/nav/material", key: "material", title: "素材库", icon: "bars" },
    { path: "/nav/datacenter", key: "datacenter", title: "数据中心", icon: "bar-chart" },
    { path: "/nav/setting", key: "setting", title: "设置中心", icon: "setting" }
]

const redirectPath = '/nav/home'

export default {
    menuConfig,
    redirectPath
};
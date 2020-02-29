const menuConfig = [
    { path: "create", title: "新建新闻", icon: "bars"},
    {
        path: "release", key: "release", title: "编写新闻", icon: "edit", children: [
            { path: "md", key: "md", title: " Markdown", icon: "info-circle", },
            { path: "editor", key: "editor", title: "富文本编辑器", icon: "info-circle" }
        ]
    },
    { path: "manage", title: "文件管理", icon: "bars" },
    { path: "material", title: "素材库", icon: "bars", defaultSelected: true  },
    { path: "12", title: "setting", icon: "bars" },
]
const redirectPath = '/nav/material'
export default {
    menuConfig,
    redirectPath
};
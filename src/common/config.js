const config = {
    frontendUrl: 'http://localhost:3000',
    backendUrl: 'http://localhost:3333',
    uid: 'as34dindia4sdaa34dsc',
    channelList: [
        {
            id: '1',
            key: 'a',
            value: '新闻',
        },
        {
            id: '2',
            key: 'b',
            value: '娱乐'
        },
        {
            id: '3',
            key: 'c',
            value: '汽车'
        },
        {
            id: '4',
            key: 'd',
            value: '军事'
        },
        {
            id: '5',
            key: 'e',
            value: '美食'
        },
        {
            id: '6',
            key: 'f',
            value: '财经'
        }

    ],
    relesePage: {
        mdTypeList: [{
            id: '1',
            type: 'a',
            key: 'news',
            value: '新闻',
        },
        {
            id: '2',
            type: 'b',
            key: 'amusement',
            value: '娱乐'
        },
        {
            id: '3',
            type: 'c',
            key: 'car',
            value: '汽车'
        },
        {
            id: '4',
            type: 'd',
            key: 'military',
            value: '军事'
        },
        {
            id: '5',
            type: 'e',
            key: 'food',
            value: '美食'
        },
        {
            id: '6',
            type: 'f',
            key: 'economy',
            value: '财经'
        }]
    },
    fileManagePage: {

    },
    editorPage: {
        editorConfig: {
            placeholder: '请输入正文',
            style: {
                borderBottom: '1px solid rgba(0,0,0,.2)',
                marginBottom: 10
            },
            controls: [
                'undo', 'redo', 'font-size', 'separator',
                'text-color', 'bold', 'italic', 'media', 'separator',
                'emoji', 'separator', 'text-align', 'separator',
                'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
                'link', 'separator', 'hr', 'separator',
                'separator', 'clear'
            ],
            hooks: {
                'toggle-link': ({ href, target }) => {
                    console.log(target)
                    href = href.indexOf('http') === 0 ? href : `http://${href}`
                    return { href, target }
                }
            },
            imageControls: [
                'float-left', // 设置图片左浮动
                'float-right', // 设置图片右浮动
                'align-left', // 设置图片居左
                'align-center', // 设置图片居中
                'align-right', // 设置图片居右
                'link', // 设置图片超链接
                'size', // 设置图片尺寸
                'remove' // 删除图片
            ],
            media: {
                validateFn: (file) => {
                    return file.size < 1024 * 100
                },
                accepts: {
                    image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg'
                }
            }
        },
        formConfig: {
            channelList: [
                {
                    id: '1',
                    key: 'a',
                    value: '新闻',
                },
                {
                    id: '2',
                    key: 'b',
                    value: '娱乐'
                },
                {
                    id: '3',
                    key: 'c',
                    value: '汽车'
                },
                {
                    id: '4',
                    key: 'd',
                    value: '军事'
                },
                {
                    id: '5',
                    key: 'e',
                    value: '美食'
                },
                {
                    id: '6',
                    key: 'f',
                    value: '财经'
                }

            ]
        }
    }
}

export default config
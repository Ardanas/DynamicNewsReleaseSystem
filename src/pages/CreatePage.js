import React, { useEffect, useState } from 'react'
import { Icon, Row, Col, Button, Tabs, Statistic, Divider, Tag, message, Popconfirm, Drawer } from 'antd'
import { Link } from 'react-router-dom'
import { useRequest } from '@umijs/hooks';
import moment from 'moment'
import TableComponent from '../components/TableComponent'
import OutputPreview from '../components/OutputPreview'
import DraftPage from './DraftPage'
import api from '../utils/api';
const { getNews, deleteNews, downNews } = api
const { TabPane } = Tabs;

function RelesePage() {
    const [visible, setVisible] = useState(false)
    const [previewValue, setPreviewValue] = useState({})
    const [tagsKey, setTagsKey] = useState('all')
    const [tableData, setTableData] = useState(null)
    const [allNum, setAllNum] = useState(0)
    const { loading, run, refresh } = useRequest(getNews, {
        manual: true,
        cacheKey: tagsKey,
        onSuccess(res, params) {
            setTableData(res.datas)
            if (params[0] === 'all') {
                setAllNum(res.datas.length)
            }
        }
    })
    const { loading: deleteLoading, run: deleteRun } = useRequest(deleteNews, {
        manual: true,
        onSuccess(res, params) {
            setTableData(tableData.filter(item => item.systemid !== params[0]))
            message.info('删除成功');
        }
    })
    const { run: downRun } = useRequest(downNews, {
        manual: true,
        onSuccess(res, params) {
            console.log(res)
            if (res.sign === '1') {
                message.info('下架成功');
                refresh()
            }
        }
    })

    useEffect(() => {
        run(tagsKey)
    }, [tagsKey])
    const handleDownNews = (id) => {
        downRun(id)
    }
    const tableColumns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
            isGetColumnSearchProps: true
        },
        {
            title: '数据',
            dataIndex: 'address',
            key: 'address',
            render: text => (
                <span>
                    <Icon type="star-o" /> 123
                    <Divider type="vertical" />
                    <Icon type="like-o" /> 11
                    <Divider type="vertical" />
                    <Icon type="message" /> 33
                </span>
            )
        },
        {
            title: '标签',
            key: 'tags',
            dataIndex: 'tags',
            render: (text, record) => (
                <span>
                    <Tag color={record.fbzt.color} key={'fbzt'}>
                        {record.fbzt.tag}
                    </Tag>
                    <Tag color={record.lylx.color} key={'lylx'}>
                        {record.lylx.tag}
                    </Tag>
                    <Tag color={record.channel.color} key={'channel'}>
                        {record.channel.tag}
                    </Tag>
                </span>
            ),
        },
        {
            title: '时间',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a, b) => moment(a.created_at) - moment(b.created_at),
            render: (text, record) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    {
                        record.fbzt.value ? <Popconfirm
                            title="下架后到草稿箱, 可以继续编辑后发布, 确定下架吗?"
                            onConfirm={() => handleDownNews(record.systemid)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a>下架</a>
                        </Popconfirm> : <Link to={`/fileList/${record.systemid}`}>修改</Link>
                    }

                    <Divider type="vertical" />
                    <Popconfirm
                        title="确定删除吗?"
                        onConfirm={() => handleDelete(record.systemid)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a>删除</a>
                    </Popconfirm>
                </span>
            )
        }
    ];
    const props = tableData ? { tableData } : null
    const handleDelete = (id) => {
        deleteRun(id)
    }
    const handlePreview = (record) => {
        console.log(record)
        setVisible(true)
        record.created_at = moment(record.created_at).fromNow()
        record.content = record.contentforhtml
        setPreviewValue(record)
    }
    return (
        <>
            <Row type="flex" justify='space-around' className='create-header'>

                <Col span={8} className='d-flex ai-center jc-center create-header-left' style={{ height: 100 }}>
                    <Link to='/fileList/create'>
                        <Button type="primary" shape="round" icon="upload" size='large'>
                            发布内容
                        </Button>
                    </Link>
                </Col>
                <Col span={15} className='d-flex ai-center jc-center text-center create-header-right' style={{ height: 100 }}>

                    <Col span={8}>
                        <Statistic title="阅读量" value={Math.floor(Math.random() * 1000)} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="关注数" value={Math.floor(Math.random() * 1000)} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="发布量" value={allNum} />
                    </Col>

                </Col>
            </Row>

            <Row style={{ marginTop: 20 }} className='bg-white br-4'>
                <Col span={24} >
                    <Tabs defaultActiveKey="all" size='large' onTabClick={(key) => setTagsKey(key)}>
                        <TabPane tab={
                            <span>
                                全部 <span style={{ color: '#ccc' }}>({allNum})</span>
                            </span>
                        } key="all">
                            <TableComponent {...props} onPreview={handlePreview} columns={tableColumns} loading={loading} deleteLoading={deleteLoading} />
                        </TabPane>
                        <TabPane tab="已发布" key="1">
                            <TableComponent {...props} onPreview={handlePreview} columns={tableColumns} loading={loading} deleteLoading={deleteLoading} />
                        </TabPane>
                        <TabPane tab="草稿箱" key="0">
                            <DraftPage {...props} loading={loading} onChange={handleDelete} />
                        </TabPane>
                        <TabPane tab="我的浏览" key="4">
                            <DraftPage />
                        </TabPane>
                    </Tabs>
                </Col>

            </Row>

            <Drawer
                title='文章预览'
                width='80%'
                onClose={() => { setVisible(false) }}
                visible={visible}
                bodyStyle={{ padding: '0 0 80px 0' }}
            >
                <OutputPreview {...previewValue} />
            </Drawer>

        </>
    )
}


export default RelesePage;


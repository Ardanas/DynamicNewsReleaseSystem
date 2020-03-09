import React, { useEffect, useState } from 'react'
import { Icon, Row, Col, Button, Tabs, Statistic, Divider, Tag, message, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import { useRequest } from '@umijs/hooks';
import moment from 'moment'
import TableComponent from '../components/TableComponent'
import DraftPage from './DraftPage'
import api from '../utils/api';
const { getNews, deleteNews } = api
const { TabPane } = Tabs;

function RelesePage() {
    const [tagsKey, setTagsKey] = useState('all')
    const [tableData, setTableData] = useState(null)
    const { loading, run } = useRequest(getNews, {
        manual: true,
        onSuccess(res) {
            setTableData(res.datas)
        }
    })
    const { loading: deleteLoading, run: deleteRun } = useRequest(deleteNews, {
        manual: true,
        onSuccess(res, params) {
            setTableData(tableData.filter(item => item.systemid !== params[0]))
            message.info('删除成功');
        }
    })
    useEffect(() => {
        run(tagsKey)
    }, [tagsKey])
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
                    <Icon type="eye" /> 123
                    <Divider type="vertical" />
                    <Icon type="eye" /> 11
                    <Divider type="vertical" />
                    <Icon type="eye" /> 33
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
                    <Link to={`/nav/editor/p/${record.systemid}`}>修改</Link>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确定删除吗?"
                        onConfirm={() => handleDelete(record.systemid)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a>删除</a>
                    </Popconfirm>,
                </span>
            )
        }
    ];
    const props = tableData ? { tableData } : null
    const handleDelete = (id) => {
        deleteRun(id)
    }
    return (
        <>
            <Row type="flex" justify='space-around' style={{ height: 100 }}>

                <Col span={8} style={{ borderRadius: 5, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    <Link to='/nav/editor/p/1237123123'>
                        <Button type="primary" shape="round" icon="upload" size='large'>
                            发布内容
                        </Button>
                    </Link>
                </Col>
                <Col span={15} style={{ borderRadius: 5, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>

                    <Col span={8}>
                        <Statistic title="阅读量" value={112893} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="关注数" value={112893} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="发布量" value={112893} />
                    </Col>

                </Col>
            </Row>

            <Row style={{ marginTop: 20 }}>
                <Col span={24} >
                    <Tabs defaultActiveKey="all" size='large' onTabClick={(key) => setTagsKey(key)}>
                        <TabPane tab={
                            <span>
                                全部 <span style={{ color: '#ccc' }}>(11)</span>
                            </span>
                        } key="all">
                            <TableComponent {...props} columns={tableColumns} loading={loading} deleteLoading={deleteLoading} />
                        </TabPane>
                        <TabPane tab="已发布" key="1">
                            <TableComponent {...props} columns={tableColumns} loading={loading} deleteLoading={deleteLoading} />
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
        </>
    )
}


export default RelesePage;


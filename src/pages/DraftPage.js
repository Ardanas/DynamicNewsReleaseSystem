import React, { useState, useRef } from 'react'
import { List, Skeleton, Row, Col, Popconfirm, Spin } from 'antd'
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import { Link } from 'react-router-dom'


function DraftPage({ tableData = [], loading = false, onChange = null }) {

    const [hasMore, setHasMore] = useState(false)

    const handleDelete = id => {
        onChange && onChange(id)
    };

    const handleInfiniteOnLoad = () => {
        // if(draftList.length>=10)
        // 请求返回的total,根据total去计算要不要再去请求
        //setLoading(true)
        /*setTimeout(() => {
            setDraftList([...draftList, ...draftList])
            setLoading(false)
            if (draftList.length > 10) {
                setHasMore(false)
            }
        }, 3000);*/
    }
    /*if (loading) {
        return (
            <Row type='flex' justify='center'>
                <Spin />
            </Row>
        )
    }*/
    return (
        <div style={{ height: 400, overflowY: 'auto', overflowX: 'hidden' }} className='infinite-container'>
            <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={handleInfiniteOnLoad}
                hasMore={!loading && hasMore}
                useWindow={false}
            >
                <List
                    className='w-100 draft-container'
                    itemLayout="horizontal"
                    dataSource={tableData}
                    renderItem={item => (
                        <Skeleton loading={loading} active avatar>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        item.cover ? (
                                            <div style={{ width: '156px', height: 110 }}>
                                                <img src={item.cover} className='image-contain' />
                                            </div>

                                        ) : null
                                    }
                                    title={
                                        <div className='draft-item-title'>
                                            <Link to={`/nav/editor?id=${item.systemid}`} style={{ color: '#444' }}>{item.title || '(无标题)'}</Link>
                                        </div>
                                    }
                                    description={
                                        <Row className='o-hidden'>
                                            <Col className='draft-item-content-container' style={{ minHeight: item.cover ? 66 : null }}>
                                                <span className='draft-item-content'></span>
                                                <span dangerouslySetInnerHTML={{ __html: item.contentfortext ? String(item.contentfortext).replace(/\s*/g, "") : '' }}></span>
                                            </Col>
                                            <Col style={{ color: 'grey' }}>
                                                <span><Link key="list-loadmore-edit" to={`/nav/editor?id=${item.systemid}`}>编辑</Link></span>
                                                <span className='px-10'>
                                                    <Popconfirm
                                                        title="删除后无法恢复，是否确定删除?"
                                                        onConfirm={() => handleDelete(item.systemid)}
                                                        okText="确定"
                                                        cancelText="取消"
                                                    >
                                                        <a key="list-loadmore-more">删除</a>
                                                    </Popconfirm>
                                                </span>

                                                <span>{moment(item.last_time).fromNow()}</span>

                                            </Col>
                                        </Row>
                                    }
                                />
                            </List.Item >
                        </Skeleton>
                    )}
                />

                <div className="draft-loading-container">
                    <Spin spinning={loading && hasMore} />
                </div>

            </InfiniteScroll>
        </div>
    )
}

export default DraftPage
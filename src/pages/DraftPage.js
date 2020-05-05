import React, { useState, useRef } from 'react'
import { List, Skeleton, Row, Col, Popconfirm, Spin } from 'antd'
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import { Link } from 'react-router-dom'
let data = [
    {
        id: 1,
        title: 'qweqwe',
        creacted_at: '刚刚'
    },
    {
        id: 2,
        content: 'qweqweasd',
        creacted_at: '刚刚'
    },
    {
        id: 3,
        cover: 'https://p3.pstatp.com/list/190x124/pgc-image/c71b40c0a00f496cb353bce11484bd4f',
        title: 'qweqwe',
        content: `2019/10/7 晴
        1.宿舍用品（待购）
        钢丝，镜子，拖把，拖桶，垃圾桶，洗菜盆
        2.宿舍逆袭计划
        健身：每天坚持锻炼，锻炼内容自定，时间（15min以上），做到互相监督，如无特殊原因（如身体不适，不在宿舍等)
        违反第一次，罚糖水，
        第二次，罚一餐饭（15一以下），
        第三次，罚洗碗七次
        第四次，罚洗一个月碗
        学习：互相提醒，学习内容自定
        交流：每周至少进行一次学习心得交流
        3. 宿舍卫生
        一个月至少一次大扫除，包括：
        全部房间扫地和拖地
        厨房油渍清除
        整理杂物`,
        creacted_at: '1天前'
    },
    {
        id: 3,
        cover: 'https://p3.pstatp.com/list/190x124/pgc-image/c71b40c0a00f496cb353bce11484bd4f',
        title: 'qweqwe',
        content: `2019/10/7 晴
        1.宿舍用品（待购）
        钢丝，镜子，拖把，拖桶，垃圾桶，洗菜盆
        2.宿舍逆袭计划
        健身：每天坚持锻炼，锻炼内容自定，时间（15min以上），做到互相监督，如无特殊原因（如身体不适，不在宿舍等)
        违反第一次，罚糖水，
        第二次，罚一餐饭（15一以下），
        第三次，罚洗碗七次
        第四次，罚洗一个月碗
        学习：互相提醒，学习内容自定
        交流：每周至少进行一次学习心得交流
        3. 宿舍卫生
        一个月至少一次大扫除，包括：
        全部房间扫地和拖地
        厨房油渍清除
        整理杂物`,
        creacted_at: '1天前'
    },
    {
        id: 3,
        cover: 'https://p3.pstatp.com/list/190x124/pgc-image/c71b40c0a00f496cb353bce11484bd4f',
        title: 'qweqwe',
        content: `2019/10/7 晴
        1.宿舍用品（待购）
        钢丝，镜子，拖把，拖桶，垃圾桶，洗菜盆
        2.宿舍逆袭计划
        健身：每天坚持锻炼，锻炼内容自定，时间（15min以上），做到互相监督，如无特殊原因（如身体不适，不在宿舍等)
        违反第一次，罚糖水，
        第二次，罚一餐饭（15一以下），
        第三次，罚洗碗七次
        第四次，罚洗一个月碗
        学习：互相提醒，学习内容自定
        交流：每周至少进行一次学习心得交流
        3. 宿舍卫生
        一个月至少一次大扫除，包括：
        全部房间扫地和拖地
        厨房油渍清除
        整理杂物`,
        creacted_at: '1天前'
    }
]

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
                                            <Link to={`/fileList/${item.systemid}`} style={{ color: '#444' }}>{item.title || '(无标题)'}</Link>
                                        </div>
                                    }
                                    description={
                                        <Row className='o-hidden'>
                                            <Col className='draft-item-content-container' style={{ minHeight: item.cover ? 66 : null }}>
                                                <span className='draft-item-content'></span>
                                                <span dangerouslySetInnerHTML={{ __html: item.contentfortext ? String(item.contentfortext).replace(/\s*/g, "") : '' }}></span>
                                            </Col>
                                            <Col style={{ color: 'grey' }}>
                                                <span><Link key="list-loadmore-edit" to={`/fileList/${item.systemid}`}>编辑</Link></span>
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
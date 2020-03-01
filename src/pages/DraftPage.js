import React, { useState, useRef } from 'react'
import { List, Skeleton, Row, Col, Popconfirm, Spin } from 'antd'
import InfiniteScroll from 'react-infinite-scroller';

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

function DraftPage() {

    const [draftList, setDraftList] = useState(data)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const draftItemDelete = useRef()
    const draftItemTitle = {
        color: '#444',
        fontSize: 16,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontWeight: 600
    }
    const draftItemContent = {
        display: '-webkit-box',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflowWrap: 'break-word'
    }
    const draftItemContentContainer = {
        display: 'inline-block',
        backgroundColor: '#bfbfbf',
        width: 3,
        height: 14,
        marginTop: 3,
        marginRight: 5,

    }
    const handleDelete = key => {
        setDraftList(draftList.filter(item => item.id !== key));
    };

    const handlePaginationChange = (pageNo, pageSize) => {
        console.log(pageNo, pageSize);
    }
    const paginationOption = {
        pageSize: 10,
        total: 200,
        onChange: handlePaginationChange,
        showSizeChanger: true,
        onShowSizeChange: handlePaginationChange
    }
    const handleInfiniteOnLoad = () => {
        setLoading(true)
        setTimeout(() => {
            setDraftList([...draftList, ...draftList])
            setLoading(false)
            if (draftList.length > 10) {
                setHasMore(false)
            }
        }, 3000);
    }
    return (
        <div style={{ height: 400, overflow: 'auto' }} className='infinite-container'>
            <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={handleInfiniteOnLoad}
                hasMore={!loading && hasMore}
                useWindow={false}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={draftList}
                    renderItem={item => (
                        <List.Item
                            actions={
                                [<a key="list-loadmore-edit">编辑</a>,
                                <Popconfirm
                                    title="删除后无法恢复，是否确定删除?"
                                    onConfirm={() => handleDelete(item.id)}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <a key="list-loadmore-more">删除</a>
                                </Popconfirm>
                                ]
                            }>
                            <List.Item.Meta
                                avatar={
                                    item.cover ?
                                        <img src={item.cover} width={166} height={110} /> : null
                                }
                                title={<a href="#" style={draftItemTitle}>{item.title ? item.title : '无标题'}</a>}
                                description={
                                    <>
                                        <p style={draftItemContent}>
                                            <span style={draftItemContentContainer}></span>
                                            {item.content ? item.content : ''}
                                        </p>
                                        <p style={{ color: '#646464' }}>{item.creacted_at}</p>
                                    </>
                                }
                            />
                        </List.Item >
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
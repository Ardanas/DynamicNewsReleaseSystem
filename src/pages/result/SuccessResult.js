import React, { useState } from 'react'
import { Row, Col, Divider, Result, Button, List, Skeleton } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useRequest } from '@umijs/hooks';
import api from '../../utils/api';
const { getNews } = api
function SuccessResult({ history }) {
    const [tableData, setTableData] = useState([])
    const { loading } = useRequest(() => getNews(0), {
        onSuccess(res, params) {
            console.log(res)
            if (res.sign === '1') {
                setTableData(res.datas)
            }
        }
    })
    return (
        <Row>
            <Result
                status="success"
                title="发布文章成功"
                extra={[
                    <Button type="primary" key="console" >
                        <Link to='/nav/home'>返回首页</Link>
                    </Button>,
                    <Button key="buy" >
                        <Link to='/fileList/create'>再来一篇</Link>
                    </Button>
                ]}
            />
            { /*显示草稿箱的内容，*/
                tableData.length !== 0 && <Row>
                    <Divider orientation="left"><div style={{ fontSize: 16 }}>您还可以选择继续发布:</div></Divider>
                    <List
                        className='w-100 draft-container'
                        itemLayout="horizontal"
                        dataSource={tableData}
                        renderItem={item => (
                            <Skeleton loading={loading} active avatar>
                                <List.Item className='pointer' onClick={() => history.push(`/fileList/${item.systemid}`)}>
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

                                                    <span>{moment(item.last_time).fromNow()}</span>

                                                </Col>
                                            </Row>
                                        }
                                    />
                                </List.Item >
                            </Skeleton>
                        )}
                    />
                </Row>
            }
        </Row>
    )
}

export default SuccessResult

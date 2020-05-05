import React, { useState, useEffect } from 'react'
import { Row, Col, Skeleton, List, Affix, Drawer, Avatar, Icon } from 'antd'
import { useRequest } from '@umijs/hooks'
import moment from 'moment'
import defaultConfig from '../common/config'
import OutputPreview from '../components/OutputPreview'
import api from '../utils/api';
const { getHomeList } = api
const { channelList } = defaultConfig
function HomePage() {
    const [visible, setVisible] = useState(false)
    const [listValue, setListValue] = useState({})
    const [selectedId, setSelectedId] = useState(0)
    const [listData, setListData] = useState([])
    const { run, loading } = useRequest(getHomeList, {
        manual: true,
        onSuccess(res, params) {
            if (res.sign === '1') {
                setListData(res.datas)
            }
        }
    })
    useEffect(() => {
        console.log(channelList[0].key)
        run(channelList[selectedId].key)
    }, [selectedId])
    const IconText = ({ type, text }) => (
        <span>
            <Icon type={type} style={{ marginRight: 8 }} />
            {text}
        </span>
    );
    const handleListChange = (index) => {
        const listRef = document.querySelectorAll('.channel-item')
        console.dir(listRef)
        for (let i = 0; i < listRef.length; i++) {
            listRef[i].classList.remove('selected')
        }
        setSelectedId(index)
    }
    const handleListClick = (record) => {
        setVisible(true)
        record.created_at = moment(record.last_time).fromNow()
        record.content = record.contentforhtml
        setListValue(record)
    }
    return (
        <Row gutter={16} className='home-container'>

            <Col lg={20} xl={21}>
                <Skeleton loading={loading} active avatar>
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            pageSize: 6
                        }}
                        dataSource={listData}
                        renderItem={item => (
                            <List.Item
                                className='pointer'
                                onClick={() => handleListClick(item)}
                                key={item.systemid}
                                actions={[
                                    <IconText type="star-o" text={0} key="list-vertical-star-o" />,
                                    <IconText type="like-o" text={0} key="list-vertical-like-o" />,
                                    <IconText type="message" text={0} key="list-vertical-message" />,
                                ]}
                                extra={
                                    item.cover ?
                                        <img
                                            width='157'
                                            alt="cover"
                                            src={item.cover}
                                        /> : null
                                }
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatar} />}
                                    title={<a className='bold'>{item.title}</a>}
                                    description={item.jj}
                                />
                                <div className='draft-item-content-container' style={{ maxWidth: '90%' }}>
                                    {item.contentfortext ? String(item.contentfortext).replace(/\s*/g, "").substring(0, 100) : ''}
                                </div>
                            </List.Item>
                        )}
                    />
                </Skeleton>
            </Col>
            <Col lg={4} xl={3} style={{ backgroundColor: '#f4f4f5' }}>
                <Affix offsetTop={10}>
                    {
                        channelList.map((item, index) => {
                            return <div
                                onClick={() => handleListChange(index)}
                                key={item.id}
                                className={['channel-item', 'p-10', 'mb-10', 'pointer', 'text-center', 'fs-14', 'hover', index === selectedId ? 'selected' : ''].join(' ')}>
                                {item.value}
                            </div>

                        })
                    }
                </Affix>


            </Col>
            <Drawer
                width='75%'
                onClose={() => { setVisible(false) }}
                visible={visible}
                bodyStyle={{ padding: '10px 0 80px 0' }}
            >
                <OutputPreview {...listValue} />
            </Drawer>
        </Row>
    )
}

export default HomePage
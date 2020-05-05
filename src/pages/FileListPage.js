import React, { useState } from 'react'
import { useRequest } from '@umijs/hooks'
import { List, Skeleton, Row, Col } from 'antd'
import moment from 'moment'
import api from '../utils/api';
const { getNews } = api

function FileListPage({ history, match }) {
    //console.log(match)
    const [fileList, setFileList] = useState([])
    const [selectedId, setSelectedId] = useState(match.params.id)
    const { loading } = useRequest(() => getNews(0), {
        cacheKey: 'fileList',
        onSuccess(res) {
            setFileList(res.datas)
        }
    })
    const handleListItemClick = (e, item) => {
        e.persist()
        const listRef = document.querySelector('#lise-item-container .ant-list-items')
        for (let i = 0; i < listRef.children.length; i++) {
            listRef.children[i].classList.remove('selected-item')
        }
        setSelectedId(item.systemid)
        //console.dir(item)
        history.push(`/fileList/${item.systemid}`)
    }
    return (
        <>
            <List
                id='lise-item-container'
                className='w-100 filelist-container'
                itemLayout="horizontal"
                dataSource={fileList}
                renderItem={item => (
                    <Skeleton loading={loading} active avatar>
                        <List.Item
                            onClick={(e) => handleListItemClick(e, item)}
                            className={['pointer', 'list-hover', 'p-10', item.systemid === selectedId ? 'selected-item' : ''].join(' ')}>
                            <List.Item.Meta
                                title={<div className='draft-item-title'>{item.title ? item.title : '(无标题)'}</div>}
                                description={
                                    <Row>
                                        <Col style={{ color: 'grey' }}>{moment(item.last_time).fromNow()}</Col>
                                    </Row>
                                }
                            />
                        </List.Item >
                    </Skeleton>
                )}
            />
        </>
    )
}

export default FileListPage
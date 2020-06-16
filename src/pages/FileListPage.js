import React, { useState, useEffect } from 'react'
import { List, Skeleton, Row, Col } from 'antd'
import moment from 'moment'

function FileListPage({ history,listData, listLoading, systemid = '', onChange = null }) {
    const [fileList, setFileList] = useState([])
    const [selectedId, setSelectedId] = useState(systemid)
    useEffect(() => {
        if (listData) {
            setFileList(listData.datas)
        }
    }, [listData])
    const handleListItemClick = (e, item) => {
        e.persist()
        const listRef = document.querySelector('#lise-item-container .ant-list-items')
        for (let i = 0; i < listRef.children.length; i++) {
            listRef.children[i].classList.remove('selected-item')
        }
        setSelectedId(item.systemid)
        // history.push(`/nav/editor?id=${item.systemid}`)
        onChange && onChange(item.systemid)
    }
    return (
        <>
            <List
                id='lise-item-container'
                className='w-100 filelist-container'
                itemLayout="horizontal"
                dataSource={fileList}
                renderItem={item => (
                    <Skeleton loading={listLoading} active avatar>
                        <List.Item
                            onClick={(e) => handleListItemClick(e, item)}
                            className={['pointer', 'list-hover', 'p-10', item.systemid === selectedId ? 'selected-item' : ''].join(' ')}>
                            <List.Item.Meta
                                title={<div className='draft-item-title' title={item.title ? item.title : '(无标题)'}>{item.title ? item.title : '(无标题)'}</div>}
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
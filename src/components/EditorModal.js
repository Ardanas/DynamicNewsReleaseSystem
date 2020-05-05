import React, { useState } from 'react'
import { Row, List, Card, Skeleton } from 'antd'
import { useRequest } from '@umijs/hooks'
import api from '../utils/api';
const { getMaterialList } = api
const Store = window.require('electron-store');
const store = new Store()
function EditorModal({ onChange }) {
    const [selectedList, setSelectedList] = useState([])
    const [fileList, setFileList] = useState([])
    const { loading } = useRequest(getMaterialList, {
        onSuccess(result, params) {
            //console.log(result)
            if (result.sign === '1') {
                setFileList(result.datas)
            }
        }
    });
    const data = [
        {
            id: '1',
            title: 'Title 1',
            type: 'IMAGE',
            url: 'http://localhost:3333/imgs/a.jpg'
        },
        {
            id: '2',
            title: 'Title 2',
            type: 'IMAGE',
            url: 'http://localhost:3333/imgs/b.jpg'
        },
        {
            id: '3',
            title: 'Title 3',
            type: 'IMAGE',
            url: 'http://localhost:3333/imgs/c.jpg'
        },
        {
            id: '4',
            title: 'Title 4',
            type: 'IMAGE',
            url: 'http://localhost:3333/imgs/d.jpg'
        },
        {
            id: '5',
            title: 'Title 5',
            type: 'IMAGE',
            url: 'http://localhost:3333/imgs/e.jpg'
        },
    ];
    const handleCardClick = (e) => {
        e.persist()
        const { target } = e
        const res = JSON.parse(target.dataset.item)
        target.classList.toggle('active');
        const _dataList = target.classList.contains('active') ? [...selectedList, res] : selectedList.filter(item => item.id !== res.id)
        const dataList = _dataList.map(item => {
            return {
                type: 'IMAGE',
                title: 'item.filename',
                url: item.filepath,
                uid: `-${item.systemid}`,
                status: 'done'
            }
        })
        console.log(dataList)
        store.set('selectedMaterialList', dataList)
        setSelectedList(_dataList)
        //onChange && onChange(item)
    }
    return (
        <Row >
            <List
                grid={{ gutter: 10, column: 4 }}
                dataSource={fileList}
                pagination={{
                    defaultCurrent: 1,
                    pageSize: 8,
                    total: fileList.length,
                    position: 'bottom'
                }}
                renderItem={item => (
                    <List.Item>
                        <Skeleton loading={loading}>
                            <Card
                                hoverable
                                bodyStyle={{ padding: 10, height: 136 }}
                                className='editor-modal-item'
                                data-item={JSON.stringify(item)}
                                onClick={handleCardClick}>
                                <img
                                    alt='加载失败'
                                    title={item.filename}
                                    src={item.filepath}
                                    className='w-100 h-100 img-contain'
                                />
                            </Card>
                        </Skeleton>

                    </List.Item>
                )}
            />,
        </Row>
    )
}

export default EditorModal
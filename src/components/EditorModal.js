import React, { useState } from 'react'
import { Row, List, Card, Skeleton } from 'antd'
const Store = window.require('electron-store');
const store = new Store()
function EditorModal({ onChange }) {
    const [selectedList, setSelectedList] = useState([])
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
        console.log(res)
        target.classList.toggle('active');
        const item = target.classList.contains('active') ? [...selectedList, res] : selectedList.filter(item => item.id !== res.id)
        store.set('selectedMaterialList', item)
        setSelectedList(item)
        //onChange && onChange(item)
    }
    return (
        <Row>
            <List
                grid={{ gutter: 10, column: 5 }}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Skeleton loading={false}>
                            <Card
                                hoverable
                                className='editor-modal-item'
                                data-item={JSON.stringify(item)}
                                onClick={handleCardClick}>
                                <img
                                    alt={item.title}
                                    src={item.url}
                                    width='100%'
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
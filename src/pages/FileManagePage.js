import React, { useState } from 'react'
import { Table, Divider, Tag, Icon, Popconfirm, message } from 'antd';
import { Link } from 'react-router-dom'
import mock from '../mock/defaultData'
const { tableData } = mock




function FileManagePage() {
    const tableColumns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: text => <a>{text}</a>
        },
        {
            title: '数据',
            dataIndex: 'address',
            key: 'address',
            render: data => (
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
            render: (tags, record) => (

                <span>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </span>
            ),
        },
        {
            title: '时间',
            dataIndex: 'created_at',
            key: 'created_at'
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a>查看</a>
                    <Divider type="vertical" />
                    <Link to='/nav/editor'>修改</Link>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确定删除吗?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a href="#">删除</a>
                    </Popconfirm>,
                </span>
            ),
        },
    ];
    const [dataSource, setDataSource] = useState(tableData);
    const handleDelete = key => {
        setDataSource(dataSource.filter(item => item.key !== key));
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
    // 当出现滚动条的时候, table 的 表格需要动态计算高度
    return (
        <Table
            rowKey="uid"
            columns={tableColumns}
            dataSource={dataSource}
            pagination={paginationOption}
        />
    )
}


export default FileManagePage;
import React, { useState, useRef } from 'react'
import { Table, Divider, Icon, Popconfirm, Input, Button, Row, Spin, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom'

function TableComponent({ columns = [], tableData = [], loading = false, deleteloading = false, pageSize = 5, onPreview = null }) {
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const inputRef = useRef(null)
    const handlePreview = (e, record) => {
        onPreview && onPreview(record)
    }
    const handleShowRender = (record, text) => {
        return record.fbzt.value ? <a onClick={(e) => handlePreview(e, record)}>{text}</a> : <Link to={`/fileList/${record.systemid}`}>{text || '(无标题)'}</Link>
    }
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={inputRef}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => inputRef.current.select());
            }
        },
        render: (text, record) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    className='highlight-warpper'
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : handleShowRender(record, text)
    })


    const tableColumns = columns.map(item => {
        if (item.isGetColumnSearchProps) {
            return { ...item, ...getColumnSearchProps(item.dataIndex) }
        }
        return item
    })

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('')
    };


    const handlePaginationChange = (pageNo, pageSize) => {
        console.log(pageNo, pageSize);
    }

    const paginationOption = {
        pageSize,
        total: tableData.length,
        onChange: handlePaginationChange
    }

    // 当出现滚动条的时候, table 的 表格需要动态计算高度
    if (loading) {
        return (
            <Row type='flex' justify='center'>
                <Spin />
            </Row>
        )
    }
    return (
        <>
            <Table
                loading={deleteloading}
                rowKey={record => record.systemid}
                columns={tableColumns}
                pagination={paginationOption}
                dataSource={tableData}
            />
        </>
    )
}


export default TableComponent;
import React from 'react'
import { Table } from 'antd'

function ShowTable({ columns, data }) {
    return (
        <Table columns={columns} dataSource={data} />
    )
}

export default ShowTable
import React, { useState } from 'react'
import { Divider, Tag, Icon, Spin, Row } from 'antd';
import moment from 'moment'
import { useRequest } from '@umijs/hooks';
import api from '../utils/api';
import TableComponent from '../components/TableComponent'
const { getNews } = api

function FileManagePage({ tableData = [], loading = false, tableColumns = [], navigationUrl = '/nav/editor' }) {
   

    // 当出现滚动条的时候, table 的 表格需要动态计算高度

    const props = {
        loading: loading,
        columns: tableColumns,
        tableData
    }
    if (loading) {
        return (
            <Row type='flex' justify='center'>
                <Spin />
            </Row>
        )
    }
    return (
        <TableComponent {...props} />
    )

}


export default FileManagePage;
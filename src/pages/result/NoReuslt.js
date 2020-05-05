import React from 'react'
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom'


function NoResult() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="对不起, 您访问的资源不存在"
            extra={<Button type="primary"><Link to='/nav/create'>返回首页</Link></Button>}
        />
    )
}

export default NoResult
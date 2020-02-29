import React from 'react'
import { Upload, Icon, Button } from 'antd'
const { Dragger } = Upload;
function RelesePage() {
    const bgUrl = 'https://hbimg.huabanimg.com/00d3c315c51e99e038bbfe931b370e0bdd3666547e14-ZyNI86_fw658'
    return (
        <Dragger style={{ backgroundImage: `url(${bgUrl})` }}>
            <Button type="primary" shape="round" icon="upload" size='large' >
                上传文件
            </Button>
        </Dragger>

    )
}


export default RelesePage;
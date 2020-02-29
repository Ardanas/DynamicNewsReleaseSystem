import React, { useState } from 'react'
import { Row, Radio, Col, Switch, Icon, Tooltip } from 'antd'
function BasicSettingPage() {
    const [editorValue, setEditorValue] = useState(1)
    const handleEditorChange = (e) => {
        const { value } = e.target;
        setEditorValue(value)
    }
    const handleModeChange = (data) => {
        console.log(data)

    }
    return (
        <>
            <Row style={{ marginBottom: 24 }} >
                <Col span={4} style={{ textAlign: 'center', fontSize: 14, color: '#333' }}>常用编辑器</Col>
                <Col span={16}>
                    <Radio.Group value={editorValue} onChange={handleEditorChange}>
                        <Radio value={1}>富文本编辑器</Radio>
                        <Radio value={2}>Markdown</Radio>
                    </Radio.Group>
                </Col>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={4} style={{ textAlign: 'center', fontSize: 14, color: '#333' }}>夜间模式</Col>
                <Col span={16}>
                    <Switch checkedChildren="开" unCheckedChildren="关" onChange={handleModeChange} />
                </Col>
            </Row>
            <Row style={{ marginBottom: 24 }}>
                <Col span={4} style={{ textAlign: 'center', fontSize: 14, color: '#333' }}>上传至素材库</Col>
                <Col span={16} style={{ display: 'flex', alignItems: 'center' }}>
                    <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={handleModeChange} />
                    <Tooltip title="默认上传的资源会存储到素材库">
                        <Icon type="question-circle" theme="filled" style={{ fontSize: 18, color: '#40a9ff', marginLeft: 20 }} />
                    </Tooltip>
                </Col>
            </Row>
        </>
    )
}

export default BasicSettingPage
import React from 'react'
import { Badge, Icon, Row, Col, Button, Tabs, Statistic } from 'antd'
import FileManagePage from './FileManagePage'
import DraftPage from './DraftPage'
import { Link } from 'react-router-dom'
const { TabPane } = Tabs;
function RelesePage() {
    return (
        <>
            <Row type="flex" justify='space-around' style={{ height: 100 }}>

                <Col span={8} style={{ borderRadius: 5, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    <Link to='/nav/editor/p/1237123123'>
                        <Button type="primary" shape="round" icon="upload" size='large'>
                            发布内容
                        </Button>
                    </Link>
                </Col>
                <Col span={15} style={{ borderRadius: 5, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>

                    <Col span={8}>
                        <Statistic title="阅读量" value={112893} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="关注数" value={112893} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="发布量" value={112893} />
                    </Col>

                </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
                <Col span={24} >
                    <Tabs defaultActiveKey="1" size='large'>
                        <TabPane tab={
                            <span>
                                全部 <span style={{color: '#ccc'}}>(11)</span>
                            </span>
                        } key="1">
                            <FileManagePage />
                        </TabPane>
                        <TabPane tab="已发布" key="2">
                            <FileManagePage />
                        </TabPane>
                        <TabPane tab="未发布" key="3">
                            <FileManagePage />
                        </TabPane>
                        <TabPane tab="草稿箱" key="4">
                            <DraftPage />
                        </TabPane>
                    </Tabs>

                </Col>

            </Row>
        </>
    )
}


export default RelesePage;


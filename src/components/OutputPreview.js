import React from 'react'
import { Row, Col, Avatar, Divider, Icon } from 'antd'
import 'braft-editor/dist/output.css'
const user_info = JSON.parse(localStorage.getItem('user_info'))
function OutputPreview({
    cover = null,
    title = '',
    jj = '',
    content = '',
    created_at = '',
    lylx = 0,
    sfjzzz = null,
    zzsm = null,
    avatar = null,
    username = ''
}) {
    return (
        <>
            {
                cover && (
                    <div className='output-cover'>
                        <img src={cover} alt="加载失败" />
                    </div>
                )
            }
            <div style={{ padding: '0 24px' }}>
                <div className='input-style-base title-input-style output-title'>{title || '无标题'}</div>
                <Row className='author-info' type='flex' align='middle' justify='space-between'>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={avatar || user_info.avatar} size='large' />
                        <span style={{ paddingLeft: 10 }}>{username || user_info.username}</span>
                        <Divider type="vertical" />
                        <span>{created_at}</span>
                        <Divider type="vertical" />
                        {
                            !lylx ?
                                (
                                    sfjzzz ?
                                        <div>
                                            <Icon type="stop" rotate={90} style={{ color: '#fd676f', fontWeight: 'blod' }} />
                                            <span style={{ paddingLeft: 10 }}>{'未经作者允许, 禁止转载'}</span>
                                        </div> : null
                                ) : (<span>转载于: {zzsm}</span>)
                        }
                    </Col>
                    <Col style={{ margin: 'auto 0' }}>
                        <span>阅读量50+</span>
                    </Col>
                </Row>
                <div className='output-intro' >
                    <p>{jj || '无简介'}</p>
                </div>
                <Row className="braft-output-content output-content" dangerouslySetInnerHTML={{ __html: content }}></Row>
            </div>

        </>
    )
}

export default OutputPreview
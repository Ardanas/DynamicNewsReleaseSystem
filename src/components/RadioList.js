import React from 'react'
import { Row, Col, Radio } from 'antd'

function RadioList({ dataLists = [], defaultRadioValue = '', buttonStyle = 'solid', onChange = null }) {
    
    const listItems = dataLists.map((item, index) => {
        return (
            <Col span={4} key={item.id}>
                <Radio.Button 
                    value={item.key} 
                    style={{ width: '100%', textAlign: 'center' }}
                >
                    {item.value}
                </Radio.Button>
            </Col>
        )
    })
    const handleRadioChange = e => {
        //console.log(e)
        onChange && onChange(e)
    }
    return (
        <Row gutter={[8, 16]}>
            <Radio.Group 
                defaultValue={defaultRadioValue} 
                buttonStyle={buttonStyle} 
                style={{ width: '100%' }} 
                onChange={handleRadioChange}
            >
                {listItems}
            </Radio.Group>
        </Row>
    )
}

export default RadioList
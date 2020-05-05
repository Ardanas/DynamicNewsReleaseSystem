import React from 'react'
import { Row, Col, Radio } from 'antd'

function RadioList({ dataLists = [], defaultRadioValue = 'a', buttonStyle = 'solid', onChange = null }) {
    const listItems = dataLists.map((item, index) => {
        return (
            <Col span={4} key={item.id}>
                <Radio.Button 
                    value={item.key} 
                    className='w-100'
                    style={{ textAlign: 'center' }}
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
                value={defaultRadioValue} 
                buttonStyle={buttonStyle} 
                className='w-100'
                //style={{ width: '100%' }} 
                onChange={handleRadioChange}
            >
                {listItems}
            </Radio.Group>
        </Row>
    )
}

export default RadioList
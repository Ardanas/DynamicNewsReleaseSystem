import React, { useState } from 'react'
import { Radio, Row } from 'antd'
function RadioComponent({ values = [], defaultValue = '', onChange = null }) {

    const onRadioChange = (e) => {
        const { value } = e.target;
        setRadioValue(value)
        onChange && onChange(value)
    }
    const [radioValue, setRadioValue] = useState(defaultValue)
    return (
        <>
            <Radio.Group onChange={onRadioChange} value={radioValue}>
                {
                    values.map(item => {
                        return (
                            <Radio key={item.id} value={item.key}>{item.value}</Radio>
                        )
                    })
                }
            </Radio.Group>
            <Row style={{ marginTop: 10 }}>
                {
                    values.map(item => {
                        if (item.key === radioValue) {
                            return (
                                item.component
                            )
                        }
                    })
                }
            </Row>
        </>
    )
}

export default RadioComponent
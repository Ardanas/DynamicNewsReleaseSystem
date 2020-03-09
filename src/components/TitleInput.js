import React, { useState, useRef } from 'react'
import { Row, Col } from 'antd'

function TitleInput({
    onChange = null,
    placeholder = '',
    maxLength = 50,
    compClass = '',
    defaultHeigt = 44
}) {
    const [inputValue, setInputValue] = useState('')
    const titleInputRef = useRef()
    const handleChange = (e) => {
        e.persist();
        setInputValue(e.target.value)
        titleInputRef.current.style.height = isNaN(defaultHeigt) ? defaultHeigt : `${defaultHeigt}px`
        if (titleInputRef.current.scrollHeight >= titleInputRef.current.offsetHeight) {
            titleInputRef.current.style.height = titleInputRef.current.scrollHeight + 'px'
        }
    }
    const handleBlur = (e) => {
        e.persist();
        console.log(e.target.value)
        onChange && onChange(e.target.value)
    }
    return (
        <Row type='flex'>
            <Col span={22} style={{ display: 'flex', alignItems: 'center' }}>
                <textarea
                    className={`input-style-base ${compClass}`}
                    ref={titleInputRef}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={(e) => handleBlur(e)}
                />
            </Col>
            <Col span={2}>
                <span className='input-hit-word-sytle'>{`(${inputValue.trim().length}/${maxLength})`}</span>
            </Col>

        </Row>
    )
}

export default TitleInput
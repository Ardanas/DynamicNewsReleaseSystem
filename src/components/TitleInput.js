import React, { useState, useRef, useEffect } from 'react'
import { Row, Col } from 'antd'

function TitleInput({
    onBlur = null,
    onChange = null,
    placeholder = '',
    maxLength = 50,
    compClass = '',
    defaultHeigt = 44,
    defaultValue = ''
}) {
    //console.log(defaultValue==='')
    const titleInputRef = useRef()
    //const [inputValue, setInputValue] = useState(defaultValue)
    const [isChange, setIsChange] = useState(false)
    useEffect(() => {
        console.log(defaultValue)
        console.log(titleInputRef.current.value)
        titleInputRef.current.value = defaultValue
        autoScrollHeight()
    }, [defaultValue !== ''])
    const autoScrollHeight = () => {
        titleInputRef.current.style.height = isNaN(defaultHeigt) ? defaultHeigt : `${defaultHeigt}px`
        if (titleInputRef.current.scrollHeight >= titleInputRef.current.offsetHeight) {
            titleInputRef.current.style.height = titleInputRef.current.scrollHeight + 'px'
        }
    }
    const handleChange = (e) => {
        setIsChange(true)
        autoScrollHeight()
        onChange && onChange(e.target.value)
    }
    const handleBlur = (e) => {
        //console.log(e.target.value)
        onBlur && onBlur(e.target.value)
    }
    const length = (!isChange ? defaultValue : titleInputRef.current.value).trim().length
    return (
        <Row type='flex'>
            <Col span={22} style={{ display: 'flex', alignItems: 'center' }}>
                <textarea
                    className={`input-style-base ${compClass}`}
                    ref={titleInputRef}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    onChange={(e) => handleChange(e)}
                    onBlur={(e) => handleBlur(e)}
                />
            </Col>
            <Col span={2}>
                <span className='input-hit-word-sytle'>{`(${length}/${maxLength})`}</span>
            </Col>

        </Row>
    )
}

export default TitleInput
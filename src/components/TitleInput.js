import React, { useState, useRef } from 'react'


const inputStyle = {
    width: '100%',
    height: 44,
    outlineStyle: 'none',
    overflowY: 'hidden',
    border: 0,
    fontSize: 32,
    fontWeight: 600,
    resize: 'none',
    lineHeight: 1.4,
    paddingRight: 55
};
const inputHitWordSytle = {
    position: 'absolute',
    right: 0,
    bottom: 0
}
const limitTitleNumber = 50
function TitleInput({ onChange = null }) {
    const [inputValue, setInputValue] = useState('')
    const titleInputRef = useRef()
    const handleChange = (e) => {
        e.persist();
        setInputValue(e.target.value)
        onChange && onChange(e.target.value)
        titleInputRef.current.style.height = '44px'
        if (titleInputRef.current.scrollHeight >= titleInputRef.current.offsetHeight) {
            titleInputRef.current.style.height = titleInputRef.current.scrollHeight + 'px'
        }
    }
    return (
        <div style={{ position: 'relative' }}>
            <textarea
                ref={titleInputRef}
                maxLength={limitTitleNumber}
                placeholder='请输入标题'
                value={inputValue}
                onChange={handleChange}
                style={inputStyle} />
            <span style={inputHitWordSytle}>{`(${inputValue.trim().length}/${limitTitleNumber})`}</span>

        </div>
    )
}

export default TitleInput
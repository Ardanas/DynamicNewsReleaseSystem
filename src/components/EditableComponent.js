import React, { useState, useRef } from 'react'
import { Row, Col, Icon, Divider, notification } from 'antd'
function EditableComponent({ label, content }) {
    const [isEditor, setIsEditor] = useState(false)
    const editorRef = useRef()
    const handleEditChange = () => {
        console.dir(editorRef.current)
        const obj = editorRef.current;
        const selection = window.getSelection();
        const range = document.createRange();
        if (editorRef.current.innerText.length !== 0) {
            setTimeout(() => {
                range.setStart(obj, 1);
                range.setEnd(obj, 1);
                selection.removeAllRanges();
                selection.addRange(range);
            }, 0);
        }
        setIsEditor(true)

    }
    const baseStyle = {
        border: 0,
        outline: 0
    }
    const editStyle = {
        display: 'flex',
        alignItems: 'center',
        width: '95%',
        height: 32,
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.65)',
        padding: '0 10px',
        lineHeight: 2.2,
        border: '1px solid #d9d9d9',
        borderRadius: 4,
        outline: 0,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        WebkitUserSelect: 'auto'
    }
    const handleSave = () => {
        //改写数据库，成功后改写状态
        //如果修改的值和原本的值没有变化，不修改
        //用户名仅支持中英文，数字和下划线
        //email ^[/w-]+(/.[/w-]+)*@[/w-]+(/.[/w-]+)+$
        //电话号码： (d+-)?(d{4}-?d{7}|d{3}-?d{8}|^d{7,8})(-d+)?
        let item = editorRef.current.innerText;
        const rule = /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,16}$/
        if (!rule.test(item)) {
            handleNotification('修改失败', `用户名只能由中英文、数字、下划线组成且长度不能小于4和超过16`, 2.5, 'error')
        } else {
            if (item !== content) {
                handleNotification('成功', '修改成功', 2.5, 'success')
            }
            setIsEditor(false);
        }
    }
    const handleNotification = (message, description, duration, type = 'open') => {
        notification[type]({
            message,
            description,
            duration
        });
    }
    const handleCancel = () => {
        editorRef.current.innerText = content; //初始化值
        setIsEditor(false)
    }
    const handleKeyDown = (e) => {
        e.persist()
        const { keyCode } = e
        if (keyCode == 13) {
            handleSave()
        }
    }
    const handleBlur = () => {
        if (editorRef.current.innerText === content) {
            setIsEditor(false)
        }
    }
    return (
        <Row type='flex' align='middle'>
            <Col span={4} style={{ textAlign: 'center', fontSize: 14, color: '#333' }}>
                {label}
            </Col>
            <Col span={16}>
                <p
                    contenteditable={isEditor.toString()}
                    style={isEditor ? editStyle : baseStyle}
                    ref={editorRef}
                    onClick={handleEditChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                >{content}</p>
            </Col>
            <Col span={4} style={{ textAlign: 'center', fontSize: 14 }}>
                {
                    !isEditor ? <a onClick={handleEditChange}>
                        <Icon type="edit" />  修改
                    </a> :
                        <div>
                            <a onClick={handleSave}>保存</a>
                            <Divider type="vertical" />
                            <a style={{ color: '#333' }} onClick={handleCancel}>取消</a>
                        </div>
                }
            </Col>
        </Row>
    )
}

export default EditableComponent
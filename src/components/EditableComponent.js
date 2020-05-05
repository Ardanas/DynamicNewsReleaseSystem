import React, { useState, useRef, useEffect } from 'react'
import { Row, Col, Icon, Divider, Spin, notification, message } from 'antd'
import { useRequest } from '@umijs/hooks';
import api from '../utils/api';
import { handleNotification } from '../utils';
const { updateProfile } = api
const antIcon = <Icon type="loading" />
function EditableComponent({ label, content, name = '', placeholder = '(请填写)', type = 'text', operation = true, onBlur = null, isClear = false }) {
    //console.log('content', content)
    const [isEditor, setIsEditor] = useState(false)
    //const [inputVal, setInputVal] = useState(content)
    const editorRef = useRef()
    const { run, loading } = useRequest(updateProfile, {
        manual: true,
        onSuccess(result, params) {
            if (result.sign === '1') {
                handleNotification('成功', '修改成功', 'success');
                setIsEditor(false);
            }
        },
        onError() {
            handleNotification('失败 ', '修改失败，请联系管理员', 'error')
        }
    })
    useEffect(() => {
        if (isClear) {
            editorRef.current.value = '';
            setIsEditor(false)
        }
    })

    const handleEditChange = () => {
        //console.dir(editorRef.current)
        //const obj = editorRef.current;
        //const selection = window.getSelection();
        //const range = document.createRange();
        /*if (inputVal.length !== 0) {
            setTimeout(() => {
                range.setStart(obj, 1);
                range.setEnd(obj, 1);
                selection.removeAllRanges();
                selection.addRange(range);
            }, 0);
        }*/
        if (name == 'email') {
            message.info('功能开发中, 暂不支持修改...')
        } else {
            setIsEditor(true)
        }


    }
    const handleRule = (key) => {
        switch (key) {
            case 'username':
                return {
                    rule: /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,16}$/,
                    errorTip: '用户名仅支持中英文，数字和下划线，且长度在4-16'
                }
            case 'email':
                return {
                    rule: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                    errorTip: '请输入正确的邮箱格式'
                }
            case 'phone':
                return {
                    rule: /^[1][3,4,5,7,8,9][0-9]{9}$/,
                    errorTip: '请输入正确的电话号码'
                }
            default:
                return {};
        }
    }
    const handleSave = () => {
        //改写数据库，成功后改写状态
        //如果修改的值和原本的值没有变化，不修改
        //用户名仅支持中英文，数字和下划线
        //email ^[/w-]+(/.[/w-]+)*@[/w-]+(/.[/w-]+)+$
        //电话号码： ^[1][3,4,5,7,8,9][0-9]{9}$
        //let item = editorRef.current.innerText;
        const item = editorRef.current.value;
        const { rule = '', errorTip = '' } = handleRule(name)
        console.log(item)
        console.log(rule)
        if (rule && rule !== '') {
            if (!rule.test(item)) {
                handleNotification('修改失败', errorTip, 'error')
                return;
            }
        }
        //console.log(inputVal !== content)
        if (editorRef.current.value !== content) {
            run({ key: name, value: editorRef.current.value })
        } else {
            setIsEditor(false)
        }


    }
    /*const handleNotification = (message, description, duration = 2.5, type) => {
        notification[type]({
            message,
            description,
            duration
        });
    }*/
    const handleCancel = () => {
        editorRef.current.value = content; //初始化值
        //setInputVal(content)
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
        /*if (editorRef.current.innerText === content) {
            setIsEditor(false)
        }*/
        //console.dir(editorRef.current.value)
        //console.log(content)
        if (editorRef.current.value === content || editorRef.current.value === '') {
            setIsEditor(false)
            editorRef.current.value = content; //初始化值
        } else {
            onBlur && onBlur(editorRef.current.value)
        }
    }
    return (
        <Row type='flex' align='middle'>
            <Col span={operation ? 3 : 4} className='text-center fs-14' style={{ color: '#333' }}>
                {label}
            </Col>
            <Col span={operation ? 15 : 19} className='editable-input'>
                <input
                    type={type}
                    //value={inputVal}
                    defaultValue={content}
                    disabled={name === 'email'}
                    placeholder={content ? null : placeholder}
                    //suppressContentEditableWarning
                    //contentEditable={isEditor.toString()}
                    //style={{ backgroundColor: 'rgb(247,247,247)' }}
                    className={['w-100', isEditor ? 'editable-style' : 'editable-base'].join(' ')}
                    ref={editorRef}
                    /*onChange={(e) => {
                        e.persist()
                        console.log(e)
                        setInputVal(e.target.value)
                    }}*/
                    onClick={handleEditChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            </Col>
            {
                operation && <Col span={5} className='fs-14 text-center'>
                    {
                        !isEditor ? <a onClick={handleEditChange}>
                            <Icon type="edit" />  修改
                    </a> :
                            <div>
                                <Spin indicator={antIcon} spinning={loading} />
                                <a onClick={handleSave}>保存</a>
                                <Divider type="vertical" />
                                <a style={{ color: '#333' }} onClick={handleCancel}>取消</a>
                            </div>
                    }
                </Col>
            }
        </Row>
    )
}

export default EditableComponent
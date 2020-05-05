import React, { useState } from 'react'
import useForm from 'rc-form-hooks';
import { Row, Button, Form, Input } from 'antd';
import { useRequest, useScroll } from '@umijs/hooks'
import EditableComponent from '../../components/EditableComponent'
import { handleNotification } from '../../utils'
import api from '../../utils/api'
const { updatePassword } = api
function PasswordModifyPage() {
    const { getFieldDecorator, validateFields, setFieldsValue, resetFields, errors, values } = useForm();
    const [isClear, setIsClear] = useState(false)
    const { run, loading } = useRequest(updatePassword, {
        manual: true,
        onSuccess(res, params) {
            if (res.sign === '0') {
                handleNotification('提示', '旧密码错误', 'warning')
            } else if (res.sign === '1') {
                handleNotification('提示', '修改成功', 'success')
                resetFields()
                setIsClear(true)
            }
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(values)
        const { old_password, new_password, re_new_password } = values
        if (old_password === '' || new_password === '' || re_new_password === '') {
            handleNotification('提示', '提交信息不能为空', 'warning')
        } else if (!handleRule(old_password) || !handleRule(new_password) || !handleRule(re_new_password)) {
            handleNotification('提示', '只能输入6-20个字母、数字、下划线', 'warning')
        } else if (old_password === new_password) {
            handleNotification('提示', '新密码和旧密码不能相同', 'warning')
        } else if (new_password !== re_new_password) {
            handleNotification('提示', '两次输入的密码不一致', 'warning')
        } else {
            run({ old_password, new_password, re_new_password })
        }
    }
    const handleRule = (data) => {
        const patrn = /^(\w){6,20}$/;
        return patrn.exec(data) ? true : false
    }
    const handleSetFieldsValue = (key, value) => {
        setFieldsValue({
            [key]: value
        })
    }
    return (
        <Form onSubmit={handleSubmit} hideRequiredMark >
            <Form.Item key='old_password' className='mb-10'>
                {getFieldDecorator('old_password', {
                    rules: [
                        { required: true, message: '不能为空' },
                        { min: 6, max: 22, message: "密码长度在6-22" }
                    ],
                    initialValue: ''
                })(
                    <EditableComponent
                        label='旧密码'
                        placeholder='请输入原密码'
                        type='password'
                        operation={false}
                        isClear={isClear}
                        onBlur={(value) => handleSetFieldsValue('old_password', value)}
                    />
                )}
            </Form.Item>
            <Form.Item key='new_password' className='mb-10'>
                {getFieldDecorator('new_password', {
                    rules: [
                        { required: true, message: '不能为空' },
                        { min: 6, max: 22, message: "密码长度在6-22" }
                    ],
                    initialValue: ''
                })(
                    <EditableComponent
                        label='新密码'
                        placeholder='请输入新密码'
                        type='password'
                        operation={false}
                        isClear={isClear}
                        onBlur={(value) => handleSetFieldsValue('new_password', value)}
                    />
                )}
            </Form.Item>
            <Form.Item key='re_new_password' className='mb-10'>
                {getFieldDecorator('re_new_password', {
                    rules: [
                        { required: true, message: '不能为空' },
                        { min: 6, max: 22, message: "密码长度在6-22" }
                    ],
                    initialValue: ''
                })(
                    <EditableComponent
                        label='确认新密码'
                        placeholder='确认新密码'
                        type='password'
                        operation={false}
                        isClear={isClear}
                        onBlur={(value) => handleSetFieldsValue('re_new_password', value)}
                    />
                )}
            </Form.Item>
            <Form.Item key='submit' className='text-center'>
                <Button type="primary" htmlType="submit" className='mt-20' style={{ width: '40%' }}>
                    保存修改
                </Button>
            </Form.Item>
        </Form>
    )
}

export default PasswordModifyPage
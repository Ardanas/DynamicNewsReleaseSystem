import React, { useState, useEffect } from 'react'
import useForm from 'rc-form-hooks';
import { Form, Icon, Input, Button, Row, message, notification } from 'antd';
import { useRequest } from '@umijs/hooks'
import moment from 'moment';
import api from '../utils/api';
const { sendMailCode, register } = api
const { ipcRenderer } = window.require('electron')
function RegisterPage({ history }) {
    const { getFieldDecorator, validateFields, setFieldsValue, errors, values } = useForm();
    const [isSendCode, setIsSendCode] = useState(false)
    const [count, setCount] = useState(60)
    const { run: sendRun } = useRequest(sendMailCode, {
        manual: true,
        onSuccess(res, params) {
            if (res.code == 1 && res.errCode) {
                notification.info({
                    message: res.message || '提醒',
                    description: res.errMsg,
                });
            } else {
                setIsSendCode(true)
            }
        }
    })
    const { run: regRun, loading } = useRequest(register, {
        manual: true,
        onSuccess(res, params) {
            console.log(res)
            if (res.code == 1 && res.errCode) {
                notification.info({
                    message: res.message || '提醒',
                    description: res.errMsg,
                });
            } else {
                message.info('注册成功');
                setTimeout(() => {
                    history.push('/login')
                }, 1000)
            }
        }
    })
    useEffect(() => {
        let timer = null
        if (isSendCode) {
            timer = setInterval(() => {
                setCount(n => {
                    /*if (n === 1) {
                        clearInterval(timer);
                        setIsSendCode(false)
                        return 60
                    }*/
                    if (n > 0) {
                        return n - 1
                    } else {
                        setIsSendCode(false)
                        clearInterval(timer);
                        return 60
                    }

                })
            }, 1000);
        }
        return () => clearInterval(timer)
    }, [isSendCode])

    const handleSendCode = () => (
        validateFields(['email']).then(() => {
            sendRun({ username: values.username, email: values.email })
        }).catch(err => {
            message.warning('请输入正确邮箱再发送')
        })
    )
    const handleIpc = (type) => {
        ipcRenderer.send(type);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(values)
        validateFields()
            .then(res => {
                console.log(res)
                regRun({ ...res, time: moment().format('YYYY-MM-DD HH:mm:ss') })
            })
            .catch(err => {
                console.log(err)
            });
    }

    return (
        <div className='reg-container'>
            <div className="reg-header">
                <span style={{ color: '#999' }} onClick={() => handleIpc('minimize-login-window')}><Icon type="minus" /></span>
                <span style={{ color: '#999' }} onClick={() => handleIpc('close-login-window')}><Icon type="close" /></span>
            </div>
            <Row type='flex' align='bottom' justify='center' className='drag' style={{ WebkitUserSelect: 'none', height: '100%' }}>
                <Form onSubmit={handleSubmit} className="no-drag"
                    style={{ width: 300 }}>
                    <Form.Item className='mb-10'>
                        {getFieldDecorator('username', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '请输入用户名' },
                                { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,16}$/, message: "仅支持中英文，数字和下划线，且长度在4-16" }
                            ],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入用户名"
                            />
                        )}
                    </Form.Item>
                    <Form.Item className='mb-10'>
                        {getFieldDecorator('password', {
                            rules: [
                                { required: true, message: '请输入密码(不少于6位)' },
                                { min: 6, max: 22, message: "密码长度在6-22" }
                            ],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请输入密码(不少于6位)"
                            />
                        )}
                    </Form.Item>
                    <Form.Item className='mb-10'>
                        {getFieldDecorator('email', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '请输入邮箱' },
                                { pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: "请输入正确的邮箱号" }
                            ],
                        })(
                            <Input
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入邮箱"
                            />
                        )}
                    </Form.Item>
                    <Form.Item className='mb-10'>
                        {getFieldDecorator('ecode', {
                            rules: [
                                { required: true, message: '请输入验证码' }
                            ],
                        })(
                            <Input
                                suffix={
                                    <a
                                        className={isSendCode ? 'send-code' : ''}
                                        onClick={handleSendCode}>
                                        {!isSendCode ? '获取验证码' : `${count}s后重发`}
                                    </a>
                                }
                                maxLength={6}
                                placeholder="请输入验证码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item className='mb-0'>
                        <Button type="primary" htmlType="submit" loading={loading} className="login-form-button" style={{ width: '100%' }}>
                            注册
                        </Button>
                        <a href="/login">已有账号, 立即登录!</a>
                    </Form.Item>
                </Form>
            </Row>
        </div>
    )
}

export default RegisterPage
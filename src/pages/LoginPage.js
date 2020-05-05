import React from 'react'
import useForm from 'rc-form-hooks';
import { Form, Icon, Input, Button, Row, Col, Modal } from 'antd';
import { useRequest } from '@umijs/hooks';
import api from '../utils/api';
const { login } = api
const { ipcRenderer, remote } = window.require('electron')

function LoginPage({ history }) {
    let timer = null
    //console.log(remote.getCurrentWindow().getSize())
    const { getFieldDecorator, validateFields, setFieldsValue, errors, values } = useForm();
    const { run, loading } = useRequest(login, {
        manual: true,
        onSuccess(res, params) {
            console.log(res)
            if (res.status === 200 && res.code === 1) {
                localStorage.setItem('token', res.access_token)
                localStorage.setItem('user_info', JSON.stringify(res.user))
                handleIpc('open-main-window')

                /*let item = remote.getCurrentWindow().getSize()[1];
                //console.log(item)
                clearInterval(timer);
                timer = setInterval(function () {
                    if (item <= 0) {
                        clearInterval(timer);
                        
                    } else {
                        //pic.style.width = pic.offsetWidth + speed + "px";
                        //item = item - 10
                        item = item - 50
                        console.log(item)
                        remote.getCurrentWindow().setSize(item, 330)
                    }
                }, 500)*/

            } else if (res.errCode) {
                Modal.error({
                    title: '提示',
                    content: res.errMsg
                })
            }
        }
    })
    const handleIpc = (type) => {
        ipcRenderer.send(type);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        validateFields()
            .then(res => {
                console.log(res)
                run(res)
            })
            .catch(err => {
                console.log(err)
            });
    }
    return (
        <Row className='login-container' id='login-container'>
            <div className="login-header-bg"></div>
            <div className="login-header">
                <span onClick={() => handleIpc('minimize-login-window')}><Icon type="minus" /></span>
                <span onClick={() => handleIpc('close-login-window')}><Icon type="close" /></span>
            </div>
            <Row type='flex' align='middle' justify='center' className='login-box drag' style={{ WebkitUserSelect: 'none' }}>
                <Form onSubmit={handleSubmit}
                    className="login-form no-drag mt-10"
                    style={{ width: 300 }}>
                    <Form.Item className='mb-10'>
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Please input your email!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入邮箱"
                            />
                        )}
                    </Form.Item>
                    <Form.Item className='mb-10'>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请输入密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>

                        <Button type="primary" htmlType="submit" className="login-form-button w-100">
                            登录
                        </Button>
                        <a href="/register">立即注册!</a> Or
                        <a className="login-form-forgot" href="">
                            忘记密码
                        </a>
                    </Form.Item>
                </Form>

            </Row>
        </Row>
    )
}

export default LoginPage
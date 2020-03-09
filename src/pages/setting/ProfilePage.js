import React from 'react'
import { Form, Row, Col, Button, Avatar } from 'antd';
import useForm from 'rc-form-hooks';
import { useRequest } from '@umijs/hooks';
import EditableComponent from '../../components/EditableComponent'
import api from '../../utils/api';
const { updateProfile, getProfile } = api
function ProfilePage() {
    const { getFieldDecorator, validateFields, setFieldsValue, errors, values } = useForm();
    const { run, loading: updateLoading } = useRequest(updateProfile, {
        manual: true,
        onSuccess() {
            //上传图片
        }
    })
    const { data, error } = useRequest(getProfile)
    const handleSubmit = (e) => {
        console.log(values)
        e.preventDefault();
        validateFields()
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            });
    };
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 2 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
        },
    };
    const s = {
        border: 0,
        outline: 0
    }
    return (
        <Form onSubmit={handleSubmit} {...formItemLayout}>
            <Form.Item key='avatar'>
                {getFieldDecorator('avatar')
                    (
                        <Row style={{ marginLeft: 10 }}>
                            <Col span={5}>
                                <Avatar
                                    shape="square"
                                    size={90}
                                    src='https://i.loli.net/2020/02/16/4lt8NdM9yAZ3sLW.jpg' />
                            </Col>
                            <Col span={16}>
                                <p>支持 jpg、png 格式大小 5M 以内的图片</p>
                                <Button type='primary'>点击上传</Button>
                            </Col>
                        </Row>

                    )
                }
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('username')(
                    <EditableComponent content='qweqwe' label='用户名' key='username' />
                )}
            </Form.Item>
            <Form.Item >
                {getFieldDecorator('email')(
                    <EditableComponent content='719481334@qq.com' label='邮箱' key='email' />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('phone')(
                    <EditableComponent content='15975631649' label='电话' key='phone' />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('briefContent')(
                    <EditableComponent content='nice 啊 马飞' label='简介' key='introduction'/>
                )}
            </Form.Item>
        </Form>
    )
}

export default ProfilePage
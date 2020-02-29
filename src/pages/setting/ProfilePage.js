import React from 'react'
import { Form, Input, Icon, Select, Row, Col, Button, Avatar } from 'antd';
import useForm from 'rc-form-hooks';
import EditableComponent from '../../components/EditableComponent'

function ProfilePage() {
    const { getFieldDecorator, validateFields, setFieldsValue, errors, values } = useForm();
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
            <Form.Item >
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
                    <EditableComponent content='qweqwe' label='用户名' />
                )}
            </Form.Item>
            <Form.Item >
                {getFieldDecorator('email')(
                    <EditableComponent content='719481334@qq.com' label='邮箱' />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('phone')(
                    <EditableComponent content='15975631649' label='电话' />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('briefContent')(
                    <EditableComponent content='nice 啊 马飞' label='简介' />
                )}
            </Form.Item>
        </Form>
    )
}

export default ProfilePage
import React, { useState } from 'react'
import { Row, Col, Avatar, message, Spin } from 'antd';
import { useRequest } from '@umijs/hooks';
import EditableComponent from '../../components/EditableComponent'
import UploadImage from '../../components/UploadImage'
import api from '../../utils/api';
const { updateProfile, getProfile } = api
const user_info = JSON.parse(localStorage.getItem('user_info'))
function ProfilePage() {

    const [avatar, setAvatar] = useState('')
    const [userInfo, setUserInfo] = useState({})

    const { run } = useRequest(updateProfile, { manual: true })
    const { data, loading, error } = useRequest(getProfile, {
        onSuccess(result, params) {
            const { sign, datas } = result
            const data = datas[0]
            if (sign === '1') {
                setAvatar(data.avatar)
                setUserInfo(data);
                localStorage.setItem('user_info', JSON.stringify({
                    ...user_info,
                    avatar: data.avatar
                }))
            }
        },
        onError() {
            message.error('服务器错误,请联系管理员')
        }
    })
    const uploadParams = {
        name: 'file',
        fileList: [avatar],
        showUploadList: false,
        listType: null,
        showTemplate: true,
        templateText: '点击上传',
        templateClass: 'mt-10',
        onChange(res) {
            console.log(res)
            const { path } = res
            setAvatar(path)
            run({ key: 'avatar', value: path })
            //const info = { ...user_info, avatar: path }
            //localStorage.setItem('user_info', JSON.stringify(info))
        }
    }
    console.log(data)
    return (
        <Spin spinning={loading}  >
            <Row className='ml-10' >
                <Col lg={4} xl={3}>
                    <Avatar shape="square" size={100} src={avatar} />
                </Col>
                <Col >
                    <p className='mt-10'>支持 jpg、png 格式大小 5M 以内的图片</p>
                    <UploadImage {...uploadParams} />
                </Col>
            </Row>

            <Row>
                <Col className='mt-30'>
                    <EditableComponent content={userInfo.username} label='用户名' name='username' />
                </Col>
                <Col className='mt-30'>
                    <EditableComponent content={userInfo.email} label='邮箱' name='email' />
                </Col>
                <Col className='mt-30'>
                    <EditableComponent content={userInfo.phone} label='电话' name='phone' />
                </Col>
                <Col className='mt-30'>
                    <EditableComponent content={userInfo.jj} label='简介' name='jj' />
                </Col>
            </Row>

        </Spin>
    )
}

export default ProfilePage
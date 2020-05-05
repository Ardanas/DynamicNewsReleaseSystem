import React, { useState, useEffect } from 'react'
import { Upload, Icon, Button, message, Modal, Row, Col, Spin } from 'antd'
import { useRequest } from '@umijs/hooks';
import api from '../utils/api';
const { addMaterialList } = api
function UploadImage({
    showUploadList = false,
    multiple = false,
    listType = 'picture-card',
    limitType = ['jpeg', 'png'],
    limitSize = 2,
    data = {},
    className = '',
    showTemplate = false,
    templateText = '上传图片',
    templateClass = null,
    fileList = null,
    onChange = null,
    defaultImageUrl = ''

}) {
    console.log('default image', defaultImageUrl)
    const [imageUrl, setImageUrl] = useState('')
    const { run, loading } = useRequest(addMaterialList, {
        manual: true,
        onSuccess: (result, params) => {
            console.log(result)
            const { sign, datas } = result
            //判断是否上传成功，成功则执行
            if (sign === '1') {
                //请求添加到素材库的新接口，
                setImageUrl(datas.path)
                message.info('图片上传成功')
                onChange && onChange(datas)
            } else {
                message.info('图片上传失败')
            }
        }
    });
    useEffect(() => {
        console.log('imageUrl', imageUrl)
        setImageUrl(defaultImageUrl)
    }, [defaultImageUrl])
    const uploadButton = (
        <Icon type="camera" />
    );
    const customRequest = ({ file }) => {
        const form = new FormData();
        form.set('file', file);
        data && form.set('data', data)
        run(form)
    }
    const props = {
        name: 'file',
        fileList,
        listType,
        className,
        multiple,
        accept: 'image/*',
        showUploadList,
        customRequest,
        beforeUpload(file) {
            const isLimitType = limitType.findIndex(item => item === file.type)
            const isLimitSize = file.size / 1024 / 1024 < limitSize;
            if (isLimitType === '-1') {
                message.error(`图片类型只能是${limitType.join(',')}`);
                return isLimitType
            }
            if (!isLimitSize) {
                message.error(`图片大小不能超过${limitSize}MB!`);
                return isLimitSize
            }
            return isLimitType && isLimitSize;
        }
    };

    /*const renderImage = () => {
        return imageUrl ?
            <img src={imageUrl} alt="avatar" className='w-100' />
            :
            defaultImageUrl ?
                <img src={defaultImageUrl} alt="avatar" className='w-100' />
                : uploadButton
    }*/
    const renderImage = imageUrl ?
        <Spin spinning={loading}>
            <img src={imageUrl} alt="avatar" className='w-100' />
        </Spin> : uploadButton

    return (
        <Row>
            <Upload {...props} >
                {
                    showTemplate ? <Button type='primary' className={templateClass}>{templateText}</Button> : renderImage
                }
            </Upload>
        </Row>
    )
}

export default UploadImage
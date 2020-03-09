import React, { useState } from 'react'
import { Upload, Icon, Button, message, Modal, Row, Col } from 'antd'
import { useRequest } from '@umijs/hooks';
import api from '../utils/api';
import defaultConfig from '../common/config'
const { addMaterialList } = api
function UploadImage({
    showUploadList = false,
    multiple = false,
    listType = 'picture-card',
    limitType = ['jpeg', 'png'],
    limitSize = 2,
    data = {},
    className = 'image-uploader',
    showTemplate = false,
    fileList = null,
    template = null,
    onChange = null
}) {

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
            }else{
                message.info('图片上传失败')
            }
        }
    });
    const uploadButton = (
        <div>
            <Icon type={loading ? 'loading' : 'camera'} />
        </div>
    );
    const customRequest = ({ file }) => {
        const form = new FormData();
        form.set('file', file);
        form.set('uid', defaultConfig.uid)
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
    return (
        <Row>
            <Upload {...props} >
                {
                    showTemplate ? (
                        <Button type='primary'>上传图片</Button>
                    ) : (
                        imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton
                    )
                }
            </Upload>
        </Row>
    )
}

export default UploadImage
import React, { useState, useEffect } from 'react'
import { Upload, Icon, Button, message, Modal, Row, Col, Spin } from 'antd'
import { useRequest } from '@umijs/hooks';
import api from '../utils/api';
import { handlePrepareUpload } from '../utils';
const { addMaterialList, verifyFileMd5 } = api
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
    // console.log('default image', defaultImageUrl)
    const [imageUrl, setImageUrl] = useState('')
    const { run, loading } = useRequest(addMaterialList, {
        manual: true,
        onSuccess: (result, params) => {
            console.log(result)
            const { sign, datas } = result;
            const { originalFilename, path } = datas;
            //判断是否上传成功，成功则执行
            if (sign === '1') {
                //请求添加到素材库的新接口，
                setImageUrl(path)
                message.info('图片上传成功')
                onChange && onChange(datas)
            } else {
                message.info('图片上传失败')
            }
        }
    });
    useEffect(() => {
        // console.log('imageUrl', imageUrl)
        setImageUrl(defaultImageUrl)
    }, [defaultImageUrl])
    const uploadButton = (
        <Icon type="camera" />
    );
    const customRequest = ({ file }) => {
        const form = new FormData();
        form.set('file', file);
        console.log("uploadImg", file);
        console.log(handlePrepareUpload(file))
        // 先检验md5
        handlePrepareUpload(file).then(res => {
            const fileid = res;
            console.log('fileid=====', res)
            verifyFileMd5({ fileid }).then((data) => {
                const { sign, code, errMsg = '', datas = {} } = data;
                if (sign === '1') {
                    const { originalFilename, path } = datas
                    if (code === 20010) {
                        message.info('上传成功')
                    } else if (code === 20012) {
                        const form = new FormData();
                        form.set('file', file);
                        form.set('fileid', fileid);
                        form.set('upload_type', 0);
                        run(form)
                    } else if (code === 20011) {
                        message.warning(errMsg)
                    }
                }
            })
        })
        /*handlePrepareUpload(file).then(res => {
            const params = {}
            if (data) {
                form.set('data', data);
                // form.set('md5', res);
                params.formData = form
                params.md5 = res
            }
            console.log("params", params)
            run(params)
        })*/
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
    /*const handlePrepareUpload = (dataFile) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            const spark = new SparkMD5(); //创建md5对象（基于SparkMD5）
            if (dataFile.size > 1024 * 1024 * 10) {
                const item = dataFile.slice(0, 1024 * 1024 * 10); //将文件进行分块 file.slice(start,length)
                fileReader.readAsBinaryString(item); //将文件读取为二进制码
            } else {
                fileReader.readAsBinaryString(dataFile);
            }
            //文件读取完毕之后的处理
            //a639e28526d1809745b46bf1189594fe  6d9efe0c593b1383482feb229318e03a
            fileReader.onload = function (e) {
                spark.appendBinary(e.target.result);
                resolve(spark.end())
            };
            fileReader.onerror = function (e) {
                reject(e)
            }
        })
    };*/
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
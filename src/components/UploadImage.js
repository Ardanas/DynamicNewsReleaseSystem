import React, { useState } from 'react'
import { Upload, Icon, Button, message, Modal } from 'antd'

const { Dragger } = Upload;
function UploadImage() {

    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const uploadButton = (
        <div>
            <Icon type={loading ? 'loading' : 'camera'} />
        </div>
    );
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 0.5;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }
    const handleChange = info => {
        console.log(info)
        //重新上传清空地址
        if (imageUrl !== '') {
            setImageUrl('')
        }
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                setImageUrl(imageUrl);
                setLoading(false)
            });
        }
    };
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
    };
    /*
    const props = {
        name: 'file',
        multiple: false,
        accept: 'image',
        showUploadList: false,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 0.5;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },
        onChange(info) {
            console.log(info)
            if (info.file.status === 'uploading') {
                setLoading(true);
                return;
            }
            if (info.file.status === 'done') {
              
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, imageUrl => {
                    console.log(imageUrl)
                    setImageUrl(imageUrl);
                    setLoading(false)
                });
            }
        }

    };*/
    return (
        <>
            {
                /*
                 <Dragger {...props} style={{ padding: 0 }} >
                    <p className="ant-upload-drag-icon">
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', maxHeight: 200, objectFit: 'scale-down' }} /> : uploadButton}
                    </p>
                </Dragger>*/

            }


            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default UploadImage
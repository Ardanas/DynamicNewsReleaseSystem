import React, { useState } from 'react'
import { Button, Icon, Modal, Checkbox, Row, Col, Card, List, Skeleton, Upload, message } from 'antd'
const fileListMock = [
    {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://5b0988e595225.cdn.sohucs.com/images/20200209/c4855dac814e4580bdeaf68080abc5af.jpeg',
    },
    {
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://5b0988e595225.cdn.sohucs.com/images/20200209/7ac923d2ef1a480288ae3cd7750ebf57.jpeg',
    },
    {
        uid: '-3',
        name: 'image.png',
        status: 'done',
        url: 'https://5b0988e595225.cdn.sohucs.com/images/20200209/92bb5bfdd46e4ae6ab56c484a8b91477.png',
    },
    {
        uid: '-4',
        name: 'image.png',
        status: 'done',
        url: 'https://5b0988e595225.cdn.sohucs.com/images/20200209/adbfb6b027f148bdb185f7a59383bbfd.jpeg',
    },
    {
        uid: '-5',
        name: 'image.png',
        status: 'done',
        url: 'https://5b0988e595225.cdn.sohucs.com/images/20200209/7ac923d2ef1a480288ae3cd7750ebf57.jpeg',
    },
    {
        uid: '-6',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-7',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-8',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-9',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }
]

function MaterialPage() {

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [fileList, setFileList] = useState(fileListMock)
    const [selectedList, setSelectedList] = useState([])
    const [isCheckedAll, setIsCheckedAll] = useState(false)
    const [isManageModal, setIsManageModal] = useState(false)

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }


    const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    const handlePreview = (url, e) => {
        console.log(url)
        //e.preventDefault();
        setPreviewVisible(true)
        setPreviewImage(url)

    };
    const handleChange = ({ fileList }) => {
        console.log(fileList)
        setFileList(fileList)
    };
    const handleDelete = (id) => {
        console.log(id)
        Modal.confirm({
            title: '提示信息',
            content: '确定要删除此图片吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                console.log(fileList.filter(item => item.uid !== id))
                setFileList(fileList.filter(item => item.uid !== id));

                if (selectedList.length === fileList.length) {
                    setIsCheckedAll(true)
                }
            }
        })
    }
    const uploadParams = {
        name: 'file',
        action: '/user/file/uploadImg',
        headers: {
            authorization: 'authorization-text',
            // Authorization: 'Bearer ' + localStorage.jwtToken 
        },
        fileList,
        showUploadList: false,
        multiple: true,
        accept: "image/*",
        beforeUpload(file) {
            const isJpgOrPngOrGif = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
            if (!isJpgOrPngOrGif) {
                message.error('只支持jpg/png/gif格式文件');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小不能超过2M');
            }
            return isJpgOrPngOrGif && isLt2M;
        },
        onChange(info) {

            let newFileList = [...info.fileList];
            newFileList = newFileList.map(file => {
                if (file.response) {
                    file.uid = `-${file.uid}`;
                    file.url = file.response.datas.path;
                }
                return {
                    uid: file.uid,
                    name: file.name,
                    status: file.status,
                    url: file.url
                };
            });
            if (info.file.status !== 'uploading') {
                //console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.info(`图片上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`图片上传失败`);
            }
            setFileList(newFileList)

        }
    }

    const handleCheckedAll = e => {
        const { checked } = e.target;
        let uidList = [];
        if (checked) {
            uidList = fileList.reduce((total, currentValue, currentIndex, arr) => {
                return total.concat(currentValue.uid)
            }, [])
        }
        console.log(uidList)
        setSelectedList(uidList)
        setIsCheckedAll(checked)
    }
    const handleCheckd = (e) => {
        const { checked, value } = e.target;
        console.log(checked)
        console.log(value)
        const item = checked ? [...selectedList, value] : selectedList.filter(item => item !== value)
        console.log(item)

        setSelectedList(item)
        console.log(selectedList)

        if (item.length === fileList.length) {
            console.log("nice")
            setIsCheckedAll(true)
        } else {
            setIsCheckedAll(false)
        }

    }

    const handleManageModal = () => {
        setIsManageModal(!isManageModal)
    }

    const handleDeleteChecked = () => {
        let fileListItem = [...fileList];
        selectedList.map(selectedItem => {
            fileListItem = fileListItem.filter(listItem => listItem.uid !== selectedItem)
        })
        setFileList(fileListItem)
    }

    return (
        <>
            <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                <Col span={12}>
                    <Row type='flex' align='middle'>

                        <Checkbox
                            value='checkedAll'
                            onChange={handleCheckedAll}
                            checked={isCheckedAll}
                            style={{ fontSize: 16, display: isManageModal ? 'block' : 'none' }}
                        >
                            全选
                        </Checkbox>
                        <Button onClick={handleManageModal}>
                            {isManageModal ? '取消' : '批量管理'}
                        </Button>
                        <Button
                            disabled={selectedList.length === 0}
                            onClick={handleDeleteChecked}
                            style={{
                                display: isManageModal ? 'block' : 'none',
                                margin: '0 10px'
                            }}
                        >删除选中</Button>
                    </Row>
                </Col>

                <Col span={12} style={{ textAlign: 'right', fontSize: 14, display: !isManageModal ? 'block' : 'none' }}>

                    <span style={{ padding: '0 10px' }}>图片素材共有 {fileList.length} 张</span>
                    <Upload {...uploadParams}>
                        <Button type='primary'>
                            上传照片
                        </Button>
                    </Upload>
                </Col>
            </Row>

            <Checkbox.Group
                style={{ width: '100%' }}
                value={selectedList}
            >
                <List
                    grid={{ gutter: 10, column: 4 }}
                    dataSource={fileList}
                    renderItem={item => (
                        <List.Item>
                            <Skeleton loading={false}>
                                <Card
                                    bodyStyle={{ padding: 10 }}
                                >
                                    <div style={{ width: '100%', height: 156, overflow: 'hidden', backgroundColor: '#f4f4f4', marginBottom: 10 }}>
                                        <img
                                            alt={item.name}
                                            src={item.url}
                                            width='100%'
                                            height='100%'
                                            style={{ cursor: 'pointer', objectFit: 'contain' }}
                                            onClick={() => {
                                                setPreviewVisible(true)
                                                setPreviewImage(item.url)
                                            }}
                                        />
                                    </div>
                                    <Row type='flex' justify='space-around' align='middle'>

                                        <Checkbox
                                            value={item.uid}
                                            onChange={handleCheckd}
                                            style={{ textAlign: 'center', display: isManageModal ? 'block' : 'none' }}
                                        >
                                            <span style={{ fontSize: 16 }}>{item.name}</span>
                                        </Checkbox>
                                        {/*<Icon type="edit" style={{ fontSize: 18 }} color='#333' />*/}
                                        <Row type='flex' align='middle' justify='end' style={{ display: !isManageModal ? 'block' : 'none' }}>

                                            <p style={{ padding: '0 20px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</p>


                                            <Icon
                                                onClick={handleDelete.bind(null, item.uid)}
                                                type="delete"
                                                style={{ fontSize: 18, cursor: 'pointer' }}
                                                color='#333' />

                                        </Row>

                                    </Row>
                                </Card>
                            </Skeleton>
                        </List.Item>
                    )}
                />


            </Checkbox.Group>
            <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>



            {/*
        <div className="clearfix">
            <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 100 ? null : uploadButton}
            </Upload>
            
        </div>
        */}
        </>

    )
}

export default MaterialPage
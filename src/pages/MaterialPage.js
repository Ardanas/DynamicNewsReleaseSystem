import React, { useState, useEffect } from 'react'
import { Button, Icon, Modal, Checkbox, Row, Col, Card, List, Skeleton, Upload, message, Pagination, Spin } from 'antd'
import { useRequest } from '@umijs/hooks';
import defaultConfig from '../common/config'
import UploadImage from '../components/UploadImage'
import api from '../utils/api';
const { getMaterialList } = api
console.log(api)
let fileListMock = [
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

export default function MaterialPage() {


    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [fileList, setFileList] = useState(fileListMock)
    const [selectedList, setSelectedList] = useState([])
    const [isCheckedAll, setIsCheckedAll] = useState(false)
    const [isManageModal, setIsManageModal] = useState(false)



    const { run, cancel, loading } = useRequest(getMaterialList, {
        manual: true,
        //pollingInterval: 1000,
        //pollingWhenHidden: false
    });
    //console.log(data)



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
        action: '/user/addMaterialList',
        data: { uid: defaultConfig.uid },
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

    const uploadParams2 = {
        name: 'file',
        multiple: true,
        fileList,
        showUploadList: false,
        listType: null,
        className: '',
        showTemplate: true,
        onChange(res) {
            console.log(res)
            const { originalFilename, path, status, sourceid } = res
            const item = {
                uid: sourceid,
                name: originalFilename,
                status: status,
                url: path
            }
            setFileList([...fileList, item])
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
        handleToggleActive(checked)
        setSelectedList(uidList)
        setIsCheckedAll(checked)
    }
    const handleCheckd = (e) => {
        const { checked, value } = e.target;
        const item = checked ? [...selectedList, value] : selectedList.filter(item => item !== value)
        console.log(item)

        setSelectedList(item)
        setIsCheckedAll(item.length === fileList.length)


    }

    const handleManageModal = () => {
        setIsManageModal(!isManageModal)
        handleToggleActive(false) // 清除状态
        setSelectedList([])  // 清除选中selectedList
        setIsCheckedAll(false)  // 全选初始化
    }

    const handleToggleActive = (checked) => {
        const item = document.getElementsByClassName('material-item')
        for (let i = 0; i < item.length; i++) {
            const target = item[i]
            checked ? target.classList.add('active') : target.classList.remove('active')
        }
    }

    const handleDeleteChecked = () => {
        let fileListItem = [...fileList];
        selectedList.map(selectedItem => {
            fileListItem = fileListItem.filter(listItem => listItem.uid !== selectedItem)
        })
        Modal.confirm({
            title: '提示信息',
            content: `已选中${selectedList.length}张, 确定要删除吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                setFileList(fileListItem)
                handleToggleActive(false)//删除完毕将选中状态取消
                setSelectedList([]) //置空选中列表
            }
        })
    }

    const handleImgsClick = (item, e) => {
        e.persist()
        console.log(e.target)
        const { url, uid } = item
        if (isManageModal) {
            const { target } = e
            target.classList.toggle('active');
            const _selectedList = target.classList.contains('active') ? [...selectedList, uid] : selectedList.filter(data => data !== uid)
            console.log(_selectedList)
            setSelectedList(_selectedList)
            setIsCheckedAll(_selectedList.length === fileList.length)
        } else {
            setPreviewVisible(true)
            setPreviewImage(url)
        }
    }

    const handleShowSizeChange = (pageNo, pageSize) => {
        console.log(pageNo, pageSize);
    }
    const handlePaginationChange = (pageNo, pageSize) => {
        console.log(pageNo, pageSize);

    }
    return (
        <>
            {/*loading && <Spin />*/}
            <Button onClick={() => {
                run()
            }} loading={loading}>
                test
            </Button>
            <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                <Col span={12}>
                    <Row type='flex' align='middle'>
                        <Checkbox
                            value='checkedAll'
                            onChange={handleCheckedAll}
                            checked={isCheckedAll}
                            style={{ padding: '0 10px', fontSize: 16, display: isManageModal ? 'block' : 'none' }}
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

                <Col span={12} style={{ fontSize: 14, display: !isManageModal ? 'block' : 'none' }}>
                    <Row type='flex' align='middle' justify='end' >
                        <span style={{ padding: '0 10px', display: 'inline-block' }}>图片素材共有 {fileList.length} 张</span>
                        <UploadImage {...uploadParams2} />
                    </Row>
                </Col>
            </Row>
            <Row style={{ width: '100%' }}>
                <Spin spinning={loading}>
                    <List
                        className='listContainer'
                        grid={{ gutter: 10, column: 4 }}
                        dataSource={fileList}
                        renderItem={item => (
                            <List.Item>
                                <Skeleton loading={false}>
                                    <Card
                                        bodyStyle={{ padding: 10, cursor: isManageModal ? 'pointer' : '' }}
                                        onClick={isManageModal ? handleImgsClick.bind(this, item) : undefined}
                                    >
                                        <div
                                            className={isManageModal ? 'material-item' : ''}
                                            onClick={!isManageModal ? handleImgsClick.bind(this, item) : undefined}
                                            style={{ width: '100%', height: 156, overflow: 'hidden', backgroundColor: '#f4f4f4', marginBottom: 10 }}>
                                            <img
                                                alt={item.name}
                                                src={item.url}
                                                width='100%'
                                                height='100%'
                                                style={{ cursor: 'pointer', objectFit: 'contain' }}
                                            />
                                        </div>
                                        <Row type='flex' justify='space-between' align='middle' style={{ width: '100%' }}>
                                            <Col span={21}>
                                                <p
                                                    alt={item.name}
                                                    title={item.name}
                                                    style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', textAlign: 'center' }}>
                                                    {item.name}
                                                </p>
                                            </Col>
                                            <Col span={3}>
                                                <Icon
                                                    onClick={handleDelete.bind(null, item.uid)}
                                                    type="delete"
                                                    style={{ fontSize: 18, cursor: 'pointer', display: isManageModal ? 'none' : 'block' }}
                                                    color='#333' />
                                            </Col>
                                        </Row>
                                    </Card>
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </Spin>
            </Row>
            <Row style={{ textAlign: 'right' }}>
                <Pagination
                    onChange={handlePaginationChange}
                    pageSizeOptions={['10', '20', '30', '40']}
                    showSizeChanger
                    onShowSizeChange={handleShowSizeChange}
                    defaultCurrent={1}
                    total={20}
                />
            </Row>
            <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>

    )
}


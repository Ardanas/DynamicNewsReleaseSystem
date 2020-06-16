import React, { useState } from 'react'
import { Button, Icon, Modal, Checkbox, Row, Col, Card, List, Skeleton, Pagination, Spin } from 'antd'
import { useRequest } from '@umijs/hooks';
import UploadImage from '../components/UploadImage'
import api from '../utils/api';
const { getMaterialList, deleteMaterialList } = api
export default function MaterialPage() {


    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [fileList, setFileList] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [isCheckedAll, setIsCheckedAll] = useState(false)
    const [isManageModal, setIsManageModal] = useState(false)

    const { loading } = useRequest(getMaterialList, {
        onSuccess(result, params) {
            //console.log(result)
            if (result.sign === '1') {
                setFileList(result.datas)
            }
        }
    });

    const { run } = useRequest(deleteMaterialList, {
        manual: true,
        onSuccess(result, params) {
            console.log('delete', result)
            console.log(params[1])
            if (result.sign === '1') {
                params[1] && params[1]()
            }
        }
    });



    const handleDelete = (id) => {
        console.log(id)
        Modal.confirm({
            title: '提示信息',
            content: '确定要删除此图片吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                console.log(fileList.filter(item => item.uid !== id))
                run({ deleteList: [id] }, () => {
                    setFileList(fileList.filter(item => item.systemid !== id));
                    if (selectedList.length === fileList.length) {
                        setIsCheckedAll(true)
                    }
                })

            }
        })
    }

    const uploadParams = {
        name: 'file',
        multiple: true,
        fileList,
        showUploadList: false,
        listType: null,
        className: '',
        showTemplate: true,
        onChange(res) {
            console.log(res)
            const { originalFilename, path, status, size, sourceid } = res
            const item = {
                systemid: `-${sourceid}`,
                filename: originalFilename,
                filepath: path,
                filesize: size,
                status: status
            }
            console.log(fileList)
            setFileList([item, ...fileList])
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
            fileListItem = fileListItem.filter(listItem => listItem.systemid !== selectedItem)
        })
        Modal.confirm({
            title: '提示信息',
            content: `已选中${selectedList.length}张, 确定要删除吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                run({ deleteList: selectedList }, () => {
                    setFileList(fileListItem)
                    handleToggleActive(false)//删除完毕将选中状态取消
                    setSelectedList([]) //置空选中列表
                })
            }
        })
    }

    const handleImgsClick = (item, e) => {
        e.persist()
        console.log(e.target)
        const { filepath, systemid } = item
        if (isManageModal) {
            const { target } = e
            target.classList.toggle('active');
            const _selectedList = target.classList.contains('active') ? [...selectedList, systemid] : selectedList.filter(data => data !== systemid)
            console.log(_selectedList)
            setSelectedList(_selectedList)
            setIsCheckedAll(_selectedList.length === fileList.length)
        } else {
            setPreviewVisible(true)
            setPreviewImage(filepath)
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
            <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                <Col span={12}>
                    <Row type='flex' align='middle'>
                        <Checkbox
                            value='checkedAll'
                            onChange={handleCheckedAll}
                            checked={isCheckedAll}
                            className='fs-16 px-10'
                            style={{ display: isManageModal ? 'block' : 'none' }}
                        >
                            全选
                        </Checkbox>
                        <Button onClick={handleManageModal}>
                            {isManageModal ? '取消' : '批量管理'}
                        </Button>
                        <Button
                            disabled={selectedList.length === 0}
                            onClick={handleDeleteChecked}
                            className='mx-10'
                            style={{
                                display: isManageModal ? 'block' : 'none'
                            }}
                        >删除选中</Button>
                    </Row>
                </Col>

                <Col span={12} className='fs-14' style={{ display: !isManageModal ? 'block' : 'none' }}>
                    <Row type='flex' align='middle' justify='end' >
                        <span className='px-10' style={{ display: 'inline-block' }}>图片素材共有 {fileList.length} 张</span>
                        <UploadImage {...uploadParams} />
                    </Row>
                </Col>
            </Row>
            <Row className='w-100'>
                <Spin spinning={loading}>
                    <List
                        className='list-container'
                        grid={{ gutter: 10, column: 4 }}
                        dataSource={fileList}
                        pagination={{
                            defaultCurrent: 1,
                            total: fileList.length,
                            pageSizeOptions: ['10', '20', '30', '40'],
                            showSizeChanger: true,
                            position: 'bottom'
                        }}
                        renderItem={item => (
                            <List.Item >
                                <Skeleton loading={loading}>
                                    <Card
                                        bodyStyle={{ padding: 10, cursor: isManageModal ? 'pointer' : '' }}
                                        onClick={isManageModal ? handleImgsClick.bind(this, item) : undefined}
                                    >
                                        <div
                                            className={['w-100', 'o-hidden', 'mb-10', isManageModal ? 'material-item' : ''].join(' ')}
                                            onClick={!isManageModal ? handleImgsClick.bind(this, item) : undefined}
                                            style={{ height: 156, backgroundColor: '#f4f4f4' }}>
                                            <img
                                                alt='加载失败'
                                                src={item.filepath}
                                                className='w-100 h-100 pointer img-contain'
                                            />
                                        </div>
                                        <Row type='flex' justify='space-between' align='middle' className='w-100'>
                                            <Col span={21}>
                                                <p
                                                    alt='加载失败'
                                                    title={item.filename}
                                                    className='text-center one-text-ellipsis'>
                                                    {item.filename}
                                                </p>
                                            </Col>
                                            <Col span={3}>
                                                <Icon
                                                    onClick={handleDelete.bind(null, item.systemid)}
                                                    type="delete"
                                                    className='fs-18 pointer'
                                                    style={{ display: isManageModal ? 'none' : 'block' }}
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
            <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="example" className='w-100' src={previewImage} />
            </Modal>
        </>

    )
}


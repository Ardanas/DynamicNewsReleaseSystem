import React, { useState, useEffect } from 'react'
import BraftEditor from 'braft-editor'
import { Button, Drawer, message, Input, Icon, Form, Radio, Checkbox, Tooltip, DatePicker, Modal } from 'antd'
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
import defaultConfig from '../common/config'
import useForm from 'rc-form-hooks';
/*新增表单*/
import RadioList from '../components/RadioList'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';



import TitleInput from '../components/TitleInput'
import EditorModal from '../components/EditorModal'
import UploadImage from '../components/UploadImage'
import ColorPicker from 'braft-extensions/dist/color-picker'
import { ContentUtils } from 'braft-utils'
const Store = window.require('electron-store');
const store = new Store()

BraftEditor.use(ColorPicker({ theme: 'light' }))

const { editorPage: { editorConfig, formConfig } } = defaultConfig
const { TextArea } = Input
//点用户进来时候，路由 分配文章id  
//刚来的时候，根据id去网络请求数据，有则显示  GET 请求
function EditorPage() {
    const { getFieldDecorator, validateFields, setFieldsValue, errors, values } = useForm();

    const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null))
    const [visible, setVisible] = useState(false)
    const [outputContent, setOutputContent] = useState('')
    const [editorTimeout, setEditorTimeout] = useState(0)
    const [titleInputValue, setTitleInputValue] = useState('')
    const [mdTypeValue, setMdTypeValue] = useState(1)
    const [mdIsScheduledReleaseValue, setMdIsScheduledReleaseValue] = useState(false)
    //let [selectedMaterialList, setSelectedMaterialList] = useState([])
    let editorInstance = null
    //let selectedMaterialList = [] //素材库选择的数据
    useEffect(() => {
        setFieldsValue({
            "mdType": 1, //原创
            "mdIsReproduced": false,
            "mdIsScheduledRelease": false,
            "mdChannel": 'a' //新闻
        })
    }, [])


    const handleEditorChange = (data) => {
        setEditorState(data)
        console.log("change", editorState.toHTML())
        store.set('materialEditorHtml', data.toHTML())
        if (editorTimeout !== 0) {
            clearTimeout(editorTimeout);
        }
        setEditorTimeout(setTimeout(() => {
            console.log('save successful')
        }, 2000))
        //editorTimeout 最后设置 null
    }
    const submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = editorState.toHTML()
        const rawContent = editorState.toRAW()
        const textContent = editorState.toText()

        //const result = await saveEditorContent(htmlContent)
        console.log(htmlContent)
        console.log(rawContent)
        console.log(textContent)
        console.log(textContent.length)
        message.info('保存成功')

    }
    const handlePreview = () => {
        //符合全部要求才可以预览
        setVisible(true)
        console.log(editorInstance.getValue().toHTML())
        setOutputContent(editorInstance.getValue().toHTML())
    }
    const handleDrawerClose = () => {
        setVisible(false)
    }

    const radioProps = {
        values: [
            {
                id: 'abc',
                key: '1',
                value: '无封面',
                component: null
            },
            {
                id: 'abcd',
                key: '2',
                value: '单封面',
                component: <UploadImage key='qweqwe' />
            }
        ],
        defaultValue: '1'
    }
    const inputStyle = {
        width: '100%',
        height: 44,
        outlineStyle: 'none',
        overflowY: 'hidden',
        border: 0,
        fontSize: 32,
        fontWeight: 600,
        resize: 'none',
        lineHeight: 1.4,
        paddingRight: 55
    };
    const handleTitleInputChange = (data) => {
        setTitleInputValue(data)
        handleSetFieldsValue(data)
    }
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
    const handleChannelChange = e => {
        console.log(e)
        const { value } = e.target;
        handleSetFieldsValue("mdChannel", value)
    }
    const handleCheckboxChange = (name, callback, e) => {
        console.log(e)
        const { checked } = e.target;
        handleSetFieldsValue(name, checked)
        callback && callback(checked)
    }
    const handleScheduledReleaseValue = (checked) => {
        setMdIsScheduledReleaseValue(checked)
    }

    const handleSetFieldsValue = (key, value) => {
        setFieldsValue({
            [key]: value
        })
    }
    const onRadioChange = (e) => {
        const { value } = e.target;
        handleSetFieldsValue("mdType", value)
        setMdTypeValue(value)
    }

    const disabledDate = (current) => {
        return current && (current < moment().startOf('day') || current > moment().add(15, 'd'))
    }

    const handleMdTypeComponent = (value) => {
        return value === 1 ? getFieldDecorator('mdIsReproduced')(
            <>
                <Checkbox onChange={handleCheckboxChange.bind(this, 'mdIsReproduced', null)}>未经作者允许, 禁止转载 </Checkbox>
                <Tooltip title="显示在新闻简介中">
                    <Icon type="exclamation-circle" style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
            </>
        ) : getFieldDecorator('mdReproducedSource', {
            rules: [{ required: true, message: '请填写信息!' }],
        })(
            <Input
                placeholder="转载类型请注明来源, 来源会显示新闻的简介中" />
        )
    }
    const handleUpload = (params) => {
        console.log(params)
        const { success, error, file, progress, id } = params
        let form = new FormData();
        form.set('file', file);
        fetch('/user/file/uploadImg', {
            method: 'POST',
            body: form
        }).then(res => res.json())
            .then((data) => {
                console.log(data)
                const { sign, datas: { originalFilename, path } } = data
                //判断是否上传成功，成功则执行
                if (sign === '1') {
                    //请求添加到素材库的新接口，
                    success({
                        url: path,
                        meta: {
                            id,
                            title: originalFilename,
                            alt: originalFilename
                        }
                    })
                }
            }).catch(e => {
                console.log(e)
            })
    }
    const mediaParams = {
        uploadFn: handleUpload,
        accepts: {
            video: 'false',
            audio: 'false'
        },
        pasteImage: true
    }
    const handleModalClick = () => {
        const selectedMaterialList = store.get('selectedMaterialList') // 选择的图片对象 
        const editorStateFormModal = BraftEditor.createEditorState(store.get('materialEditorHtml')) //旧的state
      
        if (selectedMaterialList.length !== 0) {
          
            const newEditorState = ContentUtils.insertMedias(editorStateFormModal, selectedMaterialList)
            setEditorState(newEditorState)
            store.set('selectedMaterialList', [])//添加成功，重置
            store.get('materialEditorHtml', '')
        }
    }
    const extendControls = [
        'separator',
        {
            key: 'editor-modal',
            type: 'modal',
            title: '这是一个自定义的下拉组件', // 指定鼠标悬停提示文案
            className: 'editor-modal-btn', // 指定触发按钮的样式名
            html: null, // 指定在按钮中渲染的html字符串
            text: '素材库', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示    
            onClick: () => { }, // 指定触发按钮点击后的回调函数
            modal: {
                id: 'editor-modal', // 必选属性，传入一个唯一字符串即可
                title: '素材库', // 指定弹窗组件的顶部标题
                className: 'editor-modal', // 指定弹窗组件样式名
                width: 800, // 指定弹窗组件的宽度
                height: 500, // 指定弹窗组件的高度
                showFooter: true, // 指定是否显示弹窗组件底栏
                showCancel: true, // 指定是否显示取消按钮
                showConfirm: true, // 指定是否显示确认按钮
                confirmable: true, // 指定确认按钮是否可用
                showClose: true, // 指定是否显示右上角关闭按钮
                closeOnBlur: true, // 指定是否在点击蒙层后关闭弹窗(v2.1.24)
                closeOnConfirm: true, // 指定是否在点击确认按钮后关闭弹窗(v2.1.26)
                closeOnCancel: true, // 指定是否在点击取消按钮后关闭弹窗(v2.1.26)
                cancelText: '取消', // 指定取消按钮文字
                confirmText: '确定', // 指定确认按钮文字
                bottomText: null, // 指定弹窗组件底栏左侧的文字，可传入jsx
                onConfirm: handleModalClick, // 指定点击确认按钮后的回调函数
                onCancel: () => { }, // 指定点击取消按钮后的回调函数
                onClose: () => { }, // 指定弹窗被关闭后的回调函数
                onBlur: () => { }, // 指定蒙层被点击时的回调函数
                children: <EditorModal />, // 指定弹窗组件的内容组件
            }
        }
    ]


    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Item key='abcasdasd' style={{ marginBottom: 0 }}>
                    {getFieldDecorator('mdTitle', {
                        rules: [{ required: true, message: '请输入标题' }],
                    })(
                        <TitleInput onChange={handleTitleInputChange} />
                    )}
                </Form.Item>

                <BraftEditor
                    {...editorConfig}
                    ref={instance => editorInstance = instance}
                    value={editorState}
                    media={mediaParams}
                    extendControls={extendControls}
                    onChange={handleEditorChange}
                    onSave={submitContent}
                    contentStyle={{height: 500}}
                />
                <Form.Item label="封面" key='abcd'>
                    {getFieldDecorator('editorCover')(
                        <UploadImage />
                    )}
                </Form.Item>
                <Form.Item label="类型" key='abcde'>
                    {getFieldDecorator('mdType')(
                        <>
                            <Radio.Group onChange={onRadioChange} value={mdTypeValue}>
                                <Radio value={1}>自制</Radio>
                                <Radio value={2}>转载</Radio>
                            </Radio.Group>
                            <Form.Item key='abcdf'>
                                {
                                    handleMdTypeComponent(mdTypeValue)
                                }
                            </Form.Item>
                        </>
                    )}
                </Form.Item>

                <Form.Item label="分区" key='abcdg'>
                    {getFieldDecorator('mdChannel')(
                        <RadioList dataLists={formConfig.channelList} defaultRadioValue='a' onChange={handleChannelChange} />
                    )}
                </Form.Item>

                <Form.Item label="简介" key='abcdss'>
                    {getFieldDecorator('mdIntroduction')(
                        <TextArea rows={4} placeholder="合适的新闻简介能够提高阅读量" />
                    )}
                </Form.Item>

                <Form.Item >
                    {getFieldDecorator('mdIsScheduledRelease')(
                        <>
                            <Checkbox onChange={handleCheckboxChange.bind(this, 'mdIsScheduledRelease', handleScheduledReleaseValue)}>定时发布</Checkbox>

                            {
                                getFieldDecorator('mdScheduledReleaseTime', {
                                    initialValue: moment().add(4, 'hours')
                                })(
                                    <DatePicker
                                        showToday
                                        showTime
                                        allowClear={false}
                                        locale={locale}
                                        format="YYYY-MM-DD HH:mm"
                                        disabledDate={disabledDate}
                                        style={{ display: !mdIsScheduledReleaseValue ? 'none' : '' }} />
                                )

                            }
                            <Tooltip title="(默认是4小时以后,以北京时间为准, ≥4小时, <15天)">
                                <Icon type="exclamation-circle" style={{ fontSize: '18px', color: '#08c', marginLeft: '10px' }} />
                            </Tooltip>

                        </>
                    )}
                </Form.Item>
                <Form.Item key='abcqqdqqq' style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" size='large'>
                        提交稿件
                    </Button>
                    <Button type="primary" size='large' onMouseDown={handlePreview}>
                        预览
                    </Button>
                    <span style={{ fontSize: 14, color: '#ccc' }}>(实际效果以预览为准)</span>
                </Form.Item>
            </Form>


            <Drawer
                title='内容预览'
                width='80%'
                onClose={handleDrawerClose}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <div style={inputStyle}>{titleInputValue}</div>
                <div className="braft-output-content" dangerouslySetInnerHTML={{ __html: outputContent }}></div>
            </Drawer>
            <p>1. 不支持复制本地图片、但支持复制网络图片和直接拖动本地图片</p>





        </>
    )

}


export default EditorPage;
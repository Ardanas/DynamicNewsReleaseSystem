import React, { useState, useEffect, useRef } from 'react'
import BraftEditor from 'braft-editor'
import { Button, Drawer, message, Input, Icon, Form, Radio, Checkbox, Tooltip, DatePicker, Row, Col, Avatar, Divider } from 'antd'
import ColorPicker from 'braft-extensions/dist/color-picker'
import { ContentUtils } from 'braft-utils'
import useForm from 'rc-form-hooks';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { useRequest } from '@umijs/hooks';
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
import defaultConfig from '../common/config'
import RadioList from '../components/RadioList'
import TitleInput from '../components/TitleInput'
import EditorModal from '../components/EditorModal'
import UploadImage from '../components/UploadImage'
import api from '../utils/api';
const Store = window.require('electron-store');
const store = new Store()
BraftEditor.use(ColorPicker({ theme: 'light' }))
const { editorPage: { editorConfig, formConfig }, uid } = defaultConfig
const { TextArea } = Input
const { addMaterialList, addNews } = api
//点用户进来时候，路由 分配文章id  
//刚来的时候，根据id去网络请求数据，有则显示  GET 请求
function EditorPage() {
    const { getFieldDecorator, validateFields, setFieldsValue, errors, values } = useForm();

    const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null))
    const [visible, setVisible] = useState(false)
    const [outputContent, setOutputContent] = useState('')
    const [editorTimeout, setEditorTimeout] = useState(0)
    const [titleInputValue, setTitleInputValue] = useState('')
    const [introInputValue, setIntroInputValue] = useState('')
    const [mdTypeValue, setMdTypeValue] = useState(0)
    const [mdIsScheduledReleaseValue, setMdIsScheduledReleaseValue] = useState(0)
    const { run, loading } = useRequest(addNews, {
        manual: true,
        onSuccess: (result, params) => {
            if (result.sign === '1') {
                message.info('文章上传成功');
                //清空表单
            } else {
                message.info('文章上传失败')
            }
        }
    });
    //const titleRef = useRef(null)
    //const introductionRef = useRef(null)
    //let [selectedMaterialList, setSelectedMaterialList] = useState([])
    let editorInstance = null
    useEffect(() => {
        /*setFieldsValue({
            "mdType": 1, //原创
            "mdIsReproduced": false,
            "mdIsScheduledRelease": false,
            "mdChannel": 'a' //新闻
        })*/

    }, [])


    const handleEditorChange = (data) => {
        setEditorState(data)
        handleSetFieldsValue('mdContent', data.toRAW())
        //handleSetFieldsValue('mdContentFormat', data.toHTML())
        //console.log("toHTML", editorState.toHTML())
        //console.log("toText", editorState.toText())
        store.set('materialEditorHtml', data.toHTML())
        if (editorTimeout !== 0) {
            clearTimeout(editorTimeout);
        }
        setEditorTimeout(setTimeout(() => {
            console.log('save successful')

        }, 6000))
        //editorTimeout 最后设置 null

    }
    const submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        //const htmlContent = editorState.toHTML()
        //const rawContent = editorState.toRAW()
        //const textContent = editorState.toText()

        //const result = await saveEditorContent(htmlContent)
        /*console.log(htmlContent)
        console.log(rawContent)
        console.log(textContent)
        console.log(textContent.length)*/
        message.info('保存成功')

    }
    const handlePreview = () => {
        //符合全部要求才可以预览
        /*validateFields().then(res => {
            console.log(res)
            setVisible(true)
            console.log(editorInstance.getValue().toHTML())
            setOutputContent(editorInstance.getValue().toHTML())
        })*/
        setVisible(true)
        console.log(editorInstance.getValue().toHTML())
        console.log(editorState.toHTML())
        setOutputContent(editorInstance.getValue().toHTML())
        //setOutputContent(editorState.toHTML())

    }
    const handleDrawerClose = () => {
        setVisible(false)
    }

    const handleTitleInputChange = (key, value) => {
        console.log(key, value)
        key === 'mdTitle' ? setTitleInputValue(value) : setIntroInputValue(value)
        handleSetFieldsValue(key, value)
    }
    const handleSubmit = (e) => {
        console.log(values)
        //console.dir(titleRef.current)
        e.preventDefault();
        validateFields()
            .then(res => {
                console.log({ uid, ...res })
                run({
                    ...res,
                    uid,
                    mdContentForHtml: values.content.toHTML(),
                    mdContentForText: values.content.toText(),
                    mdScheduledReleaseTime: res.mdScheduledReleaseTime ? res.mdScheduledReleaseTime.format('YYYY-MM-DD HH:mm') : ''
                })
            })
            .catch(err => {
                console.log(err)
            });

    };
    const handleChannelChange = e => {
        //console.log(e)
        const { value } = e.target;
        handleSetFieldsValue("mdChannel", value)
    }
    const handleCheckboxChange = (name, callback, e) => {
        //console.log(e)
        const { checked } = e.target;
        handleSetFieldsValue(name, Number(checked))
        callback && callback(Number(checked))
    }
    const handleScheduledReleaseValue = (checked) => {
        setMdIsScheduledReleaseValue(checked)
    }

    const handleSetFieldsValue = (key, value) => {
        setFieldsValue({
            [key]: value
        })
    }
    const handleRadioChange = (e) => {
        const { value } = e.target;
        handleSetFieldsValue("mdType", value)
        setMdTypeValue(value)
    }

    const disabledDate = (current) => {
        return current && (current < moment().startOf('day') || current > moment().add(15, 'd'))
    }

    const handleMdTypeComponent = (value) => {
        return value === 0 ? getFieldDecorator('mdIsReproduced', { initialValue: 0 })(
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
        //console.log(params)
        const { success, error, file, progress, id } = params
        let form = new FormData();
        form.set('file', file);
        form.set('uid', uid)
        addMaterialList(form).then(data => {
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
        }, err => {
            console.log(err)
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
                <Form.Item key='mdTitle' style={{ marginBottom: 0, backgroundColor: '#fff' }}>
                    {getFieldDecorator('mdTitle', {
                        rules: [{ required: true, message: '请输入文章标题' }],
                        initialValue: ''
                    })(
                        <TitleInput
                            compClass='title-input-style'
                            defaultHeigt={44}
                            onChange={(value) => handleTitleInputChange('mdTitle', value)}
                            placeholder='请输入文章标题'
                        />
                    )}
                </Form.Item>
                <Form.Item key='mdIntroduction' style={{
                    marginTop: 20,
                    backgroundColor: '#f2f2f5',
                    borderLeft: '6px solid #e6e6e6'
                }}>
                    {getFieldDecorator('mdIntroduction', {
                        initialValue: ''
                    })(
                        <TitleInput
                            compClass='intro-input-style'
                            defaultHeigt={40}
                            onChange={(value) => handleTitleInputChange('mdIntroduction', value)}
                            placeholder='简介(选填)'
                            maxLength={44}
                        />
                    )}
                </Form.Item>

                <Form.Item key='mdContent'>
                    {getFieldDecorator('mdContent', {
                        rules: [{ required: true, message: '请输入文章内容' }],
                        initialValue: ''
                    })(
                        <BraftEditor
                            {...editorConfig}
                            ref={instance => editorInstance = instance}
                            value={editorState}
                            media={mediaParams}
                            extendControls={extendControls}
                            onChange={handleEditorChange}
                            onSave={submitContent}
                            contentStyle={{ height: 500 }}
                        />
                    )}
                </Form.Item>


                <Form.Item label="封面" key='mdCover'>
                    {getFieldDecorator('mdCover', { initialValue: '' })(
                        <UploadImage onChange={(data) => handleSetFieldsValue('mdCover', data.path)} />
                    )}
                </Form.Item>

                <Form.Item label="类型" key='mdType'>
                    {getFieldDecorator('mdType', {
                        initialValue: 0
                    })(
                        <>
                            <Radio.Group onChange={handleRadioChange} value={mdTypeValue}>
                                <Radio value={0}>原创</Radio>
                                <Radio value={1}>转载</Radio>
                            </Radio.Group>
                            <Form.Item key='mdTypeComponent'>
                                {
                                    handleMdTypeComponent(mdTypeValue)
                                }
                            </Form.Item>
                        </>
                    )}
                </Form.Item>

                <Form.Item label="分区" key='mdChannel'>
                    {getFieldDecorator('mdChannel', {
                        initialValue: 'a'
                    })(
                        <>
                            <RadioList
                                dataLists={formConfig.channelList}
                                defaultRadioValue='a'
                                onChange={handleChannelChange}
                            />

                            {/*
                            <Radio.Group
                                defaultValue='a'
                                buttonStyle='solid'
                                onChange={handleRadioChange}
                            >
                                {formConfig.channelList.map((item, index) => {
                                    return (

                                        <Radio.Button
                                            key={item.id}
                                            value={item.key}
                                        >
                                            {item.value}
                                        </Radio.Button>

                                    )
                                })}
                            </Radio.Group>
                            */}
                        </>
                    )}
                </Form.Item>



                <Form.Item key='mdIsScheduledRelease'>
                    {getFieldDecorator('mdIsScheduledRelease', { initialValue: 0 })(
                        <>
                            <Checkbox onChange={handleCheckboxChange.bind(this, 'mdIsScheduledRelease', handleScheduledReleaseValue)}>定时发布</Checkbox>

                            {mdIsScheduledReleaseValue !== 0 &&
                                getFieldDecorator('mdScheduledReleaseTime', {
                                    initialValue: moment().add(4, 'hours')
                                })(
                                    <DatePicker
                                        showToday
                                        showTime
                                        allowClear={false}
                                        locale={locale}
                                        format="YYYY-MM-DD HH:mm"
                                        disabledDate={disabledDate} />
                                )

                            }
                            <Tooltip title="(默认是4小时以后,以北京时间为准, ≥4小时, <15天)">
                                <Icon type="exclamation-circle" style={{ fontSize: '18px', color: '#08c', marginLeft: '10px' }} />
                            </Tooltip>

                        </>
                    )}
                </Form.Item>
                <Form.Item key='submit' style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        提交稿件
                    </Button>
                    <Button type="primary" onMouseDown={handlePreview}>
                        预览
                    </Button>
                    <span style={{ fontSize: 14, color: '#ccc' }}>(实际效果以预览为准)</span>
                </Form.Item>
            </Form>


            <Drawer
                title='文章预览'
                width='80%'
                onClose={handleDrawerClose}
                visible={visible}
                bodyStyle={{ padding: '0 0 80px 0' }}
            >
                <div className='output-cover'>
                    <img
                        src="http://localhost:3333/imgs/bABxpEKWHaVGjkvCdacBl7hf.jpg"
                        alt="加载失败"
                    />
                </div>
                <div style={{padding: '0 24px'}}>
                    <div className='input-style-base title-input-style output-title'>{titleInputValue}</div>
                    <Row className='author-info' type='flex' align='center' justify='space-between'>
                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src="http://localhost:3333/imgs/2QPzVkPUFQuYzqUrsTlDXc1M.jpg" size='large' />
                            <span style={{ paddingLeft: 10 }}>Ardans</span>
                            <Divider type="vertical" />
                            <span>2020-03-09 15:21</span>
                            <Divider type="vertical" />
                            {
                                !mdTypeValue ?
                                    (
                                        <div>
                                            <Icon type="stop" rotate={90} style={{ color: '#fd676f', fontWeight: 'blod' }} />
                                            <span style={{ paddingLeft: 10 }}>未经作者允许, 禁止转载</span>
                                        </div>
                                    ) : (<span>转载于: {values.mdReproducedSource}</span>)
                            }
                        </Col>
                        <Col style={{ margin: 'auto 0' }}>
                            <span>阅读量50+</span>
                        </Col>

                    </Row>
                    <Row className='output-intro' >
                        <p>{introInputValue}</p>
                    </Row>
                    <div className="braft-output-content output-content" dangerouslySetInnerHTML={{ __html: outputContent }}></div>
                </div>

            </Drawer>
            <p>1. 不支持复制本地图片、但支持复制网络图片和直接拖动本地图片</p>
            <p>2. 首行缩进用Tab, 用空格无效</p>





        </>
    )

}


export default EditorPage;
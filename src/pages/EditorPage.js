import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import BraftEditor from 'braft-editor'
import { Button, Drawer, message, Input, Icon, Form, Radio, Checkbox, Tooltip, DatePicker, Row, Col, BackTop, Alert, Spin, Affix } from 'antd'
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
import OutputPreview from '../components/OutputPreview'
import DraftFileList from './FileListPage'
import useData from '../hooks/useApiHook'
import api from '../utils/api';
import { handlePrepareUpload } from '../utils';
const Store = window.require('electron-store');
const { dialog } = window.require('electron').remote
const iconv = window.require('iconv-lite')
const fs = window.require('fs')
const mammoth = window.require('mammoth')
const path = window.require('path')
const store = new Store()
const { editorPage: { editorConfig, formConfig } } = defaultConfig
const { addMaterialList, addNews, getNewsById, updateNews, saveNews, getNews, verifyFileMd5 } = api
const DateFormat = 'YYYY-MM-DD HH:mm:ss'


function EditorPage({ history, location, match }) {
    const { getFieldDecorator, validateFields, setFieldsValue, errors, values, resetFields } = useForm();
    const [visible, setVisible] = useState(false)
    //const [outputContent, setOutputContent] = useState('')
    const [editorTimeout, setEditorTimeout] = useState(null)
    const [valuesTimeout, setValuesTimeout] = useState(null)
    const [editorInstance, setEditorInstance] = useState(null)
    const [previewValue, setPreviewValue] = useState({})
    const [systemid, setSystemid] = useState('')
    const [editorContent, setEditorContent] = useState('')
    //const editorContentPrevious = usePrevious(editorContent)
    const [draftData, draftLoading] = useData(getNews, 0);
    // console.log("draftData", draftData)

    const handleRequestError = () => {
        message.error('服务器错误, 请联系管理员')
    }
    const { run: addRun } = useRequest(addNews, {
        manual: true,
        onSuccess(res, params) {
            console.log(params)
            if (res.sign == '1') {
                setSystemid(res.datas.id)
            }
        },
        onError: handleRequestError
    });
    const { run: updateRun } = useRequest(updateNews, {
        manual: true,
        onSuccess(res, params) {
            if (res.sign == '1') {
                //保存草稿成功 或者 发布文章
                console.log(params)
                const { fbzt = 0 } = params[0]
                !fbzt ? console.log('save draft') : history.push('/nav/success')
            }
        },
        onError: handleRequestError
    })
    const { run: getRun, loading: getLoading } = useRequest(getNewsById, {
        manual: true,
        onSuccess: (result, params) => {
            //初始化数据
            const res = result.datas
            //console.log(res)
            setFieldsValue({
                'mdTitle': res.title,
                'mdIntroduction': res.jj,
                'mdContent': res.content,
                'mdCover': res.cover,
                'mdType': res.lylx,
                'mdIsReproduced': res.sfjzzz,
                'mdReproducedSource': res.zzsm,
                'mdChannel': res.channel,
                'mdIsScheduledRelease': res.sfdsfb,
                //'mdScheduledReleaseTime': res.sfdsfb ? moment(res.dsfbsj) : moment().add(4, 'hours'),
                'mdScheduledReleaseTime': moment().add(4, 'hours'), //全部统一当下时间, 定时发布时间不保存之前的值
            })
            console.log('res.systemid', res.systemid)
            setSystemid(res.systemid)
            store.set('editor_page', {
                newsid: res.systemid
            })
            setEditorContent(res.contentfortext)
            editorInstance.setValue(BraftEditor.createEditorState(res.content))
        }
    })

    useEffect(() => {
        const { search = '', pathname } = location
        const { path, params, url } = match
        console.log(match)
        console.log(location)
        console.log(pathname)
        if (pathname === url) {
            if (search !== '') {
                const sid = search.split('=').pop();
                resetFields()
                getRun(sid)
            }
        } else {
            history.push('/nav/404')
        }
        //setPrevValues(values)
        //document.addEventListener('keydown', handleKeyEvent)
        return () => {
            setEditorTimeout(null)
            setValuesTimeout(null)
            //document.removeEventListener(handleKeyPress)
        }
    }, [match.params.id])

    const handleEditorChange = (data) => {
        setEditorContent(data.toText())
        console.log(editorContent === data.toText())
        if (data.toText() !== editorContent) {
            handleSaveDraft({ ...values })
        }
    }
    const submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        console.log('systemid', systemid)
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
        const params = {
            cover: values.mdCover,
            title: values.mdTitle,
            jj: values.mdIntroduction,
            lylx: values.mdType,
            sfjzzz: values.mdIsReproduced,
            created_at: moment().format('MM-DD HH:mm:ss'),
            zzsm: values.mdReproducedSource || null,
            content: editorInstance.getValue().toHTML(),
        }
        setVisible(true)
        setPreviewValue(params)

        //console.log(editorInstance.getValue().toHTML())
        //console.log(editorState.toHTML())
        //setOutputContent(editorInstance.getValue().toHTML())
        //setOutputContent(editorState.toHTML())

    }


    const handleDrawerClose = () => {
        setVisible(false)
    }

    const handleExcessParams = (data) => {
        const editorState = editorInstance.getValue()
        return {
            ...data,
            mdContent: editorState.toRAW(),
            mdContentForHtml: editorState.toHTML(),
            mdContentForText: editorState.toText(),
            mdScheduledReleaseTime: data.mdScheduledReleaseTime ? data.mdScheduledReleaseTime.format(DateFormat) : '',
            lastTime: moment().format(DateFormat)
        }
    }

    const handleSubmit = (e) => {
        console.log(values)
        e.preventDefault();
        validateFields()
            .then(res => {
                //console.log({ uid, ...res })
                //console.log({ ...params, fbzt: 1, systemid })
                const params = handleExcessParams(res)
                //!isUpdateModel ? addRun(params) : updateRun({ ...params, systemid })
                updateRun({ ...params, fbzt: 1, systemid })
            })
            .catch(err => {
                console.log(err)
            });
    };

    const handleSaveDraft = (data) => {
        if (editorTimeout) {
            clearTimeout(editorTimeout);
        }
        setEditorTimeout(setTimeout(() => {
            data.mdType ? delete data.mdIsReproduced : delete data.mdReproducedSource
            const params = handleExcessParams(data)
            console.log(params)
            systemid ? updateRun({ ...params, systemid }) : addRun(params)
        }, 2000))
    }

    const handleSetFieldsValue = (key, value) => {
        if (valuesTimeout) {
            clearTimeout(valuesTimeout);
        }
        setValuesTimeout(setTimeout(() => {
            console.log("key", key)
            setFieldsValue({
                [key]: value
            })
            handleSaveDraft({ ...values, [key]: value })
        }, 500))
    }
    const handleRadioChange = (e) => {
        //const { value } = e.target;
        handleSetFieldsValue("mdType", e.target.value)

        e.target.value ? setFieldsValue({ mdIsReproduced: 0 }) : setFieldsValue({ mdReproducedSource: '' })
        //e.target.value ? delete values.mdIsReproduced : delete values.mdReproducedSource
        //setMdTypeValue(value)
    }

    const disabledDate = (current) => {
        return current && (current < moment().startOf('day') || current > moment().add(15, 'd'))
    }

    const handleMdTypeComponent = (value) => {
        return !value ? getFieldDecorator('mdIsReproduced', { initialValue: 0 })(
            <>
                <Checkbox
                    checked={Boolean(values.mdIsReproduced)}
                    onChange={(e) => handleSetFieldsValue('mdIsReproduced', Number(e.target.checked))}>
                    未经作者允许, 禁止转载
                </Checkbox>
                <Tooltip title="显示在新闻简介中">
                    <Icon type="exclamation-circle" style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
            </>
        ) : getFieldDecorator('mdReproducedSource', {
            //rules: [{ required: true, message: '请填写信息!' }],
            initialValue: ''
        })(
            <Input
                placeholder="转载类型请注明来源"
                value={values.mdReproducedSource}
                onChange={(e) => { handleSetFieldsValue('mdReproducedSource', e.target.value) }}
            />
        )
    }
    const handleUpload = (params) => {
        const { success, error, file, progress, id } = params;
        const { newsid } = store.get('editor_page');
        // 先检验md5
        handlePrepareUpload(file).then(res => {
            const fileid = res;
            verifyFileMd5({ fileid }).then((data) => {
                const { sign, code, errMsg = '', datas = {} } = data;
                if (sign === '1') {
                    const { originalFilename, path } = datas
                    if (code === 20010) {
                        success({
                            url: path,
                            meta: {
                                id,
                                title: originalFilename,
                                alt: originalFilename
                            }
                        })
                    } else if (code === 20012) {
                        const form = new FormData();
                        form.set('file', file);
                        form.set('fileid', fileid)
                        form.set('newsid', newsid)
                        form.set('upload_type', 1)
                        // form.set('params', { fileid, newsid: systemid, upload_type: '1' });
                        addMaterialList(form).then(data => {
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
                        })
                    } else if (code === 20011) {
                        error({
                            url: path,
                            meta: {
                                id,
                                title: originalFilename,
                                alt: originalFilename
                            }
                        })
                        message.warning(errMsg)
                    }
                }
            })
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
        if (selectedMaterialList.length !== 0) {
            const editorStateFormModal = editorInstance.getValue()
            const newEditorState = ContentUtils.insertMedias(editorStateFormModal, selectedMaterialList)
            editorInstance.setValue(newEditorState)
            store.set('selectedMaterialList', [])//添加成功，重置
        }
    }
    const handleSaveImportFiles = (html) => {
        const editorValue = editorInstance.getValue()
        const template = editorValue.toText() !== '' ? `${editorValue.toHTML()} <br/><br/> ${html}` : html
        editorInstance.setValue(BraftEditor.createEditorState(template))
    }
    const handleImportFiles = () => {
        dialog.showOpenDialog({
            title: '选择文件',
            filters: [
                { name: 'files', extensions: ['txt', 'doc', 'docx'] }
            ],
            properties: ['openFile']
        }).then(files => {
            console.log(files)
            const { filePaths, canceled } = files
            if (!canceled) {
                const filetype = path.extname(filePaths[0])
                if (filetype === '.doc' || filetype === '.docx') {
                    mammoth.convertToHtml({ path: filePaths[0] }, {
                        styleMap: [
                            "p[style-name='Section Title'] => h1:fresh",
                            "p[style-name='Subsection Title'] => h2:fresh",
                            'i => strong', 'u => em', 'b => em', "strike => del", "comment-reference => sup"
                        ]
                    }).then(function (result) {
                        console.log(result)
                        const text = result.value; // The raw text
                        handleSaveImportFiles(text)
                    }).done();
                } else {
                    fs.readFile(filePaths[0], (err, data) => {
                        if (err) throw err;
                        const text = iconv.decode(data, 'gbk')
                        const ipHtml = text.toString().replace(/(\r)*\n/g, "<br/>").replace(/\s/g, "&nbsp;") //保留空格和换行
                        handleSaveImportFiles(ipHtml)
                    })
                }
            }
        })
    }
    const extendControls = [
        'separator',
        {
            key: 'editor-modal',
            type: 'modal',
            title: '选择素材库资源', // 指定鼠标悬停提示文案
            className: 'editor-modal-btn', // 指定触发按钮的样式名
            html: null, // 指定在按钮中渲染的html字符串
            text: '素材库', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
            onClick: () => { }, // 指定触发按钮点击后的回调函数
            modal: {
                id: 'editor-modal', // 必选属性，传入一个唯一字符串即可
                title: '素材库', // 指定弹窗组件的顶部标题
                className: 'editor-modal', // 指定弹窗组件样式名
                width: '70%', // 指定弹窗组件的宽度
                //height: 600, // 指定弹窗组件的高度
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
        },
        'separator',
        {
            key: 'my-button', // 控件唯一标识，必传
            type: 'button',
            title: '导入文件到编辑器中', // 指定鼠标悬停提示文案
            className: 'my-button', // 指定按钮的样式名
            html: '', // 指定在按钮中渲染的html字符串
            text: '导入', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
            onClick: () => {
                handleImportFiles()
            },
        }
    ]
    const lg = draftData && draftData.datas.length > 0 ? 19 : 24;
    const xl = draftData && draftData.datas.length > 0 ? 20 : 24;
    return (
        <Spin spinning={getLoading}>
            <Row gutter={16}>
                <Col lg={lg} xl={xl}>
                    <BackTop style={{ right: 25, bottom: 25 }}>
                        <div className="back-top-inner">
                            <Icon type="arrow-up" />
                        </div>
                    </BackTop>
                    <Form onSubmit={handleSubmit}>
                        <Form.Item key='mdTitle' style={{ marginBottom: 0, backgroundColor: '#fff' }}>
                            {getFieldDecorator('mdTitle', {
                                rules: [{ required: true, message: '请输入文章标题' }],
                                initialValue: ''
                            })(
                                <TitleInput
                                    compClass='title-input-style'
                                    defaultHeigt={44}
                                    onChange={(value) => handleSetFieldsValue('mdTitle', value)}
                                    placeholder='请输入文章标题'
                                    defaultValue={values.mdTitle}
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
                                    onChange={(value) => handleSetFieldsValue('mdIntroduction', value)}
                                    placeholder='简介(选填)'
                                    maxLength={44}
                                    defaultValue={values.mdIntroduction}
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
                                    contentClassName='braft-editor-content'
                                    ref={instance => setEditorInstance(instance)}
                                    //value={editorState}
                                    media={mediaParams}
                                    extendControls={extendControls}
                                    onChange={handleEditorChange}
                                    onSave={submitContent}
                                    contentStyle={{ height: 450, whiteSpace: 'pre' }}
                                    draftProps={{
                                        handleDroppedFiles: function (selection, files) {
                                            //console.log(selection.toText())
                                            console.log('asdasd', files)
                                        }
                                    }}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="封面" key='mdCover'>
                            {getFieldDecorator('mdCover', { initialValue: '' })(
                                <UploadImage
                                    className='image-uploader'
                                    defaultImageUrl={values.mdCover}
                                    onChange={(data) => handleSetFieldsValue('mdCover', data.path)}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="类型" key='mdType'>
                            {getFieldDecorator('mdType', {
                                initialValue: 0
                            })(
                                <>
                                    <Radio.Group onChange={handleRadioChange} value={values.mdType}>
                                        <Radio value={0}>原创</Radio>
                                        <Radio value={1}>转载</Radio>
                                    </Radio.Group>
                                    <Row>
                                        {handleMdTypeComponent(values.mdType)}
                                    </Row>
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
                                        defaultRadioValue={values.mdChannel}
                                        onChange={(e) => handleSetFieldsValue("mdChannel", e.target.value)}
                                    />
                                </>
                            )}
                        </Form.Item>
                        <Form.Item key='mdIsScheduledRelease'>
                            {getFieldDecorator('mdIsScheduledRelease', { initialValue: 0 })(
                                <>
                                    <Checkbox
                                        checked={Boolean(values.mdIsScheduledRelease)}
                                        onChange={(e) => handleSetFieldsValue('mdIsScheduledRelease', Number(e.target.checked))}
                                    >定时发布</Checkbox>

                                    {values.mdIsScheduledRelease ?
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
                                        ) : null
                                    }
                                    <Tooltip title="(默认是4小时以后,以北京时间为准, ≥4小时, <15天)">
                                        <Icon type="exclamation-circle" style={{ fontSize: '18px', color: '#08c', marginLeft: '10px' }} />
                                    </Tooltip>

                                </>
                            )}
                        </Form.Item>
                        <Form.Item key='submit' style={{ textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit">
                                提交稿件
                            </Button>
                            <Button type="primary" onMouseDown={handlePreview} style={{ margin: '0 20px' }} >
                                预览
                            </Button>
                            <span style={{ fontSize: 14, color: '#ccc' }}>(实际效果以预览为准)</span>
                        </Form.Item>
                    </Form>
                    <Row>
                        <Alert
                            message="温馨提示"
                            description={
                                <>
                                    <p>1. 不支持复制本地图片、但支持复制网络图片和直接拖动本地图片</p>
                                    <p>2. 首行缩进用Tab, 用空格无效</p>
                                </>
                            }
                            type="warning"
                            closable
                            showIcon
                        />
                    </Row>
                </Col>
                {
                    draftData && draftData.datas.length > 0 ? (
                        <Col lg={5} xl={4} style={{ background: '#f4f4f5' }}>
                            <DraftFileList
                                listData={draftData}
                                listLoading={draftLoading}
                                systemid={systemid}
                                onChange={sid => {
                                        resetFields();
                                        getRun(sid)
                                    }
                                }
                            />
                        </Col>
                    ) : null
                }
            </Row>

            <Drawer
                title='文章预览'
                width='80%'
                onClose={handleDrawerClose}
                visible={visible}
                bodyStyle={{ padding: '0 0 80px 0' }}
            >
                <OutputPreview {...previewValue} />
            </Drawer>
        </Spin>
    )

}


export default withRouter(EditorPage);
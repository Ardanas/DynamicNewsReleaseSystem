import React from 'react'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Form, Input, Row, Icon, Button, Radio, Checkbox, Tooltip, DatePicker } from 'antd'
import RadioList from '../components/RadioList'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import ShowModal from '../components/ModalComponent'
const { TextArea } = Input;
class MdPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mdTypeValue: 1,
            mdIsChecked: false,
            mdChannelValue: 'a',
            mdIsScheduledReleaseValue: false,
            //modalVisible: false
        }
    }
    componentDidMount() {
        //this.props.form.validateFields();
        const { setFieldsValue } = this.props.form;
        const { mdTypeValue, mdChannelValue, mdIsChecked, mdIsScheduledReleaseValue } = this.state
        setFieldsValue({
            "mdType": mdTypeValue,
            "mdIsReproduced": mdIsChecked,
            "mdIsScheduledRelease": mdIsScheduledReleaseValue,
            "mdChannel": mdChannelValue
        })

        /*this.setState({
            modalVisible: true
        })*/


    }
    handleSubmit = e => {
        console.log(e)
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    handleChange = data => {
        console.log(data)
    }
    onRadioChange = e => {
        const { value } = e.target;
        const { setFieldsValue } = this.props.form;

        this.setState({
            mdTypeValue: value
        });
        setFieldsValue({
            "mdType": value
        })

    }
    handleScheduledReleaseValue = (checked) => {

        this.setState({
            mdIsScheduledReleaseValue: checked
        })

    }
    handleCheckboxChange = (name, callback, e) => {
        console.log(e)
        const { checked } = e.target;
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            [name]: checked
        })
        callback && callback(checked)


    }
    handleChannelChange = e => {
        console.log(e)
        const { value } = e.target;
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            "mdChannel": value
        })
    }
    disabledDate = (current) => {
        return current && (current < moment().startOf('day') || current > moment().add(15, 'd'))
    }
    render() {
        const items = [
            {
                id: '1',
                key: 'a',
                value: '新闻',
            },
            {
                id: '2',
                key: 'b',
                value: '娱乐'
            },
            {
                id: '3',
                key: 'c',
                value: '汽车'
            },
            {
                id: '4',
                key: 'd',
                value: '军事'
            },
            {
                id: '5',
                key: 'e',
                value: '美食'
            },
            {
                id: '6',
                key: 'f',
                value: '财经'
            }

        ]
        const { getFieldDecorator } = this.props.form;
        const { mdTypeValue, mdIsScheduledReleaseValue } = this.state
        //console.log("modalVisible", modalVisible)
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item label="标题" key='abcd'>
                    {getFieldDecorator('mdTitle', {
                        rules: [{ required: true, message: '请输入标题!' }],
                    })(
                        <Input
                            prefix={<Icon type="snippets" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入标题"
                        />
                    )}
                </Form.Item>
                <Form.Item label="类型" key='abcde'>
                    {getFieldDecorator('mdType', {
                        rules: [{ required: true, message: '请选择类型!' }],
                    })(
                        <>
                            <Radio.Group onChange={this.onRadioChange} value={mdTypeValue}>
                                <Radio value={1}>自制</Radio>
                                <Radio value={2}>转载</Radio>
                            </Radio.Group>
                            <Row>
                                <Form.Item key='abcdf'>
                                    {
                                        this.state.mdTypeValue == 1 ?
                                            getFieldDecorator('mdIsReproduced')(
                                                <>
                                                    <Checkbox onChange={this.handleCheckboxChange.bind(this, 'mdIsReproduced', null)}>未经作者允许, 禁止转载 </Checkbox>
                                                    <Tooltip title="显示在新闻简介中">
                                                        <Icon type="exclamation-circle" style={{ fontSize: '18px', color: '#08c' }} />
                                                    </Tooltip>
                                                </>
                                            ) :
                                            getFieldDecorator('mdReproducedSource', {
                                                rules: [{ required: true, message: '请填写信息!' }],
                                            })(
                                                <Input
                                                    placeholder="转载类型请注明来源, 来源会显示新闻的简介中" />
                                            )
                                    }
                                </Form.Item>
                            </Row>
                        </>
                    )}
                </Form.Item>

                <Form.Item label="分区" key='abcdg'>
                    {getFieldDecorator('mdChannel', {
                        rules: [{ required: true, message: '请选择分区!' }]
                    })(
                        <RadioList dataLists={items} defaultRadioValue='a' onChange={this.handleChannelChange} />
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
                            <Checkbox onChange={this.handleCheckboxChange.bind(this, 'mdIsScheduledRelease', this.handleScheduledReleaseValue)}>定时发布</Checkbox>

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
                                        disabledDate={this.disabledDate}
                                        style={{ display: !mdIsScheduledReleaseValue ? 'none' : '' }} />
                                )

                            }
                            <Tooltip title="(默认是4小时以后,以北京时间为准, ≥4小时, <15天)">
                                <Icon type="exclamation-circle" style={{ fontSize: '18px', color: '#08c', marginLeft: '10px' }} />
                            </Tooltip>

                        </>
                    )}
                </Form.Item>


                <Form.Item label="内容" key='abcdqqq'>
                    {getFieldDecorator('mdContent', {
                        rules: [{ required: true, message: '内容不能为空!' }],
                    })(
                        <SimpleMDE onChange={this.handleChange} />
                    )}
                </Form.Item>
                <Form.Item key='abcqqdqqq' style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" size='large'>
                        提交稿件
                    </Button>
                </Form.Item>
                
            </Form>
        )
    }
}


export default Form.create()(MdPage);
import React, { useState } from 'react'
import { Modal } from 'antd'
import btn_close from '../common/modal/img/btn-close.png'

/*function ModalComponent({ modalVisible = false, title, template, handleOkChange = null, handleCancelChange = null }) {
    console.log(modalVisible)
    //const [visible, setVisible] = useState(modalVisible)
    //console.log(visible)
    let visible = modalVisible;
    console.log(visible)
    const handleOk = e => {
        //setVisible(false)
        handleOkChange && handleOkChange(e)
    }
    const handleCancel = e => {
        //setVisible(false)
        visible = false
        console.log(visible)
        handleCancelChange && handleCancelChange(e)
    }
    return (
        <Modal
            title={title}
            visible={visible}
            onCancel={handleCancel}
            footer={[
            ]}
            closeIcon={<img src={btn_close} />}
        >
            {template}
        </Modal>
    )
}*/
class ModalComponent extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
            visible: true
        }
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    render() {
        const { title = '提示信息', template = '' } = this.props
        return (
            <Modal
                title={title}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                footer={[
                ]}
                closeIcon={<img src={btn_close} />}
            >
                {template}
            </Modal>
        )
    }
}
export default ModalComponent

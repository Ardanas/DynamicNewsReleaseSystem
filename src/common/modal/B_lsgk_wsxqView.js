/**
 * Created on 2019-08-21 10:23:23 by admin
 * Copyright SinoBest, 2010-2018, All rights reserved.
 */
/* eslint-disable camelcase */
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import classNames from 'classnames';
import { Form, Row, Col, Card, Steps } from 'antd';
import styles from '../../../../common/formStyles.less';
import constants from '../../../../common/Constants';
import WaterMark from '../../../../utils/WaterMark';
import { Decrypt } from '../../../../common/aesutil';
const { Step } = Steps;
const { COL_LAYOUT } = constants;
@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced']
}))
class B_lsgk_wsxqView extends Component {
  componentDidMount() {
    const { dispatch, curItem } = this.props;
    console.log("id:" + curItem.writid)
    // dispatch({
    //   type: 'jianbiao/queryWsxx',
    //   payload: {
    //     systemid: curItem.writid
    //   }
    // });
  }

  render() {
    let { wsdata } = this.props.jianbiao;
    wsdata = JSON.parse(Decrypt(wsdata.data.result))
    console.log(wsdata)
    return (
      <div>
        <WaterMark text="广东公安执法信息公开（律师）" opacity="0.1" style={{ marginTop: '45px' }} />
        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <font style={{ "fontSize": '20px' }}> <b>{wsdata.wsmc}</b> </font>
          <div style={{ marginTop: '10px', color: 'gray' }}>
            <span style={{ marginRight: '20px' }}>{wsdata.confirmtime}</span>
            <span>来源：{wsdata.transactunit_cn}</span>
          </div>
        </div>
        <hr size="0.1px" style={{ margin: '10px', height: '0.1px' }} />
        <div style={{ textAlign: 'right' }}>{wsdata.ajwh}</div>
        <div style={{ margin: "50px 10px 15px 15px", fontSize: "15px", lineHeight: "40px", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {wsdata.analysiscase}
        </div>
        <div style={{ textAlign: 'right' }}>{wsdata.confirmtime}</div>
        <div style={{ textAlign: 'right' }}>{wsdata.transactunit_cn}</div>

        {/* <div style={{ margin: '15px', fontSize: '18px' }}>
        <div style={{ display:wsdata.wscode==='A001'?'':"none"}}>
          <div>
            被告知人：<span>{wsdata.receiveby}</span>
          </div>
          <div>
            案件名称：<span>{wsdata.ajmc}</span>
          </div>
          <div>
            告知原因：<span>{wsdata.detailreason}</span>
          </div>
          <div>
            告知决定：<span>{wsdata.compellentstemp}</span>
          </div>
          <div>
            批准时间：<span>{wsdata.confirmtime}</span>
          </div>
        </div> */}
        {/* <div style={{ display:wsdata.wscode==='A009'?'':"none"}}>
          <div>
            <span style={{width:'120px',display:'inline-block',textAlign:'right'}}>告知书类型：</span> <span>{wsdata.cardtype}</span>
          </div>
          <div>
            <span style={{width:'120px',display:'inline-block',textAlign:'right'}}>被告知人：</span> <span>{wsdata.receiveby}</span>
          </div>
          <div>
             <span  style={{width:'120px',display:'inline-block',textAlign:'right'}}>案件名称：</span> <span>{wsdata.ajmc}</span>
          </div>
          <div>
            <span  style={{width:'120px',display:'inline-block',textAlign:'right'}}>告知原因：</span> <span>{wsdata.detailreason}</span>
          </div>
          <div>
            <span  style={{width:'120px',display:'inline-block',textAlign:'right'}}>告知决定：</span> <span>{wsdata.compellentstemp}</span>
          </div>
          <div>
            <span  style={{width:'120px',display:'inline-block',textAlign:'right'}}>批准时间：</span> <span>{wsdata.confirmtime}</span>
          </div>
        </div> */}
        {/* <div style={{ display:wsdata.wscode==='R020'?'':"none"}} >
          <div>
            <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>案件编号：</span> <span>{wsdata.ajbh} </span>
          </div>
          <div>
          <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>案件名称：</span> <span>{wsdata.ajmc}</span>
          </div> */}
        {/* <div>
          <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>文书字：</span> <span>{wsdata.wordofwrit}</span>
          </div>
          <div>
            <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>文书年份：</span> <span>{wsdata.yearofwrit}</span>
          </div>
          <div>
            <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>文字号：</span><span>{wsdata.markofwrit}</span>
          </div> */}
        {/* <div>
            <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>被逮捕人：</span> <span>{wsdata.zwxm}</span>
          </div>
          <div>
            <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>批准或决定机关：</span> <span>{wsdata.confirmbyunit}</span>
          </div>
          <div>
            <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>逮捕时间：</span><span>{wsdata.zdddsj}</span>
          </div>
          <div>
            <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>拘留原因：</span> <span>{wsdata.oldbriefreason}</span>
          </div>
          <div>
            <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>看守所地址：</span> <span>{wsdata.zxddmc}</span>
          </div>
          <div>
            <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>办案单位：</span> <span>{wsdata.transactunit}</span>
          </div>
          <div>
            <span style={{width:'150px',display:'inline-block',textAlign:'right'}}>看守所字典：</span> <span>{wsdata.jkzh}</span>
          </div>
        </div> */}
        {/* <div style={{ display:wsdata.wscode==='R014'?'':"none"}} >
          <div>
           <span style={{width:'100px',display:'inline-block',textAlign:'right'}}>案件编号：</span> <span>{wsdata.ajbh} </span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}>案件名称：</span> <span>{wsdata.ajmc} </span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}></span>被拘留人： <span>{wsdata.zwxm}</span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}></span>法律条款：<span>{wsdata.itemoflaw}</span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}></span>拘留时间：<span>{wsdata.zdddsj}</span>
          </div>
          <div>
           <span style={{width:'100px',display:'inline-block',textAlign:'right'}}></span>拘留原因：<span>{wsdata.oldbriefreason}</span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}></span>办案单位：<span>{wsdata.transactunit}</span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}></span>看守所地址：<span>{wsdata.zxddmc}</span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}></span>填发单位：<span>{wsdata.writetime}</span>
          </div>
        </div>
        <div style={{ display:wsdata.wscode==='R054'?'':"none"}} >
          <div>
           <span style={{width:'100px',display:'inline-block',textAlign:'right'}}>文书编号：</span> <span>{wsdata.writid} </span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}>被处罚人：</span> <span>{wsdata.zwxm} </span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}>处罚事由：</span> <span>{wsdata.oldbriefreason}</span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}>处罚依据：</span><span>{wsdata.itemoflaw}</span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}>处罚结果：</span><span>{wsdata.xxzz}</span>
          </div>
          <div>
           <span style={{width:'100px',display:'inline-block',textAlign:'right'}}>承办单位：</span><span>{wsdata.transactunit}</span>
          </div>
          <div>
            <span style={{width:'100px',display:'inline-block',textAlign:'right'}}>处罚日期：</span><span>{wsdata.beginperformtime}</span>
          </div>
        </div>
      </div> */}
      </div>
    );
  }
}
export default connect(({ jianbiao }) => ({ jianbiao }))(Form.create()(B_lsgk_wsxqView));
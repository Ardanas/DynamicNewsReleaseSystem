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
import { Decrypt } from '../../../../common/aesutil';
const { Step } = Steps;
const { COL_LAYOUT } = constants;
@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced']
}))
class B_lsgk_zxcsView extends Component {
  componentDidMount() {
    const { dispatch, curItem } = this.props;

    // dispatch({
    //   type: 'jianbiao/queryzxcsxq',
    //   payload: {
    //     ajbh: curItem.ajbh,
    //     rybh: curItem.rybh
    //   }
    // });
  }

  render() {
    let { datas = [] } = this.props.jianbiao;
    datas = JSON.parse(Decrypt(datas.data.result))
    console.log(datas)
    return (
      <div>
        <Steps style={{ width: '200%' }} current={datas.length} direction="vertical" >
          {
            datas.map((v, k) => {
              return <Step
                title={v.zxcsmc}
                description={
                  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                    <Fragment >
                      执行场所：{v.zxcs}
                    </Fragment>
                    <div>
                      开始时间：{v.cskssj}
                    </div>
                    <div>
                      结束时间：{v.csjssj}
                    </div>
                  </div>
                } />;
            })
          }
        </Steps>
      </div>
    );
  }
}
export default connect(({ jianbiao }) => ({ jianbiao }))(Form.create()(B_lsgk_zxcsView));
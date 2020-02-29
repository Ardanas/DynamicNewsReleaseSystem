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
class B_lsgk_ajhjView extends Component {
  componentDidMount() {
    const { dispatch, curItem } = this.props;
    // dispatch({
    //   type: 'jianbiao/queryajhjxq',
    //   payload: {
    //     ajbh: curItem.ajbh,
    //   }
    // });
  }
  componentDidUpdate() {


  }

  render() {
    let { ajhj = [] } = this.props.jianbiao;
    ajhj = JSON.parse(Decrypt(ajhj.data.result))
    console.log(ajhj)
    return (
      <div>
        <Steps style={{ width: '200%' }} current={ajhj.length} direction="vertical" >
          {
            ajhj.map((v, k) => {
              return <Step
                title={v.type}
                description={
                  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                    <Fragment >
                      立案时间：{v.time}
                    </Fragment>
                    <div>
                      办案民警：{v.ajzbry}
                    </div>
                    <div>
                      单位联系电话：{v.lxdh}
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
export default connect(({ jianbiao }) => ({ jianbiao }))(Form.create()(B_lsgk_ajhjView));
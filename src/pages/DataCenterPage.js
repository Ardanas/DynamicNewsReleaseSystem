import React from 'react'
import { Row, Col, Card, Icon, Statistic } from 'antd'
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
function DataCenterPage() {

    const dataMock = () => {
        let date = []
        let base = +new Date(2019, 9, 3);
        const oneDay = 24 * 3600 * 1000;
        let data = [Math.random() * 300];
        for (let i = 1; i < 300; i++) {
            let now = new Date(base += oneDay);
            date.push([[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'), Math.floor(Math.random() * 1000)]);
            data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
        }
        return date
    }
    const getData = (position = 0) => {
        return lastSenvenDay().map(item => item[position]);
    }

    const lastSenvenDay = () => {
        let date = []
        for (let i = 7; i >= 0; i--) {
            date.push([moment().subtract(i, 'days').format('YYYY-MM-DD'), Math.floor(Math.random() * 1000)])
        }
        console.log(moment().subtract(0, 'days').format('YYYY-MM-DD'))
        return date
    }

    const option = {
        title: {
            left: 'center',
            text: '每日阅读量总数'
        },
        color: ['#4cabce', '#006699'],
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                console.log(params)
                return `
                    日期: ${params[0].axisValue},
                    阅读量为${params[0].data}
                `
            }
        },
        xAxis: {
            type: 'category',
            data: getData()
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: getData(1),
            type: 'line'
        }]
    };

    const option2 = {
        title: {
            left: 'center',
            text: '每日阅读量总数'
        },
        color: ['#4cabce', '#006699'],
        xAxis: {
            type: 'category',
            data: getData()
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: getData(1),
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            }
        }]
    };
    const option3 = {
        title: {
            left: 'center',
            text: '发布时间'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 335, name: '直接访问' },
                    { value: 1548, name: '搜索引擎' },
                    { value: 310, name: '邮件营销' },
                    { value: 234, name: '联盟广告' },
                    { value: 135, name: '视频广告' }

                ]
            }
        ]
    };

    return (
        <Row>
            <Col>
                <Row gutter={16} className='mb-20'>
                    <Col span={8}>
                        <Card>
                            <Statistic title="阅读总数" value={Math.floor(Math.random() * 1000)} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic title="新闻总数" value={Math.floor(Math.random() * 1000)} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="昨日阅读数"
                                value='100'
                                valueStyle={{ color: '#cf1322' }}
                                suffix="↓ 9.3%"
                            />
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col className='mb-20'>
                <ReactEcharts
                    option={option}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{ width: '100%', height: 500 }}
                />
            </Col>
            <Col className='mb-20'>
                <ReactEcharts
                    option={option2}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{ width: '100%', height: 500 }}
                />
            </Col>
            <Col className='mb-20'>
                <ReactEcharts
                    option={option3}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{ width: '100%', height: 500 }}
                />
            </Col>
        </Row>
    )

}

export default DataCenterPage
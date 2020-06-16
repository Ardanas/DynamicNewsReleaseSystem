import { notification } from 'antd'
import SparkMD5 from 'spark-md5'
const tagsColor = {
    lylx: ['#108eea', '#87d068'], //原创、转载
    channel: {
        a: 'green',
        b: 'volano',
        c: 'blue',
        d: 'red',
        e: 'magenta',
        f: 'geekblue'
    },
    fbzt: ['#2db7f5', '#f50']
}

const dictionary = {
    lylx: ['原创', '转载'],
    channel: {
        a: '新闻',
        b: '娱乐',
        c: '汽车',
        d: '军事',
        e: '美食',
        f: '财经'
    },
    fbzt: ['未发布', '已发布']
}

const handleRule = (key) => {
    switch (key) {
        case 'username':
            return {
                rule: /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,16}$/,
                errorTip: '用户名仅支持中英文，数字和下划线，且长度在4-16'
            }
        case 'email':
            return {
                rule: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                errorTip: '请输入正确的邮箱格式'
            }
        case 'phone':
            return {
                rule: /(d+-)?(d{4}-?d{7}|d{3}-?d{8}|^d{7,8})(-d+)?/,
                errorTip: '请输入正确的电话号码'
            }
        default:
            return null;
    }
}
const handleNotification = (message, description, type = 'info', duration = 2.5) => {
    notification[type]({
        message,
        description,
        duration
    });
}
const handlePrepareUpload = (dataFile) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        const spark = new SparkMD5(); //创建md5对象（基于SparkMD5）
        if (dataFile.size > 1024 * 1024 * 10) {
            const item = dataFile.slice(0, 1024 * 1024 * 10); //将文件进行分块 file.slice(start,length)
            fileReader.readAsBinaryString(item); //将文件读取为二进制码
        } else {
            fileReader.readAsBinaryString(dataFile);
        }
        //文件读取完毕之后的处理
        //a639e28526d1809745b46bf1189594fe  6d9efe0c593b1383482feb229318e03a
        fileReader.onload = function (e) {
            spark.appendBinary(e.target.result);
            resolve(spark.end())
        };
        fileReader.onerror = function (e) {
            reject(e)
        }
    })
};
export {
    tagsColor,
    dictionary,
    handleRule,
    handleNotification,
    handlePrepareUpload
}
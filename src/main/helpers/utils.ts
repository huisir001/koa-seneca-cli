/*
 * @Description: 工具脚本
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 15:47:26
 * @LastEditTime: 2022-04-22 17:12:53
 */

import Module from "module"

/**
 * 格式化时间戳
 * 
 * @param {Number} timeStamp 传入的时间戳
 * @param {String} startType 要返回的时间字符串的格式类型：月M,分钟m
 * 如：yyyyMMdd,yyyy-MM-dd,yyyy-M-d,yyyy/MM/dd,yyyy/M/d,yyyy-MM,yyyy-M,yyyy年M月d日,yyyy年M月,M月d日
 * 如：yyyy-MM-dd hh:mm:ss,yyyy-MM-dd hh:mm,yyyy/MM/dd hh:mm:ss,yyyy年M月d日 h点m分s秒 
 * 也可以传\n\r等换行符
 * 注意：这里统一按24小时制,timeStamp可以是日期对象，也可以是时间戳,timeType可以不传
 */
export const formatDate = (timeStamp: Date | string | number, timeType: string): string => {
    //统一按24小时制
    const timeStampTypes = ['Date', 'String', 'Number']
    if (!timeStampTypes.includes(timeStamp.constructor.name)) {
        throw new Error(
            `Type check failed for argument "${timeStamp}".`
        )
    }
    const date =
        timeStamp instanceof Date ? timeStamp : new Date(+timeStamp)
    const getFullNum = (num: number) => (num < 10 ? '0' + num : num) //小于两位补零
    const format = {
        yyyy: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
        MM: getFullNum(date.getMonth() + 1),
        dd: getFullNum(date.getDate()),
        hh: getFullNum(date.getHours()),
        mm: getFullNum(date.getMinutes()),
        ss: getFullNum(date.getSeconds()),
        day: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
    }
    let reformat = function (typeStr: string, str: string) {
        if (typeStr.includes(str) && typeStr.split(str).length - 1 == 1) {
            return typeStr.replace(str, format[str])
        } else {
            return typeStr
        }
    }

    let result = ''
    for (let key in format) {
        result = reformat(result || timeType || 'yyyy-MM-dd', key)
    }
    return result
}
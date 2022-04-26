/*
 * @Description: 错误信息
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-26 14:09:24
 * @LastEditTime: 2022-04-26 14:30:25
 */

export default () => {
    return {
        e200(message = '请求失败') {
            throw { message, statusCode: 200 }
        },
        e403(message = '对不起，您暂未登陆') {
            throw { message, statusCode: 403 }
        },
        e401(message = '登陆超时') {
            throw { message, statusCode: 401 }
        },
        e404(message = '路径不存在') {
            throw { message, statusCode: 404 }
        },
        e500(message = '内部服务器错误') {
            throw { message, statusCode: 500 }
        },
        e502(message = '数据库错误') {
            throw { message, statusCode: 502 }
        },
        e504(message = '数据库请求超时') {
            throw { message, statusCode: 504 }
        }
    }
}
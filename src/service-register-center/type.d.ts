/*
 * @Description: 
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 17:45:49
 * @LastEditTime: 2022-04-22 18:26:04
 */

/**
 * 服务注册参数 
 */
interface IServiceRegMsg {
    serviceName: string
    type: 'tcp' | 'http'
    port?: number
    pin?: string
    host?: string
}

/**
 * 答复返回参数
 */
declare interface IResult {
    ok: 0 | 1
    msg: string
    data: any
}
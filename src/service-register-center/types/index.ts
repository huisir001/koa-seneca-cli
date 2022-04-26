/*
 * @Description: 类型定义
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-26 10:11:13
 * @LastEditTime: 2022-04-26 11:24:58
 */

// server数据
interface IServerOpts {
    type: 'tcp' | 'http'
    port?: number
    pin?: string
    host?: string
}

/**
 * 服务注册参数 
 */
interface IServiceRegMsg {
    name: string
    server: IServerOpts
}
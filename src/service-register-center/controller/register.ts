/*
 * @Description: 注册所有服务
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 10:41:24
 * @LastEditTime: 2022-04-24 17:51:29
 */

import http from 'http'

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

export default function (this: any) {

    /**
     * 存储/更新
     */
    this.add('role:register,cmd:save', (msg: IServiceRegMsg, reply: (result: IResult) => void) => {
        const { serviceName, ...server } = msg

        console.log("===rest", server)

        // this.client(server)

        console.log(`服务 ${serviceName} 已注册!`)

        // 这里需要判断服务是否已注册，如已注册则无需client
        // 这里还需要判断服务端口是否被占用

        reply({ ok: 1, msg: `服务 ${serviceName} 已注册!`, data: null })
    })

    /**
     * 查询
     */
    this.add('role:register,cmd:list', () => {

    })

    /**
     * 删除
     */
    this.add('role:register,cmd:delete', () => {

    })

    /**
     * 定时检测服务状态,删除失效实例（http轮询）
     * 这里延时时间久一点，如10分钟一次，每次每个服务检测1分钟
     */
    this.add('role:register,cmd:check', (msg: { delay: number }, reply: Function) => {

        (function checkService(this: any) {
            // this.act('role:register,cmd:list', (res: any) => {
            http.get({ host: '127.0.0.1', port: '8003', path: '/act?cmd=stats&role=seneca' }, (res) => {
                if (res.statusCode !== 200) {
                    // 删除相应数据
                    this.act('role:register,cmd:delete')
                }
            })
            // })

            // setTimeout(checkService, msg.delay)
        })()

        reply(null)
    })

    console.log("==list", this.list())
}
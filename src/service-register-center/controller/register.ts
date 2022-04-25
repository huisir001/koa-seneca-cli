/*
 * @Description: 注册所有服务
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 10:41:24
 * @LastEditTime: 2022-04-25 18:46:15
 */

import http, { Server } from 'http'
import useRedis from '../hooks/useRedis.js'
import useConfig from '../hooks/useConfig.js'
import CONST from '../constant/index.js'

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
     * 初始化操作
     */
    this.add('init:register', (msg: any, respond: Function) => {
        // ...初始化工作，比如连接数据库
        console.log("===初始化")
        respond()
    })

    /**
     * 存储/更新
     */
    this.add('role:register,cmd:save', async (msg: IServiceRegMsg, reply: (result: IResult) => void) => {
        let { name, server } = msg

        console.log("===server", server)

        // 缓存
        await useRedis.hmset(CONST.KEY_SERVICE_REG, { [name]: JSON.stringify(server) })

        console.log(`服务 ${name} 已注册!`)

        // 这里需要判断服务是否已注册，如已注册则无需client
        // 这里还需要判断服务端口是否被占用

        reply({ ok: 1, msg: `服务 ${name} 已注册!`, data: null })
    })

    /**
     * 查询
     */
    this.add('role:register,cmd:list', async (msg: any, reply: any) => {
        const serviceList = await useRedis.hgetall(CONST.KEY_SERVICE_REG)
        console.log("===serviceList", serviceList); // Prints "value"
        reply({ ok: 1, msg: '', data: serviceList })
    })

    /**
     * 删除
     */
    this.add('role:register,cmd:delete', () => {

    })

    /**
     * 定时检测服务状态,删除失效实例（http轮询）
     * 这里延时时间久一点，如10分钟一次，每次每个服务检测1分钟
     * 可作为初始化操作
     */
    this.add('role:register,cmd:check', (msg: { delay: number }, respond: Function) => {

        (async function checkService(this: any) {
            const serviceList = await useRedis.hgetall(CONST.KEY_SERVICE_REG)
            // 遍历所有缓存的服务数据
            for (let serviceName in serviceList) {
                const { host, port } = JSON.parse(serviceList[serviceName])
                http.get({ host, port, path: '/act?cmd=stats&role=seneca' }).on('error', async (e) => {
                    // 请求失败,删除相应数据
                    await useRedis.hdel(CONST.KEY_SERVICE_REG, serviceName)
                })
            }

            // 定时检查
            // setTimeout(checkService, msg.delay)
        })()

        respond()
    })

    console.log("==list", this.list())
}
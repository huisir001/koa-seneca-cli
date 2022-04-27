/*
 * @Description: 注册所有服务
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 10:41:24
 * @LastEditTime: 2022-04-27 18:11:00
 */
import http from 'http'
import redisPool from '../hooks/useRedisPool.js'
import CONST from '../constant/index.js'
import useResult from '../hooks/useResult.js'
import '../types/index.js'
const { succ, fail } = useResult()

/**
 * 初始化
 */
export const init = (msg: any, respond: Function) => {
    (async function checkService(this: any) {
        // 取连接
        const redisConn = await redisPool.getConn()
        const serviceList = await redisConn.hgetall(CONST.KEY_SERVICE_REG)
        // 遍历所有缓存的服务数据
        for (let serviceName in serviceList) {
            const { host, port } = JSON.parse(serviceList[serviceName])
            http.get({ host, port, path: '/act?cmd=stats&role=seneca' }).on('error', async (e) => {
                // 请求失败,删除相应数据
                await redisConn.hdel(CONST.KEY_SERVICE_REG, serviceName)
            })
        }
        // 释放
        redisConn.release()
        // 定时检查：5分钟
        setTimeout(checkService, 1000 * 60 * 5)
    })()
    respond()
}

/**
 * 存储服务信息
 */
export const save = async (msg: any, reply: Function) => {
    let { name, server } = msg

    // 存redis
    // 这里无需判断服务是否已注册，直接覆盖就可
    // 需要判断服务端口是否被占用（判断host和port是否有一致的，这里只是简单判断，无法深究不同host是否指向同一ip）

    // 查所有
    const redisConn = await redisPool.getConn()
    const serviceList = await redisConn.hgetall(CONST.KEY_SERVICE_REG)
    // 遍历所有缓存的服务数据
    for (let serviceName in serviceList) {
        const { host, port } = JSON.parse(serviceList[serviceName])

        // 判断服务端口是否被占用
        if (name !== serviceName && server.host === host && server.port === port) {
            reply(fail(`端口 ${port} 已被占用！`))
            return
        }
    }

    // 存表
    await redisConn.hmset(CONST.KEY_SERVICE_REG, { [name]: JSON.stringify(server) })

    // 释放
    redisConn.release()
    reply(succ(`服务 ${name} 注册成功！`))
}

/**
 * 查询单个服务数据
 * 需要传微服务名称（主路由）
 */
export const findOne = async ({ name }: any, reply: Function) => {
    const redisConn = await redisPool.getConn()
    const service = await redisConn.hget(CONST.KEY_SERVICE_REG, name)
    // 释放
    redisConn.release()
    reply(succ({ data: JSON.parse(service) }))
}
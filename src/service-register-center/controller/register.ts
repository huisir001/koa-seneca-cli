/*
 * @Description: 注册所有服务
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 10:41:24
 * @LastEditTime: 2022-04-26 18:30:07
 */
import http from 'http'
import useRedisPool from '../hooks/useRedisPool.js'
import CONST from '../constant/index.js'
import useResult from '../hooks/useResult.js'
import '../types/index.js'

const redis = useRedisPool.getConn()
const { succ, fail } = useResult()

/**
 * 初始化
 */
export const init = (msg: any, respond: Function) => {
    (async function checkService(this: any) {
        const serviceList = await redis.hgetall(CONST.KEY_SERVICE_REG)
        // 遍历所有缓存的服务数据
        for (let serviceName in serviceList) {
            const { host, port } = JSON.parse(serviceList[serviceName])
            http.get({ host, port, path: '/act?cmd=stats&role=seneca' }).on('error', async (e) => {
                // 请求失败,删除相应数据
                await redis.hdel(CONST.KEY_SERVICE_REG, serviceName)
            })
        }
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
    const serviceList = await redis.hgetall(CONST.KEY_SERVICE_REG)
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
    await redis.hmset(CONST.KEY_SERVICE_REG, { [name]: JSON.stringify(server) })

    reply(succ(`服务 ${name} 注册成功！`))
}

/**
 * 查询单个服务数据
 * 需要传微服务名称（主路由）
 */
export const findOne = async ({ name }: any, reply: Function) => {
    const service = await redis.hget(CONST.KEY_SERVICE_REG, name)
    reply(succ({ data: JSON.parse(service) }))
}
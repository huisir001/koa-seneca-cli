/*
 * @Description: redis 连接池(自创)
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-26 15:06:13
 * @LastEditTime: 2022-04-27 18:13:34
 */
import Redis, { RedisOptions } from './useRedis.js'
import useConfig from './useConfig.js'
import log from './useLog.js'

export interface IPool {
    getConn(): Promise<Redis>
    createConn(): Redis
    closeAll(): void
}

interface IPoolOpts {
    minConnNum: number // 最小连接数
    maxConnNum: number // 最大连接数
    maxWaitTime: number // 最大等待时间
    maxUseTimes: number // 最大使用次数
}

/**
 * 创建连接池及读取连接
 */
class Pool implements IPool {
    private pool: Redis[] = []
    private redisOpts: RedisOptions
    private maxConnNum: number
    private maxWaitTime: number
    private maxUseTimes: number

    /**
     * 初始化连接池
     */
    constructor(redisOpts: RedisOptions, poolOpts: IPoolOpts) {
        // 配置
        this.redisOpts = redisOpts
        this.maxConnNum = poolOpts.maxConnNum
        this.maxWaitTime = poolOpts.maxWaitTime
        this.maxUseTimes = poolOpts.maxUseTimes
        // 连接池中连接数初始化
        while (this.pool.length < poolOpts.minConnNum) {
            this.pool.push(this.createConn())
        }
        log.info('Redis 连接池初始化成功')
    }

    /**
     * 创建数据库连接
     */
    createConn() {
        // 建立新连接
        const conn = new Redis(this.redisOpts, (err) => {
            if (err) {
                log.error("创建数据库连接失败：" + err.toString())
                // 创建连接池属于程序启动初始化脚本，出错时直接抛出错误，中断程序
                throw err
            }
        })

        // 监听是否释放
        // 当客户释放数据库连接时，先判断该连接的引用次数是否超过了规定值
        // 如果超过就从连接池中删除该连接，否则保留为其他客户服务。
        conn.on('release', () => {
            if (conn.useTimes >= this.maxUseTimes) {
                conn.quit().then(() => {
                    this.pool.splice(this.pool.findIndex(({ id }) => id == conn.id), 1)
                }).catch((err) => {
                    log.error(`关闭Redis连接 ${conn.id} 失败：` + err.toString())
                })
            }
        })

        return conn
    }

    /**
     * 读取连接（每次访问时从这里取连接）
     * 连接池管理策略
     * 1.当客户请求数据库连接时，首先查看连接池中是否有空闲连接，如果存在空闲连接，则将连接分配给客户使用
     * 2.如果没有空闲连接，则查看当前所开的连接数是否已经达到最大连接数，如果没达到就重新创建一个连接给请求的客户
     * 3.如果达到就按设定的最大等待时间进行等待，待到有空闲连接（有连接被释放）在将其分配给客户。
     * 4.如果超出最大等待时间，则抛出异常给客户。
     * 5.当客户释放数据库连接时，先判断该连接的引用次数是否超过了规定值，如果超过就从连接池中删除该连接，否则保留为其他客户服务。
     * 6.当应用程序退出时，关闭连接池中所有的连接，释放连接池相关的资源。
     * ！！！注意：每次执行语句完毕之后都要进行手动释放，否则无法进行管理
     */
    async getConn() {
        // 取出第一个可用db
        const conn: Redis | undefined = this.pool.find((item) => !item.lockStatus)

        if (conn) {
            // 上锁
            conn.lock()
            return conn
        } else {
            // 若连接池超过最大连接数,则开启回收机制(将闲置连接关闭出栈,直到连接池保持在最大连接数量)
            // 查看当前所开的连接数是否已经达到最大连接数，如果没达到就重新创建一个连接给请求的客户
            if (this.pool.length < this.maxConnNum) {
                // 未达到最大连接数，新建一个连接给用户
                const newConn = this.createConn()
                this.pool.push(newConn)
                // 上锁
                newConn.lock()
                return newConn
            } else {
                // 如果达到最大连接数就按设定的最大等待时间进行等待，待到有空闲连接（有连接被释放）在将其分配给客户。
                // 故而使得此函数转为异步函数
                // 超时报错，提醒用户检查是否有未释放连接
                const newConn = await this.getConnBySleep()
                if (newConn) {
                    // 上锁
                    newConn.lock()
                    return newConn
                } else {
                    return Promise.reject('Redis连接池获取空闲连接出错，请检查是否有未释放连接！')
                }
            }
        }
    }

    /**
     * 关闭所有连接
     */
    async closeAll(): Promise<void> {
        for (const conn of this.pool) {
            try {
                await conn.quit()
            } catch (error) {
                log.error(`关闭Redis连接 ${conn.id} 失败：` + error.toString())
            }
        }

        this.pool = []
    }

    /**
     * sleep
     * delay:毫秒数
     */
    private sleep(delay: number) {
        return new Promise(resolve => {
            setTimeout(resolve, delay)
        })
    }

    /**
     * 等待-获取空闲连接
     * 递归实现
     * 每次递归等待20毫秒
     */
    private getConnBySleep(): Promise<Redis | undefined> {
        const _this = this
        const itemWaitMs = 20
        return new Promise((resolve) => {
            let tempMs = 0;
            (async function _getConn() {
                const nowMs = Date.now()
                const timeOut = _this.maxWaitTime - tempMs
                await _this.sleep(timeOut <= itemWaitMs ? timeOut : itemWaitMs)
                const conn: Redis | undefined = _this.pool.find((item) => !item.lockStatus)
                // 找到
                if (conn) {
                    resolve(conn)
                } else {
                    // 超时
                    if (timeOut <= itemWaitMs) {
                        resolve(conn)
                    } else {
                        tempMs += (Date.now() - nowMs)
                        _getConn()
                    }
                }
            })()
        })
    }
}

// 初始化数据库连接池
const { redis: { options, pool } } = useConfig()
export default new Pool(options, pool)

/*
 * @Description: redis 连接池(自创)
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-26 15:06:13
 * @LastEditTime: 2022-04-26 18:25:55
 */
import Redis, { RedisOptions } from './useRedis.js'
import useConfig from './useConfig.js'

export interface IPool {
    createConn(): Redis
    getConn(): Redis
    closeAll(): void
}

/**
 * 创建连接池及读取连接
 */
class Pool implements IPool {
    private pool: Redis[] = []
    private opts: RedisOptions
    private maxLen: number

    /**
     * 初始化连接池
     */
    constructor(opts: RedisOptions, initLen: number, maxlen: number) {
        // 配置
        this.opts = opts
        this.maxLen = maxlen
        // 连接池中连接数初始化
        while (this.pool.length < initLen) {
            this.pool.push(this.createConn())
        }
        // Log.info('Redis 连接池初始化成功')
    }

    /**
     * 创建数据库连接
     */
    createConn() {
        return new Redis(this.opts, (err) => {
            if (err) {
                // Log.error("创建数据库连接失败：", err.toString())
            }
        })
    }

    /**
     * 读取连接
     */
    getConn() {
        // 取出第一个可用db
        const db: Redis | undefined = this.pool.find((item) => !item.lockStatus)

        // 是否存在可用db,不存在创建
        if (!db) {
            const conn = this.createConn()
            this.pool.push(conn)
            return conn
        } else {
            // 上锁
            db.lock()

            // 若连接池超过最大连接数,则开启回收机制(将闲置连接关闭出栈,直到连接池保持在最大连接数量)
            let overNum: number = this.pool.length - this.maxLen
            if (overNum > 0) {
                this.pool.forEach((conn, index) => {
                    if (overNum > 0 && !conn.lockStatus) {
                        conn.quit().then(() => {
                            this.pool.splice(index, 1)
                            overNum--
                        }).catch((err) => {
                            // Log.error(`关闭Redis连接 ${conn.id} 失败：`, err.toString())
                        })
                    }
                })
            }

            return db
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
                // Log.error(`关闭Redis连接 ${conn.id} 失败：`, error.toString())
            }
        }

        this.pool = []
    }
}

// 初始化数据库连接池
const { redis: { options, pool } } = useConfig()
export default new Pool(options, pool.initLen, pool.maxLen)

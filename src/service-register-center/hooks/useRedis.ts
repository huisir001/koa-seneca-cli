/*
 * @Description: redis实例（扩展类）
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-24 17:42:26
 * @LastEditTime: 2022-04-27 18:14:05
 */
import Ioredis, { RedisOptions } from 'ioredis'
import { v1 as uuidv1 } from 'uuid'
export type { RedisOptions } from 'ioredis'

export default class Redis extends Ioredis {
    id: string  // 数据库连接对象id
    useTimes: number  // 使用次数
    private locked: boolean = false // 使用时上锁，释放后解锁

    /**
     * 构造方法
     */
    constructor(args: RedisOptions, cb: (err: Error | null, conn?: Redis) => void) {
        // 调用父类的构造函数以便继承父类的构造属性
        // 若在子类构造方法中没有新的任务，可以省略子类的constructor
        super(args)

        // 属性赋值
        this.id = uuidv1()
        this.useTimes = 0

        // 监听连接结果,并回调
        this
            .on('connect', function (this: any) {
                cb(null, this)
            })
            .on('error', function (this: any, err) {
                if (err.syscall === 'connect') {
                    cb(err)
                }
            })
    }

    // 获取锁值
    // 获取方式：redis.lockStatus
    get lockStatus(): boolean {
        return this.locked
    }

    // 加锁
    lock(): void {
        this.locked = true
        // 每次加锁使用时增加次数
        this.useTimes++
    }

    // 释放（解锁）
    // 注意每次执行语句完毕之后都要进行释放
    release(): void {
        this.locked = false
        // 触发release事件便于捕捉
        this.emit('release')
    }
}

// 一般使用hash存取
// 参考：https://github.com/luin/ioredis/blob/main/examples/hash.js

// 若需设置过期时间，由于hash类型不能单条设置，所以可使用`key=group:key`的形式进行分类命名，以此设置整个key的失效时间
// 例：
/*
    const userId = "38748741831290435328"
    const token = "vkmxcvmksldfpakdfjdkgfnkds"
    const expire_time = 60 * 30 // 30分钟
    await redis.set(
        `USER_TOKEN:${userId}`,
        token,
        'EX',
        expire_time
    )
*/

// 规范：key尽量使用大写字母+下划线方式命名
// 每个项目的key尽量有个前缀，避免与其他项目冲突,key值和其他数据库中的表名类似，可取相同前缀。
// 比如项目缩写为ABC，key可以命名为`ABC_USER_TOKEN:36781238167484329`
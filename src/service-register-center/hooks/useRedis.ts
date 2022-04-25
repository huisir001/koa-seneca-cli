/*
 * @Description: redis实例
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-24 17:42:26
 * @LastEditTime: 2022-04-25 16:29:55
 */
import Redis from 'ioredis'
import useConfig from './useConfig.js'

// 创建新的实例
const redis = new Redis(useConfig().redis)

// 测试
//打印日志
redis.on('connect', () => {
    console.log('Redis连接成功')
})

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

export default redis
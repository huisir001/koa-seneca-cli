/*
 * @Description: redis实例
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-24 17:42:26
 * @LastEditTime: 2022-04-24 18:56:46
 */
import Seneca from 'seneca'
import useConfig from './useConfig.js'

// 创建新的实例
const seneca = Seneca()

/**
 * 配置
 * redis://[[username][:password]@][host][:port][/dbNumber]
 * 写密码redis://:123456@127.0.0.1:6379/0 
 * 写用户redis://uername@127.0.0.1:6379/0  
 * 或者不写密码 redis://127.0.0.1:6379/0
 * 或者不写dbNumber redis://:127.0.0.1:6379
 */
const { redis: { username, password, host, port, dbNumber } } = useConfig()
const opts = {
    'redis-store': `redis://${username || ''}${password ? ':' + password : ''}${username || password ? '@' : ''}${host}:${port}/${dbNumber}`
}

// 初始化所需插件
seneca.use('basic')
    .use('entity')
    .use('redis-store', opts)

// 测试
// seneca.ready(() => {
//     const apple = seneca.make('fruit')
//     apple.title = 'Pink Lady'
//     apple.price = 0.99
//     apple.save$((err, apple) => {
//         console.log("apple.id = " + apple.id)
//     })
// })

export default seneca
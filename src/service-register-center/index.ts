/*
 * @Description: 服务入口
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 10:30:44
 * @LastEditTime: 2022-04-27 18:19:33
 */
import Seneca from 'seneca'
import register from './plugins/register.js'
import useConfig from './hooks/useConfig.js'
import log from './hooks/useLog.js'

// 读取配置
const { server } = useConfig()

Seneca()
    .use(register)
    .listen(server)
    .ready((error) => {
        if (error) {
            log.error('微服务注册中心启动失败：' + error.toString())
            throw error
        } else {
            log.info('微服务注册中心启动成功！')
        }
    })
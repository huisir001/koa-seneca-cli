/*
 * @Description: 服务入口
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 10:30:44
 * @LastEditTime: 2022-04-24 17:47:03
 */
import Seneca from 'seneca'
import useConfig from './hooks/useConfig.js'
import serviceRegister from './plugins/serviceRegister.js'


// 读取配置
const { server } = useConfig()

// 读取配置

Seneca()
    .use(serviceRegister)
    .listen(server)
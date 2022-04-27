/*
 * @Description: 注册
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-24 10:33:37
 * @LastEditTime: 2022-04-27 13:12:01
 */
import useConfig from '../hooks/useConfig.js'
import usePackage from '../hooks/usePackage.js'

// 读取配置
const { server, serviceRegisterCenter } = useConfig()
const { name } = usePackage()

export default function serviceRegister(this: any) {
    /**
     * 注册此服务
     */
    this.client(serviceRegisterCenter)
        .act('role:register,cmd:save', { name, server }, console.log)
}
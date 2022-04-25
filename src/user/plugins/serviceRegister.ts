/*
 * @Description: 注册
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-24 10:33:37
 * @LastEditTime: 2022-04-25 18:03:37
 */
import useConfig from '../hooks/useConfig.js'
import usePackage from '../hooks/usePackage.js'

// 读取配置
const { server, serviceRegister } = useConfig()
const { name } = usePackage()

export default function (this: any) {
    /**
     * 注册此服务
     */
    this.client(serviceRegister)
        .act('action:serviceReg', { name, server }, console.log)
}
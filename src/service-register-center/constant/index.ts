/*
 * @Description: 常量
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-25 17:20:11
 * @LastEditTime: 2022-04-25 18:05:21
 */
import useConfig from '../hooks/useConfig.js'

const tablePrefix = useConfig().common.tablePrefix

const CONST = {
    // 服务注册表key
    KEY_SERVICE_REG: tablePrefix + 'SERVICE_REGISTRY',
}

export default CONST
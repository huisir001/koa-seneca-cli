/*
 * @Description: 读取配置文件
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-24 10:29:51
 * @LastEditTime: 2022-04-24 10:29:51
 */
import fs from 'fs'
import YAML from 'yaml'

export default (): any => {
    const yamlFile = fs.readFileSync('application.yaml', 'utf8')
    return YAML.parse(yamlFile)
}
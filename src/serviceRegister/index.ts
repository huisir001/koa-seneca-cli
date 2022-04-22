/*
 * @Description: 服务入口
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 10:30:44
 * @LastEditTime: 2022-04-22 15:18:22
 */
import Seneca from 'seneca'
import serviceClient from './controller/serviceClient.js'
import fs from 'fs'
import YAML from 'yaml'

// 读取配置
const yamlFile = fs.readFileSync('./application.yaml', 'utf8')
const { server } = YAML.parse(yamlFile)

Seneca()
    .use(serviceClient)
    .listen(server)
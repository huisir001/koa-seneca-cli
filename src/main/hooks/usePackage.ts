/*
 * @Description: 读取package.json
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 17:00:57
 * @LastEditTime: 2022-04-22 18:37:30
 */
import fs from 'fs'

export default (): any => {
    const jsonFile = fs.readFileSync('package.json', 'utf8')
    return JSON.parse(jsonFile)
}

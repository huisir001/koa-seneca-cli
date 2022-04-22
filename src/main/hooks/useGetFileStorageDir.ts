/*
 * @Description: 获取文件存储路径
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 17:07:02
 * @LastEditTime: 2022-04-22 17:09:52
 */
import os from 'os'
import path from 'path'
import useYamlConfigParse from './useYamlConfigParse.js'
import usePackageJsonParse from './usePackageJsonParse.js'

// 本地文件存储路径
const { fileStorageDir } = useYamlConfigParse()
const { name } = usePackageJsonParse()
// 默认路径：用户个人文件夹(当前用户的主目录)/程序名称(package.json中的name值)
const defaultFileStorageDir = path.join(os.homedir(), name)

export default () => fileStorageDir || defaultFileStorageDir
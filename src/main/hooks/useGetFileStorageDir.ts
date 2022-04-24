/*
 * @Description: 获取文件存储路径
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 17:07:02
 * @LastEditTime: 2022-04-24 17:45:27
 */
import os from 'os'
import path from 'path'
import useConfig from './useConfig.js'
import usePackage from './usePackage.js'

// 本地文件存储路径
const { fileStorageDir } = useConfig()
const { name } = usePackage()
// 默认路径：用户个人文件夹(当前用户的主目录)/程序名称(package.json中的name值)
const defaultFileStorageDir = path.join(os.homedir(), name)

export default () => fileStorageDir || defaultFileStorageDir
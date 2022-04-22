/*
 * @Description: koaBody配置
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 16:21:18
 * @LastEditTime: 2022-04-22 17:18:37
 */
import fs from 'fs'
import path from 'path'
import { IKoaBodyOptions } from 'koa-body'
import { formatDate } from '../helpers/utils.js'
import useGetFileStorageDir from './useGetFileStorageDir.js'

const fileStorageDir = useGetFileStorageDir()
const uploadDir = path.join(fileStorageDir, 'upload')

export default (): IKoaBodyOptions => {
    return {
        // 严格模式,启用后不会解析 GET, HEAD, DELETE 请求
        strict: true,
        //支持文件上传（是否支持 multipart-formdate 的表单）
        multipart: true,
        //文件上传配置（配置更多的关于 multipart 的选项）
        formidable: {
            uploadDir, // 设置文件上传目录
            keepExtensions: true, // 保留文件的后缀
            maxFieldsSize: 2 * 1024 * 1024, //文件体积最大值2M(默认值2 * 1024 * 1024)
            multiples: true, //支持多文件上传
            // 文件上传之前处理
            onFileBegin: (_, file) => {
                //配置文件保存路径（存到当前月文件夹中）
                const curMonthStr = formatDate(Date.now(), 'yyyyMM')
                const dir = path.join(uploadDir, curMonthStr)

                // 检查文件夹是否存在如果不存在则新建文件夹
                if (!fs.existsSync(dir)) {
                    let pathtmp: string
                    dir.split(path.sep).forEach((dirname) => {
                        if (pathtmp) {
                            pathtmp = path.join(pathtmp, dirname)
                        } else {
                            //如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
                            if (dirname) {
                                pathtmp = dirname
                            } else {
                                pathtmp = '/'
                            }
                        }
                        if (!fs.existsSync(pathtmp)) {
                            fs.mkdirSync(pathtmp)
                        }
                    })
                }

                //改变文件名称及后缀
                const setfileName = Date.now() + path.extname(file.name)

                // 重置 file.path 属性，改变文件上传目录
                file.path = path.join(dir, setfileName)

                //增加属性便于存储和访问(前端使用，因为path为绝对路径不安全)
                file.uploadPath = path.join('upload', curMonthStr, setfileName)
            },
        },
        // 错误处理
        onError: (err) => {
            throw err
        }
    }
}
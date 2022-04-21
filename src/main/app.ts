/*
 * @Description: 主服务启动
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-20 16:28:38
 * @LastEditTime: 2022-04-21 17:00:23
 */
import Koa from 'koa'
import koaBody from 'koa-body'
import path from 'path'
import os from "os"
import Seneca  from 'seneca'
import SenecaWeb from 'seneca-web' // seneca插件，将http请求映射到Seneca
import senecaWebAdapterKoa2 from 'seneca-web-adapter-koa2' // seneca适配koa2
import router from 'routes'


const app = new Koa()
const seneca = Seneca()


/**
 * 处理请求体(入参)中间件
 * 注意以下路径不使用dirname是由于pkg打包后的程序不支持，目前使用相对路径
 * 静态资源文件夹路径在配置文件中设置，绝对路径和相对路径均可
 */
app.use(koaBody({
    // 严格模式,启用后不会解析 GET, HEAD, DELETE 请求
    stict:true,
    //支持文件上传（是否支持 multipart-formdate 的表单）
    multipart: true, 
    //文件上传配置（配置更多的关于 multipart 的选项）
    formidable: {
        uploadDir: path.join(os.homedir(),'upload'), // 设置文件上传目录
        keepExtensions: true, // 保留文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, //文件体积最大值2M(默认值2 * 1024 * 1024)
        multipart: true, //支持多文件上传
        onFileBegin: (_, file) => {
            // 文件上传之前处理

            //配置文件保存路径（存到当前月文件夹中）
            const curMonthStr = formatDate(Date.now(), 'yyyyMM')
            const dir = path.join(
                `${StaticFolderDir}/upload/${curMonthStr}/`
            )

            // 检查文件夹是否存在如果不存在则新建文件夹
            makeDir(fs, path, dir)

            //配置文件名称及后缀
            const setfileName = Date.now() + path.extname(file.name)

            // 重置 file.path 属性，改变文件上传目录
            file.path = dir + setfileName

            //增加属性便于存储和访问(path为绝对路径不安全)
            file.uploadPath = `upload/${curMonthStr}/${setfileName}`
        },
    },
    // 错误处理
    onError: (err) => {
        throw err
    },
}))

// 启动seneca-web插件，映射http路由到seneca
seneca.use(SenecaWeb, {
    // 插件配置
    context: router, // 路由
    adapter: senecaWebAdapterKoa2, // 适配器
    options: { parseBody: false } // 这里拒绝使用SenecaWeb操作body，我们可用另外插件如koa-body
})

//启动路由
// app.use(router.routes())


export default app
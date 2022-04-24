/*
 * @Description: 主服务启动
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-20 16:28:38
 * @LastEditTime: 2022-04-24 17:45:16
 */
import Koa from 'koa'
import koaBody from 'koa-body'
import Seneca from 'seneca'
import Router from 'koa-router'
import useConfig from './hooks/useConfig.js'
import useKoaBodyOptions from './hooks/useKoaBodyOptions.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// seneca web插件 
const SenecaWeb = require('seneca-web') //seneca插件，将http请求映射到Seneca
const senecaWebAdapterKoa2 = require('seneca-web-adapter-koa2') //seneca适配koa2

// 读取配置
const { server, serviceRegister } = useConfig()

// 实例化
const app = new Koa()
const router = new Router()
const seneca = Seneca()

/**
 * 处理请求体(入参)中间件
 * 注意以下路径不使用dirname是由于pkg打包后的程序不支持，目前使用相对路径
 * 静态资源文件夹路径在配置文件中设置，绝对路径和相对路径均可
 */
app.use(koaBody(useKoaBodyOptions()))

// 路由处理
app.use(router.routes())
app.use(router.allowedMethods())

// 服务启用
app.listen(server.port)

// 启动seneca-web插件，映射http路由到seneca
seneca.use(SenecaWeb, {
    // 插件配置
    context: router, // 路由
    adapter: senecaWebAdapterKoa2, // 适配器
    options: { parseBody: false } // 这里拒绝使用SenecaWeb操作body，我们可用另外插件如koa-body
})

// 连接注册中心
seneca.client(serviceRegister)

// 路由匹配
// seneca.ready(() => {
//     app.use(seneca.export('web/context'))
// });

// export default app
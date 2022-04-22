/*
 * @Description: 注册所有服务
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 10:41:24
 * @LastEditTime: 2022-04-22 17:59:34
 */

export default function (this: any) {
    /**
     * 监听新来的微服务
     */
    this.add('action:serviceReg', (msg: IServiceRegMsg, reply: (result: IResult) => void) => {
        const { serviceName, ...server } = msg

        console.log("===rest", server)

        this.client(server)

        console.log(`服务 ${serviceName} 已注册!`)

        // 这里需要判断服务是否已注册，如已注册则无需client
        // 这里还需要判断服务端口是否被占用

        reply({ ok: 1, msg: `服务 ${serviceName} 已注册!`, data: null })
    })
}
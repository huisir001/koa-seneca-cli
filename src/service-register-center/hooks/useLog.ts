/*
 * @Description: 日志打印
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-25 15:15:40
 * @LastEditTime: 2022-04-28 19:09:02
 */

// 由于seneca内置有日志功能，所以这里不需要额外的如log4js等插件
// 可配合PM2插件输出到文件，待测试。由于seneca日志与log4js日志风格不相同，所以这里暂时不适用log4js
// 重要的是可用性，而非形式

import Seneca from 'seneca'

interface ISenecaLogArgs {
    // fatal-致命的
    // 等级
    level: 'info' | 'warn' | 'fatal' | 'error' | 'debug',

    // 消息体
    message: string

    // 条目事件
    case?: 'PRINT' | 'READY' | 'DEBUG'

}

interface ISenecaInstance extends Seneca.Instance {
    log?: (args: ISenecaLogArgs | string) => ISenecaInstance
}

// seneca.log({ level: 'debug', foo: "============debug" }) // 200
// seneca.log({ level: 'info', foo: "============info" }) // 300
// seneca.log({ level: 'warn', foo: "============warn" }) // 400
// seneca.log({ level: 'error', foo: "============error" }) // 500
// seneca.log({ level: 'fatal', foo: "============fatal" }) // 600
// seneca.log({ level: 'none', foo: "============none" }) // 999

class Log {
    private seneca: ISenecaInstance
    constructor(seneca: ISenecaInstance) {
        this.seneca = seneca
    }

    // 调试信息
    debug(message: string, ...args: string[]) {
        this.seneca.log({ level: 'debug', message: message + args.join('') })
    }

    info(message: string, ...args: string[]) {
        this.seneca.log({ level: 'info', message: message + args.join('') })
    }

    warn(message: string, ...args: string[]) {
        this.seneca.log({ level: 'warn', message: message + args.join('') })
    }

    // error会同时打印到终端
    error(message: string, ...args: string[]) {
        this.seneca.log({ level: 'error', message: message + args.join('') })
    }

    fatal(message: string, ...args: string[]) {
        this.seneca.log({ level: 'fatal', message: message + args.join('') })
    }
}

export default new Log(Seneca())
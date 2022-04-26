/*
 * @Description: 日志打印
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-25 15:15:40
 * @LastEditTime: 2022-04-26 19:21:58
 */

// 由于seneca内置有日志功能，所以这里不需要额外的如log4js等插件

import Seneca from 'seneca'

interface IObj {
    [key: string]: any
}

interface ISenecaLogArgs extends IObj {
    // fatal-致命的
    level: 'none' | 'info' | 'warn' | 'fatal' | 'error'
}

// interface ISenecaLogMethods extends IObj {
//     info: (args: IObj) => void
//     warn: (args: IObj) => void
//     debug: (args: IObj) => void
//     fatal: (args: IObj) => void
//     error: (args: IObj) => void
// }

interface ISenecaInstance extends Seneca.Instance {
    log?: (args: ISenecaLogArgs | string) => ISenecaInstance
}

// seneca.log({ level: 'info', foo: "============info" }) // 300
// seneca.log({ level: 'warn', foo: "============warn" }) // 400
// seneca.log({ level: 'error', foo: "============error" }) // 500
// seneca.log({ level: 'fatal', foo: "============fatal" }) // 600
// seneca.log({ level: 'none', foo: "============none" }) // 999

class Log {
    private seneca: ISenecaInstance
    constructor(seneca: ISenecaInstance) {
        this.seneca = seneca
        // let aaa = this.seneca.log({ level: 'info', message: "dajsdbh======" })
        // console.log("====++++aaa", aaa)
    }

    /**
     * 输出到文件
     */
    private output() {

    }

    info(message: string) {
        this.seneca.log({ level: 'info', message })
    }

    warn(message: string) {
        this.seneca.log({ level: 'warn', message })
    }

    error(message: string) {
        this.seneca.log({ level: 'error', message })
    }

    fatal(message: string) {
        this.seneca.log({ level: 'fatal', message })
    }

    print(message: string) {
        this.seneca.log({ level: 'none', message })
    }
}

export default new Log(Seneca())
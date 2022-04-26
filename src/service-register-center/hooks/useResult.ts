/*
 * @Description: 
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-26 11:03:01
 * @LastEditTime: 2022-04-26 11:24:01
 */

/**
 * 答复返回参数
 */
interface IResult {
    msg?: string
    data?: any
}

export default () => {
    const succ = (arg: IResult | string) => {
        let res
        if (typeof arg == 'string') {
            res = {
                ok: 1,
                msg: arg,
            }
        } else {
            const { msg = '成功', data } = arg || {}
            res = {
                ok: 1,
                msg: msg,
                ...(data ? { data } : {}),
            }
        }
        return res
    }


    const fail = (msg = '未知错误') => ({
        ok: 0,
        msg,
    })


    return {
        succ,
        fail
    }
}
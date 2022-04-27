/*
 * @Description: 
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-22 17:45:49
 * @LastEditTime: 2022-04-24 10:27:36
 */

/**
 * 答复返回参数
 */
declare interface IResult {
    ok: 0 | 1
    msg: string
    data: any
}
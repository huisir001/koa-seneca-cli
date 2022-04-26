/*
 * @Description: 服务注册
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-26 10:21:05
 * @LastEditTime: 2022-04-26 11:35:02
 */

import { init, save, findOne } from '../controller/register.js'

function register(this: any) {
    /**
     * 初始化操作
     * 初始化必须在执行完成后调用respond函数
     * 初始化模式名必须为`init:register`,其中register是插件的函数名
     * 插件函数不能为匿名函数
     */
    this.add('init:register', init)

    /**
     * 存储
     */
    this.add('role:register,cmd:save', save)

    /**
     * 查询单个
     */
    this.add('role:register,cmd:findOne', findOne)
}

export default register
/*
 * @Description: 
 * @Autor: HuiSir<273250950@qq.com>
 * @Date: 2022-04-24 12:12:33
 * @LastEditTime: 2022-04-24 12:13:41
 */
import Seneca from 'seneca'

Seneca().add('a:1', (msg, reply) => {
    reply('ok')
})


Seneca().act('a:1', console.log)
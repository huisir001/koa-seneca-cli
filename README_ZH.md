# koa-seneca-cli
Nodejs 微服务实践   

NodeJS在I/O密集型应用中所表现的突出能力使得越来越多的开发者青睐。如今越来越多的应用涉及到的都是I/O方面的业务，故而NodeJS在性能和学习成本方面展现了很大优势。在微服务架构的席卷下，甚至好多大型应用会采用“NodeJS+其他开发语言”这种多语言开发模式进行开发。所以“NodeJS微服务开发”是很有必要的。


## 主要依赖\技术栈

- TypeScript：使用TS方便函数和参数的类型检测
- Koa2：一种以AOP(面向切面编程)的web开发框架，主要思路为洋葱模型和中间件架构
- Seneca：一种基于“模式”的微服务框架，其原理类似于事件(消息)通知
- PM2：强大的Nodejs应用部署器

  

## 架构

| 名称          | 技术模式/框架 | 说明                                                   |
| ------------- | ------------- | ------------------------------------------------------ |
| 网关/负载均衡 | Nginx         | 对前后端的沟通进行统一的管理                           |
| 配置中心      | application.yaml | 每个服务都需配置，配置完成，启动当前服务后会将配置存到注册中心的缓存中  |
| 注册中心      | serviceRegister服务(内置)  | 对所有微服务配置进行管理，服务必须注册登记才能使用       |
| 微服务        | Seneca        | 创建各种单一职责和接口分离模块(插件)，各微服务可分布式部署到不同服务器 |



## 内置服务/功能

| 功能   | 服务/框架 | 端口 |
| ------ | --------- | ---- |
| 数据库 | Mysql     |      |
| 数据模型/实体 | seneca-entity  |      |
| 缓存库 | seneca-entity内置缓存、Redis |      |
| 日志   | Seneca内置 |      |


## 配置文件
yaml配置文件阅读方便，支持多种类型（字符串、数值、布尔值、null、时间戳、数组），可注释，故而用途广泛，比json和ini等好太多。   
Nodejs读写yaml需要用到yaml库。
```js
import YAML from 'yaml'
// 读取
const file = fs.readFileSync('./config.yaml', 'utf8')
const yamlStr = YAML.parse(file)
console.log(yamlStr)
// 写入
const options = {a:1, b:2}
fs.writeFileSync('config.yaml', YAML.stringify(options))
```

## 启动
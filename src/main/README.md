# 主服务

## 前期准备

```Shell
# 使用pnpm管理包，全局安装
npm i pnpm -g

# ts-node 使node在开发时直接运行ts文件
# pnpm i ts-node @types/node -D

# nodemon 监听文件改变自动重启node-server服务（开发需要），全局安装
pnpm i nodemon -g

# typescript和tslint 安装
# pnpm i tslint typescript -D

# 添加ts配置文件和tslint配置文件，这里已添加无需再生成，可修改已有配置
# tsc --init
# tslint --init

# 安装项目依赖
pnpm install
```
# cra-typescript-admin

## components

组件源代码

## 开发过程

1. src/layout/config 添加配置
2. src/pages 添加组件演示代码
3. src/components 添加组件源代码
4. src/pages 引入 src/components中的组件
5. 查看 src/pages 预览
6. 完整 src/components 和 src/pages 代码

## src/components 文件规范

  |-- component
      |-- components        组成组件
      |   |-- A.tsx         组件组件A
      |   |-- B.tsx         组件组件B
      |-- config            组件配置
      |   |-- config.ts     组件配置数据
      |   |-- interface.ts  组件配置接口类型
      |   |-- util.ts       工具函数
      |-- Component.tsx     组件组成源码
      |-- index.tsx         组件输出

## 注意点

### antd 按需加载

1. babel-plugin-import 安装
2. package.json babel 填入
```json
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": "css"
      }
    ]
  ]
}
```

### stylus 支持

1. 安装stylus相关loader

执行 `npm install stylus stylus-loader --save-dev` 或 `yarn add stylus stylus-loader`

2. webpack.config.js 配置stylus


### 配置alias路径

1. webpack.config 配置 alias
2. tsconfig.json 配置 paths
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```
3. 重启IDE才生效

### 格式化工具

1. 安装 prettier-now
2. setting设置

### elint 设置没有立即生效

- 在webpack.config.js 里面有个eslint-loader的配置, cache属性设置的是 true, 把它修改为false, 重启, 你修改的eslintrc就可以生效了
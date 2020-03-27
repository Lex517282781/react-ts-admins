# cra-typescript-admin

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

# 裁剪上传组件

- 配合antd使用
- 依赖: antd upload lodash react-cropper

## 应用场景

- 一般在对图片上传时候需要裁剪满足要求才能上传, 可以选择使用该组件

## API

### clipWidth
- 组件需要裁剪的宽度, 默认为750

### clipHeigth
- 组件需要裁剪的高度, 默认为750

### maxAmount
- 组件可上传的最大图片数量限制, 默认为3

### maxSize
- 组件裁剪之后的大小限制, 默认为0.3 代表300KB
- size为n n小于1的 (n*1000)kb n大于等于1 (n)mb，1000kb-1024kb区间不支持设置

### readonly
- 图片是否可裁剪, 默认为true
- 设置为false的话, 只提供预览





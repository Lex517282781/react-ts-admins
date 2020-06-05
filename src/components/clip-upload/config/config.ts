/** ClipUpload组件 默认值 */
export const defaultClipUploadProps = {
  clipWidth: 750,
  clipHeigth: 750,
  maxAmount: 3,
  maxSize: 0.3,
  verifyWh: false, // 是否校验宽高
  readonly: false,
  minWidth: 10,
  minHeight: 10,
  help: [
    '1. 裁剪完毕之后,点击[确认裁剪]',
    '2. 完成裁剪之后,点击[保存图片]',
    '3. 注: 最小裁剪至10px * 10px'
  ]
}
